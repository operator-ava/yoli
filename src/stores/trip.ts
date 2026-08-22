import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  CITIES,
  cityName,
  DEFAULT_CITY_ORDER,
  DEFAULT_START_DATE,
  MAX_PEOPLE,
  MIN_PEOPLE,
  PACKAGES,
  type CityId,
  type Level,
  type PackageNights,
  type TransferKind,
} from '@/data'
import { calculate, calculatePackage, type TripStop } from '@/composables/calc'
import { planTour } from '@/composables/itinerary'
import { addDays, nightsBetween, nightsOf } from '@/composables/dates'

const STORAGE_KEY = 'yoli.trip'

/** Версия схемы сохранённых данных. Меняем при любой правке формата —
 *  старые данные тогда просто не подхватятся, а не сломают приложение.
 *  v2 — добавлено сворачивание карточек городов.
 *  v3 — пакетные туры: длительность, один тариф на тур, дата начала.
 *       Расчёты, сохранённые конструктором, не подхватываются: в них нет
 *       ни пакета, ни общей даты начала. */
const SCHEMA_VERSION = 3

/** Диапазон дат пребывания в городе: заезд включительно, выезд — день отъезда. */
export interface DateRange {
  from: string
  to: string
}

/** Состояние ввода на экране «Расчёт».
 *  Тариф и даты — по каждому городу отдельно, глобального уровня поездки нет. */
const LEVEL_IDS: Level[] = ['econom', 'medium', 'lux']
const ISO = /^\d{4}-\d{2}-\d{2}$/

function isCity(id: unknown): id is CityId {
  return typeof id === 'string' && (DEFAULT_CITY_ORDER as string[]).includes(id)
}

/** Читаем сохранённое. Всё, что не проходит проверку, молча отбрасывается:
 *  город, которого больше нет, битая дата, чужой уровень. */
const PACKAGE_NIGHTS: PackageNights[] = PACKAGES.map((p) => p.nights)

function load(): {
  people: number
  nights: PackageNights
  startDate: string
  tourLevel: Level | null
  routeOpen: Partial<Record<CityId, boolean>>
  ranges: Partial<Record<CityId, DateRange>>
  levels: Partial<Record<CityId, Level>>
  collapsed: Partial<Record<CityId, boolean>>
} {
  const empty = {
    people: MIN_PEOPLE,
    nights: PACKAGE_NIGHTS[0],
    startDate: DEFAULT_START_DATE,
    tourLevel: null,
    routeOpen: {},
    ranges: {},
    levels: {},
    collapsed: {},
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty
    const data = JSON.parse(raw)
    if (!data || data.v !== SCHEMA_VERSION) return empty

    const people = Number.isFinite(data.people)
      ? Math.min(MAX_PEOPLE, Math.max(MIN_PEOPLE, Math.round(data.people)))
      : MIN_PEOPLE

    const ranges: Partial<Record<CityId, DateRange>> = {}
    for (const [id, r] of Object.entries(data.ranges ?? {})) {
      const range = r as DateRange
      if (!isCity(id) || !range) continue
      if (!ISO.test(range.from ?? '') || !ISO.test(range.to ?? '')) continue
      if (range.to <= range.from) continue
      ranges[id] = { from: range.from, to: range.to }
    }

    const levels: Partial<Record<CityId, Level>> = {}
    for (const [id, l] of Object.entries(data.levels ?? {})) {
      // Тариф без дат смысла не имеет — такие записи отбрасываем.
      if (!isCity(id) || !ranges[id]) continue
      if (!LEVEL_IDS.includes(l as Level)) continue
      levels[id] = l as Level
    }

    // Сворачивание — свойство карточки с датами. Без дат карточка и так
    // одна строка, сворачивать нечего.
    const collapsed: Partial<Record<CityId, boolean>> = {}
    for (const [id, c] of Object.entries(data.collapsed ?? {})) {
      if (!isCity(id) || !ranges[id] || typeof c !== 'boolean') continue
      collapsed[id] = c
    }

    // Пакет: длительность только из списка утверждённых, дата — только ISO.
    const nights = PACKAGE_NIGHTS.includes(data.nights) ? (data.nights as PackageNights) : empty.nights
    const startDate = ISO.test(data.startDate ?? '') ? (data.startDate as string) : empty.startDate
    const tourLevel = LEVEL_IDS.includes(data.tourLevel) ? (data.tourLevel as Level) : null

    // Развёрнутые города блока «Маршрут». Записи нет — город свёрнут.
    const routeOpen: Partial<Record<CityId, boolean>> = {}
    for (const [id, open] of Object.entries(data.routeOpen ?? {})) {
      if (!isCity(id) || typeof open !== 'boolean') continue
      routeOpen[id] = open
    }

    return { people, nights, startDate, tourLevel, routeOpen, ranges, levels, collapsed }
  } catch {
    // Битый JSON или недоступный localStorage — начинаем с чистого
    return empty
  }
}

export const useTripStore = defineStore('trip', () => {
  const saved = load()
  // Меньше двух человек не бывает: ниже MIN_PEOPLE не опускаемся,
  // а сохранённое где-либо меньшее значение подтягиваем до минимума.
  const people = ref(saved.people)

  /** Раскрыт ли блок «Сопровождение YOLI». Состояние общее для всех карточек
   *  и всех городов. В localStorage не сохраняется — живёт только на сессию. */
  const servicesOpen = ref(false)

  // ── Пакетный тур ──────────────────────────────────────────────────────
  // Приложение — витрина трёх пакетов. Длительность одна на весь тур,
  // тариф выбирается ОДИН РАЗ, даты считаются подряд от одной даты начала.

  /** Длительность выбранного пакета в ночах: 7, 10 или 15. */
  const nights = ref<PackageNights>(saved.nights)

  /** Дата начала тура, ISO. Пересечений дат больше не бывает: города идут
   *  подряд, дата выезда из города — она же дата заезда в следующий. */
  const startDate = ref(saved.startDate)

  /** Тариф на ВЕСЬ тур. null — не выбран, панель итога пустая. */
  const tourLevel = ref<Level | null>(saved.tourLevel)

  /** Развёрнутые города блока «Маршрут». Записи нет — город свёрнут:
   *  свёрнутая строка показывает даты и ночи, этого хватает для обзора. */
  const routeOpen = ref<Partial<Record<CityId, boolean>>>(saved.routeOpen)

  function isRouteOpen(id: CityId): boolean {
    return routeOpen.value[id] === true
  }

  function toggleRoute(id: CityId) {
    routeOpen.value = { ...routeOpen.value, [id]: !isRouteOpen(id) }
  }

  function setNights(value: PackageNights) {
    nights.value = value
  }

  function setStartDate(iso: string) {
    startDate.value = iso
  }

  function setTourLevel(level: Level) {
    tourLevel.value = level
  }

  /** Маршрут тура: четыре города с настоящими датами и разложенными по дням
   *  точками. Считается из данных, по дням ничего не захардкожено. */
  const tour = computed(() => planTour(nights.value, startDate.value))

  /** Границы тура: от даты начала до дня вылета. Дни — по календарю. */
  const tourRange = computed(() => {
    const from = startDate.value
    const to = addDays(from, nights.value)
    return { from, to, nights: nights.value, days: nights.value + 1, cities: tour.value.length }
  })

  /** Расчёт пакета. Тариф не выбран — считать нечего. */
  const packageResult = computed(() =>
    tourLevel.value
      ? calculatePackage({ people: people.value, level: tourLevel.value, nights: nights.value })
      : null,
  )

  // ── Свободный конструктор: ОТЛОЖЕН ────────────────────────────────────
  // Состояние и расчёт по городам сохранены целиком и продолжают работать.
  // Пакетный режим их не читает; экран конструктора лежит в src/legacy.
  // Вернём вторым режимом — вернётся и это состояние, без переписывания.

  const ranges = ref<Partial<Record<CityId, DateRange>>>(saved.ranges)
  const levels = ref<Partial<Record<CityId, Level>>>(saved.levels)

  /** Свёрнута ли карточка города. Состояние у каждого города СВОЁ и живёт
   *  в localStorage вместе с расчётом. Записи нет — карточка развёрнута:
   *  город без выбранного тарифа человек должен видеть целиком. */
  const collapsed = ref<Partial<Record<CityId, boolean>>>(saved.collapsed)

  function isCollapsed(id: CityId): boolean {
    return collapsed.value[id] === true
  }

  function toggleCollapsed(id: CityId) {
    collapsed.value = { ...collapsed.value, [id]: !isCollapsed(id) }
  }

  /** Города с датами — по хронологии заезда; следом города без дат. */
  const orderedCities = computed<CityId[]>(() => {
    const withDates = DEFAULT_CITY_ORDER.filter((id) => ranges.value[id])
    withDates.sort((a, b) => ranges.value[a]!.from.localeCompare(ranges.value[b]!.from))
    const withoutDates = DEFAULT_CITY_ORDER.filter((id) => !ranges.value[id])
    return [...withDates, ...withoutDates]
  })

  /** Города с датами в хронологическом порядке. Позиция определяет вид трансфера. */
  const datedCities = computed<CityId[]>(() =>
    orderedCities.value.filter((id) => ranges.value[id]),
  )

  /** Вид трансфера города: первый по календарю едет из аэропорта,
   *  остальные — переездом из предыдущего города. */
  function transferKind(id: CityId): TransferKind {
    return datedCities.value[0] === id ? 'airport' : 'intercity'
  }

  /** Предыдущий город по хронологии. null — если город первый или без дат. */
  function previousCity(id: CityId): CityId | null {
    const i = datedCities.value.indexOf(id)
    return i > 0 ? datedCities.value[i - 1] : null
  }

  /** Города, которые входят в расчёт: есть и даты, и выбранный тариф. */
  const stops = computed<TripStop[]>(() =>
    datedCities.value
      .filter((id) => levels.value[id])
      .map((id) => ({
        cityId: id,
        nights: nightsBetween(ranges.value[id]!.from, ranges.value[id]!.to),
        level: levels.value[id]!,
        transfer: transferKind(id),
      })),
  )

  const result = computed(() =>
    calculate({ people: people.value, stops: stops.value }),
  )

  /** Сводка по всей поездке: границы дат, календарных дней и городов. */
  const summary = computed(() => {
    const dated = datedCities.value
    if (!dated.length) return null
    const from = ranges.value[dated[0]]!.from
    const to = dated.reduce((max, id) => (ranges.value[id]!.to > max ? ranges.value[id]!.to : max), '')
    // Дни СЧИТАЮТСЯ ПО КАЛЕНДАРЮ, а не суммой по городам: даты городов
    // накладываются (Бухара 09–10 и Ташкент 10–12 дают по городам 3+2=5,
    // а по календарю их 4).
    const nights = nightsBetween(from, to)
    return { from, to, nights, days: nights + 1, cities: dated.length }
  })

  /** Занятые ночи других городов: дата → название города.
   *  По ним календарь гасит дни, чтобы наложение было физически невозможно. */
  function busyNights(except: CityId): Map<string, string> {
    const map = new Map<string, string>()
    for (const city of CITIES) {
      if (city.id === except) continue
      const r = ranges.value[city.id]
      if (!r) continue
      for (const night of nightsOf(r.from, r.to)) map.set(night, cityName(city.id))
    }
    return map
  }

  function changePeople(delta: number) {
    people.value = Math.min(MAX_PEOPLE, Math.max(MIN_PEOPLE, people.value + delta))
  }

  function toggleServices() {
    servicesOpen.value = !servicesOpen.value
  }

  function setRange(id: CityId, range: DateRange) {
    ranges.value = { ...ranges.value, [id]: range }
  }

  function clearRange(id: CityId) {
    const next = { ...ranges.value }
    delete next[id]
    ranges.value = next
    // Без дат тариф теряет смысл — сбрасываем вместе.
    const nextLevels = { ...levels.value }
    delete nextLevels[id]
    levels.value = nextLevels
    // И сворачивание вместе с ними: город снова строка «Выберите даты».
    const nextCollapsed = { ...collapsed.value }
    delete nextCollapsed[id]
    collapsed.value = nextCollapsed
  }

  function setLevel(id: CityId, level: Level) {
    levels.value = { ...levels.value, [id]: level }
    // Тариф выбран — карточка сворачивается сама, чтобы человек
    // шёл к следующему городу. Развернуть обратно можно всегда.
    collapsed.value = { ...collapsed.value, [id]: true }
  }

  function reset() {
    people.value = MIN_PEOPLE
    // Пакет возвращается к исходному: длительность первая, дата по умолчанию,
    // тариф не выбран. Маршрут при этом остаётся виден — он и есть витрина.
    nights.value = PACKAGE_NIGHTS[0]
    startDate.value = DEFAULT_START_DATE
    tourLevel.value = null
    routeOpen.value = {}
    ranges.value = {}
    levels.value = {}
    collapsed.value = {}
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Не смогли очистить — состояние всё равно сброшено на экране
    }
  }

  // Любое изменение ввода сразу уходит в хранилище, чтобы расчёт
  // переживал перезапуск приложения.
  watch(
    [people, nights, startDate, tourLevel, routeOpen, ranges, levels, collapsed],
    () => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            v: SCHEMA_VERSION,
            people: people.value,
            nights: nights.value,
            startDate: startDate.value,
            tourLevel: tourLevel.value,
            routeOpen: routeOpen.value,
            ranges: ranges.value,
            levels: levels.value,
            collapsed: collapsed.value,
          }),
        )
      } catch {
        // Хранилище недоступно — работаем без сохранения
      }
    },
    { deep: true },
  )

  return {
    people,
    servicesOpen,
    toggleServices,
    // Пакетный тур
    nights,
    startDate,
    tourLevel,
    routeOpen,
    isRouteOpen,
    toggleRoute,
    setNights,
    setStartDate,
    setTourLevel,
    tour,
    tourRange,
    packageResult,
    // Свободный конструктор — отложен, см. src/legacy
    ranges,
    levels,
    collapsed,
    isCollapsed,
    toggleCollapsed,
    orderedCities,
    datedCities,
    transferKind,
    previousCity,
    stops,
    result,
    summary,
    busyNights,
    changePeople,
    setRange,
    clearRange,
    setLevel,
    reset,
  }
})

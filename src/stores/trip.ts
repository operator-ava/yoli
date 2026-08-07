import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  CITIES,
  cityName,
  DEFAULT_CITY_ORDER,
  MAX_PEOPLE,
  MIN_PEOPLE,
  type CityId,
  type Level,
  type TransferKind,
} from '@/data'
import { calculate, type TripStop } from '@/composables/calc'
import { nightsBetween, nightsOf } from '@/composables/dates'

const STORAGE_KEY = 'yoli.trip'

/** Версия схемы сохранённых данных. Меняем при любой правке формата —
 *  старые данные тогда просто не подхватятся, а не сломают приложение. */
const SCHEMA_VERSION = 1

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
function load(): {
  people: number
  ranges: Partial<Record<CityId, DateRange>>
  levels: Partial<Record<CityId, Level>>
} {
  const empty = { people: MIN_PEOPLE, ranges: {}, levels: {} }
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

    return { people, ranges, levels }
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

  const ranges = ref<Partial<Record<CityId, DateRange>>>(saved.ranges)
  const levels = ref<Partial<Record<CityId, Level>>>(saved.levels)

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
    return { from, to, days: nightsBetween(from, to) + 1, cities: dated.length }
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
  }

  function setLevel(id: CityId, level: Level) {
    levels.value = { ...levels.value, [id]: level }
  }

  function reset() {
    people.value = MIN_PEOPLE
    ranges.value = {}
    levels.value = {}
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Не смогли очистить — состояние всё равно сброшено на экране
    }
  }

  // Любое изменение ввода сразу уходит в хранилище, чтобы расчёт
  // переживал перезапуск приложения.
  watch(
    [people, ranges, levels],
    () => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            v: SCHEMA_VERSION,
            people: people.value,
            ranges: ranges.value,
            levels: levels.value,
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
    ranges,
    levels,
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

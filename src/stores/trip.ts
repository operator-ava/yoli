import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
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

/** Диапазон дат пребывания в городе: заезд включительно, выезд — день отъезда. */
export interface DateRange {
  from: string
  to: string
}

/** Состояние ввода на экране «Расчёт».
 *  Тариф и даты — по каждому городу отдельно, глобального уровня поездки нет. */
export const useTripStore = defineStore('trip', () => {
  // Меньше двух человек не бывает: ниже MIN_PEOPLE не опускаемся,
  // а сохранённое где-либо меньшее значение подтягиваем до минимума.
  const people = ref(Math.max(MIN_PEOPLE, 2))

  const ranges = ref<Partial<Record<CityId, DateRange>>>({})
  const levels = ref<Partial<Record<CityId, Level>>>({})

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
  }

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

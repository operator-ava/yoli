import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  DEFAULT_CITY_ORDER,
  MAX_NIGHTS,
  MAX_PEOPLE,
  MIN_NIGHTS,
  MIN_PEOPLE,
  type CityId,
  type Level,
} from '@/data'
import { calculate, type TripStop } from '@/composables/calc'

/** Состояние ввода на экране «Расчёт». */
export const useTripStore = defineStore('trip', () => {
  const level = ref<Level>('medium')
  const people = ref(2)
  const singleRooms = ref(false)
  const startDate = ref(todayISO())

  // Порядок в массиве — порядок посещения. Изначально выбран первый город.
  const order = ref<CityId[]>([...DEFAULT_CITY_ORDER])
  const nights = ref<Record<CityId, number>>({
    tashkent: 3,
    samarkand: 2,
    bukhara: 2,
    khiva: 2,
  })
  const selected = ref<Set<CityId>>(new Set<CityId>(['tashkent']))

  /** Города маршрута в порядке посещения. */
  const stops = computed<TripStop[]>(() =>
    order.value
      .filter((id) => selected.value.has(id))
      .map((id) => ({ cityId: id, nights: nights.value[id] })),
  )

  const result = computed(() =>
    calculate({
      level: level.value,
      people: people.value,
      singleRooms: singleRooms.value,
      stops: stops.value,
    }),
  )

  function setLevel(next: Level) {
    level.value = next
  }

  function changePeople(delta: number) {
    people.value = clamp(people.value + delta, MIN_PEOPLE, MAX_PEOPLE)
  }

  function toggleCity(id: CityId) {
    const next = new Set(selected.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    selected.value = next
  }

  function changeNights(id: CityId, delta: number) {
    nights.value = {
      ...nights.value,
      [id]: clamp(nights.value[id] + delta, MIN_NIGHTS, MAX_NIGHTS),
    }
  }

  /** Сдвиг города в порядке посещения. Двигаем по всему списку,
   *  чтобы порядок сохранялся и для пока не выбранных городов. */
  function move(id: CityId, delta: number) {
    const list = [...order.value]
    const from = list.indexOf(id)
    const to = from + delta
    if (from < 0 || to < 0 || to >= list.length) return
    ;[list[from], list[to]] = [list[to], list[from]]
    order.value = list
  }

  function reset() {
    level.value = 'medium'
    people.value = 2
    singleRooms.value = false
    startDate.value = todayISO()
    order.value = [...DEFAULT_CITY_ORDER]
    nights.value = { tashkent: 3, samarkand: 2, bukhara: 2, khiva: 2 }
    selected.value = new Set<CityId>(['tashkent'])
  }

  return {
    level,
    people,
    singleRooms,
    startDate,
    order,
    nights,
    selected,
    stops,
    result,
    setLevel,
    changePeople,
    toggleCity,
    changeNights,
    move,
    reset,
  }
})

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function todayISO() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

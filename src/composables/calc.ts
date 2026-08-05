// Формула расчёта. Детерминированная: одни и те же входные данные всегда дают
// один и тот же результат. Округлений внутри нет — только на выводе.
// Все числа берутся из /src/data/pricing.ts, здесь их не появляется.
import {
  BASE_RATES,
  CITY_FACTOR,
  GROUP_DISCOUNT_STEPS,
  SERVICE_FEE_RATE,
  SINGLE_ROOM_MULTIPLIER,
  TRANSFERS,
  transferKey,
  type CityId,
  type Level,
} from '@/data/pricing'

/** Город в маршруте: идентификатор и число ночей. */
export interface TripStop {
  cityId: CityId
  nights: number
}

export interface CalcInput {
  level: Level
  people: number
  /** Размещение по одному — надбавка к проживанию. */
  singleRooms: boolean
  /** Города в порядке посещения. */
  stops: TripStop[]
}

/** Разбивка по городу. */
export interface CityBreakdown {
  cityId: CityId
  nights: number
  /** Проживание + питание + гид по этому городу, без переездов и сбора. */
  amount: number
}

export interface CalcResult {
  stay: number
  food: number
  guide: number
  transfers: number
  subtotal: number
  discountRate: number
  discount: number
  serviceFee: number
  total: number
  perPerson: number
  nights: number
  /** Дней в поездке: ночей + 1, ноль при пустом маршруте. */
  days: number
  byCity: CityBreakdown[]
}

/** Ставка скидки для размера группы. Ступени — из pricing.ts. */
export function discountRate(people: number): number {
  let rate = 0
  for (const step of GROUP_DISCOUNT_STEPS) {
    if (people >= step.from) rate = step.rate
  }
  return rate
}

/** Следующая ступень скидки: сколько человек добрать и что это даст.
 *  null — если группа уже на максимальной ступени. */
export function nextDiscountStep(people: number): { add: number; rate: number } | null {
  const next = GROUP_DISCOUNT_STEPS.find((s) => s.from > people)
  if (!next) return null
  return { add: next.from - people, rate: next.rate }
}

export function calculate(input: CalcInput): CalcResult {
  const { level, people, singleRooms, stops } = input
  const rates = BASE_RATES[level]

  let stay = 0
  let food = 0
  let guide = 0
  const byCity: CityBreakdown[] = []

  for (const stop of stops) {
    const factor = CITY_FACTOR[stop.cityId]
    const nights = stop.nights

    // Проживание с надбавкой за одноместное размещение.
    const stayCity = rates.stay * factor * nights * people * (singleRooms ? SINGLE_ROOM_MULTIPLIER : 1)
    const foodCity = rates.food * factor * nights * people
    const guideCity = rates.guide * factor * nights * people

    stay += stayCity
    food += foodCity
    guide += guideCity
    byCity.push({ cityId: stop.cityId, nights, amount: stayCity + foodCity + guideCity })
  }

  // Переезды: по соседним парам маршрута, на человека за участок.
  let transfers = 0
  for (let i = 0; i < stops.length - 1; i++) {
    const from = stops[i].cityId
    const to = stops[i + 1].cityId
    const price = TRANSFERS[transferKey(from, to)]?.[level]
    if (price === undefined) {
      // Пары нет в таблице — считаем нулём и говорим об этом вслух.
      console.warn(`[calc] нет цены переезда для пары ${from} → ${to}, взят 0`)
      continue
    }
    transfers += price * people
  }

  const subtotal = stay + food + guide + transfers
  const rate = discountRate(people)
  const discount = subtotal * rate
  const serviceFee = (subtotal - discount) * SERVICE_FEE_RATE
  const total = subtotal - discount + serviceFee

  const nights = stops.reduce((sum, s) => sum + s.nights, 0)

  return {
    stay,
    food,
    guide,
    transfers,
    subtotal,
    discountRate: rate,
    discount,
    serviceFee,
    total,
    perPerson: people > 0 ? total / people : 0,
    nights,
    days: nights > 0 ? nights + 1 : 0,
    byCity,
  }
}

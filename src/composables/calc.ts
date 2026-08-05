// Формула расчёта. Детерминированная: одни и те же входные данные всегда дают
// один и тот же результат. Округлений внутри нет — только на выводе.
// Все числа берутся из /src/data/pricing.ts, здесь их не появляется.
//
// Тариф выбирается В КАЖДОМ ГОРОДЕ ОТДЕЛЬНО — глобального уровня поездки нет.
import {
  BASE_RATES,
  CITY_FACTOR,
  GROUP_DISCOUNT_STEPS,
  SERVICE_FEE_RATE,
  TRANSFERS,
  transferKey,
  type CityId,
  type Level,
} from '@/data/pricing'

/** Город в маршруте: даты уже разобраны в число ночей, тариф выбран. */
export interface TripStop {
  cityId: CityId
  nights: number
  level: Level
}

export interface CalcInput {
  people: number
  /** Города в хронологическом порядке (по дате заезда). */
  stops: TripStop[]
}

export interface CityBreakdown {
  cityId: CityId
  nights: number
  level: Level
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

/** Статьи по одному городу на ОДНОГО человека, без сервисного сбора. */
export function cityPerPerson(
  cityId: CityId,
  level: Level,
  nights: number,
): { stay: number; food: number; guide: number; sum: number } {
  const rates = BASE_RATES[level]
  const factor = CITY_FACTOR[cityId]
  const stay = rates.stay * factor * nights
  const food = rates.food * factor * nights
  const guide = rates.guide * factor * nights
  return { stay, food, guide, sum: stay + food + guide }
}

/** Цена тарифа для карточки: на одного человека, С УЖЕ ВКЛЮЧЁННЫМ сервисным сбором.
 *  Групповая скидка сюда не входит — она считается от всей поездки и видна в панели итога. */
export function tariffCardPrice(cityId: CityId, level: Level, nights: number): number {
  return cityPerPerson(cityId, level, nights).sum * (1 + SERVICE_FEE_RATE)
}

/** Цена переезда на человека. Тариф берётся у города НАЗНАЧЕНИЯ:
 *  переезд считается частью прибытия в город. */
export function transferPrice(from: CityId, to: CityId, level: Level): number | undefined {
  return TRANSFERS[transferKey(from, to)]?.[level]
}

export function calculate(input: CalcInput): CalcResult {
  const { people, stops } = input

  let stay = 0
  let food = 0
  let guide = 0
  const byCity: CityBreakdown[] = []

  for (const stop of stops) {
    const per = cityPerPerson(stop.cityId, stop.level, stop.nights)
    stay += per.stay * people
    food += per.food * people
    guide += per.guide * people
    byCity.push({
      cityId: stop.cityId,
      nights: stop.nights,
      level: stop.level,
      amount: per.sum * people,
    })
  }

  // Переезды: по соседним парам хронологической цепочки, на человека за участок.
  let transfers = 0
  for (let i = 0; i < stops.length - 1; i++) {
    const from = stops[i].cityId
    const to = stops[i + 1].cityId
    const price = transferPrice(from, to, stops[i + 1].level)
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
    nights: stops.reduce((sum, s) => sum + s.nights, 0),
    byCity,
  }
}

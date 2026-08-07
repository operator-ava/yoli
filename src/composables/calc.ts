// Формула расчёта. Детерминированная: одни и те же входные данные всегда дают
// один и тот же результат. Все числа берутся из /src/data/pricing.ts.
//
// Считаем ОТ СЕБЕСТОИМОСТИ: цена = себестоимость / (1 − маржа),
// округление вверх до шага. Все внутренние расчёты — в долларах,
// конвертация в валюту языка происходит только при выводе на экран.
//
// Тариф выбирается В КАЖДОМ ГОРОДЕ ОТДЕЛЬНО — глобального уровня поездки нет.
import {
  COST_ITEMS,
  DAILY_COST,
  GROUP_DISCOUNT_STEPS,
  MARGIN_RATE,
  PRICE_ROUND_STEP,
  TRANSFER_COST,
  type CityId,
  type CostItem,
  type Level,
  type TransferKind,
} from '@/data/pricing'

/** Город в маршруте: даты уже разобраны в число дней, тариф выбран. */
export interface TripStop {
  cityId: CityId
  /** Дней пребывания — оно же число ночей. */
  nights: number
  level: Level
  /** Первый город маршрута — из аэропорта, остальные — переездом. */
  transfer: TransferKind
}

export interface CalcInput {
  people: number
  /** Города в хронологическом порядке (по дате заезда). */
  stops: TripStop[]
}

/** Статьи, которые видит человек: себестоимостные плюс трансфер. */
export type Article = CostItem | 'transfer'
export const ARTICLES: Article[] = [...COST_ITEMS, 'transfer']

export interface CityBreakdown {
  cityId: CityId
  nights: number
  level: Level
  /** Цена города за всю группу, уже с маржой и округлением. */
  amount: number
}

export interface CalcResult {
  /** Суммы по статьям за всю группу. */
  articles: Record<Article, number>
  subtotal: number
  discountRate: number
  discount: number
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

/** Себестоимость города на одного человека, по статьям, в долларах. */
export function cityCost(
  level: Level,
  days: number,
  transfer: TransferKind,
): { byArticle: Record<Article, number>; total: number } {
  const daily = DAILY_COST[level]
  const byArticle = {} as Record<Article, number>
  let total = 0
  for (const item of COST_ITEMS) {
    const value = daily[item] * days
    byArticle[item] = value
    total += value
  }
  const transferCost = TRANSFER_COST[transfer][level]
  byArticle.transfer = transferCost
  total += transferCost
  return { byArticle, total }
}

/** Наценка и округление вверх до шага. */
function withMargin(cost: number): number {
  const price = cost / (1 - MARGIN_RATE)
  return Math.ceil(price / PRICE_ROUND_STEP) * PRICE_ROUND_STEP
}

/** Цена города на ОДНОГО человека: с маржой, округлённая вверх до шага.
 *  Это то самое число, что стоит на карточке тарифа. */
export function cityPrice(level: Level, days: number, transfer: TransferKind): number {
  return withMargin(cityCost(level, days, transfer).total)
}

export function calculate(input: CalcInput): CalcResult {
  const { people, stops } = input

  const articles = {} as Record<Article, number>
  for (const a of ARTICLES) articles[a] = 0

  const byCity: CityBreakdown[] = []
  let subtotal = 0

  for (const stop of stops) {
    const cost = cityCost(stop.level, stop.nights, stop.transfer)
    const price = withMargin(cost.total)
    const amount = price * people

    // Статьи раскладываем пропорционально долям себестоимости,
    // чтобы их сумма в точности совпадала с округлённой ценой города.
    for (const a of ARTICLES) {
      articles[a] += cost.total > 0 ? (amount * cost.byArticle[a]) / cost.total : 0
    }

    subtotal += amount
    byCity.push({ cityId: stop.cityId, nights: stop.nights, level: stop.level, amount })
  }

  const rate = discountRate(people)
  const discount = subtotal * rate
  const total = subtotal - discount

  return {
    articles,
    subtotal,
    discountRate: rate,
    discount,
    total,
    perPerson: people > 0 ? total / people : 0,
    nights: stops.reduce((sum, s) => sum + s.nights, 0),
    byCity,
  }
}

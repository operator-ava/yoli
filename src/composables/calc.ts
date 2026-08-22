// Формула расчёта. Детерминированная: одни и те же входные данные всегда дают
// один и тот же результат. Все числа берутся из /src/data/pricing.ts.
//
// Считаем ОТ СЕБЕСТОИМОСТИ: цена = себестоимость × (1 + наценка),
// округление вверх до шага. Все внутренние расчёты — в долларах,
// конвертация в валюту языка происходит только при выводе на экран.
//
// Тариф выбирается В КАЖДОМ ГОРОДЕ ОТДЕЛЬНО — глобального уровня поездки нет.
import {
  COST_ITEMS,
  DAILY_COST,
  FLIGHT_COST,
  GROUP_DISCOUNT_STEPS,
  DEFAULT_CITY_ORDER,
  MARKUP_RATE,
  PACKAGE_TRANSFERS,
  PACKAGES,
  PRICE_ROUND_STEP,
  TRANSFER_COST,
  type CityId,
  type CostItem,
  type Level,
  type PackageNights,
  type TourPackage,
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

/** Статьи, которые видит человек: себестоимостные плюс трансфер и перелёт.
 *  Перелёт Ургенч–Ташкент — статья пакетного тура; в свободном конструкторе
 *  она всегда нулевая. */
export type Article = CostItem | 'transfer' | 'flight'
export const ARTICLES: Article[] = [...COST_ITEMS, 'transfer', 'flight']

export interface CityBreakdown {
  cityId: CityId
  nights: number
  level: Level
  /** Цена города за всю группу, уже с наценкой и округлением. */
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
  // Перелёта в свободном конструкторе нет: он привязан к пакетному маршруту,
  // который всегда заканчивается вылетом из Хивы.
  byArticle.flight = 0
  return { byArticle, total }
}

/** Наценка на базу и округление вверх до шага. */
function withMarkup(cost: number): number {
  const price = cost * (1 + MARKUP_RATE)
  return Math.ceil(price / PRICE_ROUND_STEP) * PRICE_ROUND_STEP
}

/** Цена города на ОДНОГО человека: с наценкой, округлённая вверх до шага.
 *  Это то самое число, что стоит на карточке тарифа. */
export function cityPrice(level: Level, days: number, transfer: TransferKind): number {
  return withMarkup(cityCost(level, days, transfer).total)
}

export function calculate(input: CalcInput): CalcResult {
  const { people, stops } = input

  const articles = {} as Record<Article, number>
  for (const a of ARTICLES) articles[a] = 0

  const byCity: CityBreakdown[] = []
  let subtotal = 0

  for (const stop of stops) {
    const cost = cityCost(stop.level, stop.nights, stop.transfer)
    const price = withMarkup(cost.total)
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

// ── Пакетный тур ────────────────────────────────────────────────────────────
//
// Приложение — витрина трёх пакетов: 7, 10 и 15 ночей по четырём городам
// в жёстком порядке Ташкент → Самарканд → Бухара → Хива. Тариф выбирается
// ОДИН РАЗ на весь тур, даты считаются подряд от одной даты начала.
//
// Формула та же, что у свободного конструктора, но округление ОДНО на весь
// тур и стоит ПОСЛЕДНИМ:
//
//   себестоимость = Σ(статьи за ночь) × ночей + трансферы
//   цена на человека = ceil( себестоимость × 1.2 × (1 − скидка) / 10 ) × 10
//
// Порядок «наценка → скидка → округление» воспроизводит контрольную таблицу
// заказчика во всех 27 клетках. Обратный порядок расходится с ней в 9 клетках
// на $10 — проверяется скриптом `node scripts/check-packages.mjs`.

export interface PackageStop {
  cityId: CityId
  nights: number
}

export interface PackageInput {
  people: number
  level: Level
  nights: PackageNights
}

export interface PackageResult {
  /** Суммы по статьям за всю группу, уже со скидкой. */
  articles: Record<Article, number>
  /** Цена на одного человека за весь тур: со скидкой и округлением. */
  perPerson: number
  /** Сумма за группу: цена на человека × количество людей. */
  total: number
  /** Сколько группа сэкономила против цены без скидки. */
  discount: number
  discountRate: number
  nights: number
  stops: PackageStop[]
}

/** Пакет по числу ночей. Пакета с таким числом нет — undefined. */
export function packageOf(nights: PackageNights): TourPackage | undefined {
  return PACKAGES.find((p) => p.nights === nights)
}

/** Города пакета с числом ночей, в жёстком порядке маршрута. */
export function packageStops(nights: PackageNights): PackageStop[] {
  const pkg = packageOf(nights)
  if (!pkg) return []
  return DEFAULT_CITY_ORDER.map((cityId) => ({ cityId, nights: pkg.stay[cityId] })).filter(
    (s) => s.nights > 0,
  )
}

/** Себестоимость всего тура на ОДНОГО человека, по статьям, в долларах.
 *  Состав трансферов фиксированный и от числа ночей не зависит. */
export function packageCost(
  level: Level,
  nights: number,
): { byArticle: Record<Article, number>; total: number } {
  const daily = DAILY_COST[level]
  const byArticle = {} as Record<Article, number>
  let total = 0

  for (const item of COST_ITEMS) {
    const value = daily[item] * nights
    byArticle[item] = value
    total += value
  }

  const transfer =
    TRANSFER_COST.airport[level] * PACKAGE_TRANSFERS.airport +
    TRANSFER_COST.intercity[level] * PACKAGE_TRANSFERS.intercity
  byArticle.transfer = transfer
  total += transfer

  const flight = FLIGHT_COST * PACKAGE_TRANSFERS.flight
  byArticle.flight = flight
  total += flight

  return { byArticle, total }
}

/** Цена пакета на ОДНОГО человека: наценка → скидка → округление вверх.
 *  Это то самое число, что стоит на карточке пакета. */
export function packagePrice(level: Level, nights: number, people: number): number {
  const cost = packageCost(level, nights).total
  const withDiscount = cost * (1 + MARKUP_RATE) * (1 - discountRate(people))
  return Math.ceil(withDiscount / PRICE_ROUND_STEP) * PRICE_ROUND_STEP
}

export function calculatePackage(input: PackageInput): PackageResult {
  const { people, level, nights } = input

  const cost = packageCost(level, nights)
  const perPerson = packagePrice(level, nights, people)
  const total = perPerson * people

  // Цена без скидки — тем же порядком, но со ставкой 0. Разница и есть выгода
  // группы; считаем её от округлённых чисел, чтобы строка «вы экономите»
  // сходилась с тем, что человек видит на карточке.
  const fullPerPerson = packagePrice(level, nights, 1)
  const rate = discountRate(people)
  const discount = fullPerPerson * people - total

  // Статьи раскладываем пропорционально долям себестоимости — их сумма
  // в точности равна сумме за группу до скидки.
  const articles = {} as Record<Article, number>
  for (const a of ARTICLES) {
    articles[a] = cost.total > 0 ? ((total + discount) * cost.byArticle[a]) / cost.total : 0
  }

  return {
    articles,
    perPerson,
    total,
    discount,
    discountRate: rate,
    nights,
    stops: packageStops(nights as PackageNights),
  }
}

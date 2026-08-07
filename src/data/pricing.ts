// ⚠️ ПРЕДВАРИТЕЛЬНЫЕ ЦЕНЫ. Себестоимость получена от заказчика.
// НЕ УТВЕРЖДЁННЫЙ ПРАЙС. Заменить по получении окончательной таблицы.
//
// Здесь и только здесь живут все числа расчёта. В компонентах чисел нет.
// Цена считается ОТ СЕБЕСТОИМОСТИ, а не задаётся готовым числом.

/** Уровень поездки. */
export type Level = 'econom' | 'medium' | 'lux'

/** Идентификатор города. */
export type CityId = 'tashkent' | 'samarkand' | 'bukhara' | 'khiva'

/** Цены не утверждены заказчиком. В интерфейсе флаг ничего не рисует —
 *  он оставлен как отметка в данных, пока не придёт настоящий прайс. */
export const PRICES_ARE_DRAFT = true

/** Порядок городов по умолчанию. Фактический порядок вычисляется из дат заезда. */
export const DEFAULT_CITY_ORDER: CityId[] = ['tashkent', 'samarkand', 'bukhara', 'khiva']

/** Статьи себестоимости. Порядок здесь задаёт порядок строк в разбивке. */
export const COST_ITEMS = [
  'stay',
  'food',
  'transport',
  'tickets',
  'guide',
  'dedBobo',
  'insurance',
] as const
export type CostItem = (typeof COST_ITEMS)[number]

/** Себестоимость на ЧЕЛОВЕКА в ДЕНЬ при двухместном размещении, в долларах.
 *  Итого в день: эконом 123, средний 176, люкс 294.
 *  Страховка одинакова на всех уровнях: клиенту она подаётся подарком,
 *  но себестоимость реальная и входит в расчёт. */
export const DAILY_COST: Record<Level, Record<CostItem, number>> = {
  econom: { stay: 24, food: 17, transport: 30, tickets: 20, guide: 25, dedBobo: 5, insurance: 2 },
  medium: { stay: 42, food: 32, transport: 40, tickets: 20, guide: 35, dedBobo: 5, insurance: 2 },
  lux: { stay: 92, food: 60, transport: 65, tickets: 20, guide: 50, dedBobo: 5, insurance: 2 },
}

/** Вид трансфера: в первый город маршрута едем из аэропорта,
 *  во второй и далее — переездом из предыдущего города. */
export type TransferKind = 'airport' | 'intercity'

/** Себестоимость трансфера, разово на ЧЕЛОВЕКА, в долларах. */
export const TRANSFER_COST: Record<TransferKind, Record<Level, number>> = {
  airport: { econom: 12, medium: 18, lux: 30 },
  intercity: { econom: 50, medium: 65, lux: 90 },
}

/** МАРЖА. Единственный рычаг наценки — заказчик крутит именно эту константу.
 *  цена = себестоимость / (1 − MARGIN_RATE) */
export const MARGIN_RATE = 0.4

/** Цена города округляется вверх до этого шага, в долларах. */
export const PRICE_ROUND_STEP = 10

// ── Валюты ──────────────────────────────────────────────────────────────────

export type CurrencyCode = 'USD' | 'RUB' | 'CNY'

/** Курсы к доллару. ОБНОВЛЯЮТСЯ ВРУЧНУЮ.
 *  Дата последнего обновления: 07.08.2026.
 *  Из интернета курс НЕ запрашивается: внешний запрос ломает офлайн
 *  и меняет цену под клиентом. */
export const RATES_UPDATED = '07.08.2026'
export const RATES: Record<CurrencyCode, number> = {
  USD: 1,
  RUB: 82.17,
  CNY: 6.75,
}

/** Шаг округления при выводе на экран, в единицах валюты. */
export const CURRENCY_STEP: Record<CurrencyCode, number> = {
  USD: 10,
  RUB: 100,
  CNY: 10,
}

export const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  USD: '$',
  RUB: '₽',
  CNY: '¥',
}

// ── Скидка и границы ввода ──────────────────────────────────────────────────

/** Скидка за размер группы: ступени по числу человек.
 *  from — нижняя граница ступени включительно.
 *  Двое — базовая цена без скидки, скидка действует от трёх человек.
 *  Потолок 22%. */
export const GROUP_DISCOUNT_STEPS: { from: number; rate: number }[] = [
  { from: 2, rate: 0 },
  { from: 3, rate: 0.05 },
  { from: 5, rate: 0.08 },
  { from: 7, rate: 0.12 },
  { from: 10, rate: 0.15 },
  { from: 15, rate: 0.18 },
  { from: 18, rate: 0.22 },
]

/** Границы ввода. Минимум два человека: цены рассчитаны при двухместном
 *  размещении, одиночное размещение не предусмотрено. */
export const MIN_PEOPLE = 2
export const MAX_PEOPLE = 20
export const MIN_NIGHTS = 1
export const MAX_NIGHTS = 10

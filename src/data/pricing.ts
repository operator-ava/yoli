// ⚠️ ПРЕДВАРИТЕЛЬНЫЕ ЦЕНЫ. Выведены из опорных пакетов заказчика (1900/2500/5200 за 3 дня
// на человека). НЕ УТВЕРЖДЁННЫЙ ПРАЙС. Заменить по получении таблицы от заказчика.
//
// Здесь и только здесь живут все числа расчёта. В компонентах чисел нет.

/** Уровень поездки. */
export type Level = 'econom' | 'medium' | 'lux'

/** Идентификатор города. */
export type CityId = 'tashkent' | 'samarkand' | 'bukhara' | 'khiva'

/** Цены не утверждены заказчиком. В интерфейсе флаг ничего не рисует —
 *  он оставлен как отметка в данных, пока не придёт настоящий прайс. */
export const PRICES_ARE_DRAFT = true

/** Валюта расчёта. */
export const CURRENCY = 'USD'
export const CURRENCY_SYMBOL = '$'

/** Порядок городов по умолчанию. Фактический порядок вычисляется из дат заезда. */
export const DEFAULT_CITY_ORDER: CityId[] = ['tashkent', 'samarkand', 'bukhara', 'khiva']

/** Базовые ставки на ЧЕЛОВЕКА в ДЕНЬ для Ташкента, до сервисного сбора. */
export const BASE_RATES: Record<Level, { stay: number; food: number; guide: number }> = {
  econom: { stay: 320, food: 150, guide: 115 }, // 585
  medium: { stay: 430, food: 195, guide: 145 }, // 770
  lux: { stay: 900, food: 400, guide: 305 }, // 1605
}

/** Коэффициенты городов — множатся на базовые ставки. */
export const CITY_FACTOR: Record<CityId, number> = {
  tashkent: 1.0,
  samarkand: 1.05,
  bukhara: 1.0,
  khiva: 0.95,
}

/** Переезды между городами, на ЧЕЛОВЕКА за участок. Матрица симметричная:
 *  ключ собирается из двух id, отсортированных по алфавиту. */
export const TRANSFERS: Record<string, Record<Level, number>> = {
  'samarkand|tashkent': { econom: 25, medium: 45, lux: 120 },
  'bukhara|samarkand': { econom: 20, medium: 40, lux: 110 },
  'bukhara|khiva': { econom: 45, medium: 70, lux: 190 },
  'khiva|tashkent': { econom: 90, medium: 140, lux: 260 },
  'khiva|samarkand': { econom: 70, medium: 110, lux: 230 },
  'bukhara|tashkent': { econom: 35, medium: 60, lux: 150 },
}

/** Ключ пары городов, порядок не важен. */
export function transferKey(a: CityId, b: CityId): string {
  return [a, b].sort().join('|')
}

/** Сервисный сбор — доля от подытога за вычетом скидки. */
export const SERVICE_FEE_RATE = 0.08

/** Скидка за размер группы: ступени по числу человек.
 *  from — нижняя граница ступени включительно. */
export const GROUP_DISCOUNT_STEPS: { from: number; rate: number }[] = [
  { from: 1, rate: 0 },
  { from: 2, rate: 0.05 },
  { from: 3, rate: 0.08 },
  { from: 5, rate: 0.12 },
  { from: 7, rate: 0.15 },
  { from: 10, rate: 0.18 },
  { from: 15, rate: 0.22 },
]

/** Границы ввода. */
export const MIN_PEOPLE = 1
export const MAX_PEOPLE = 20
export const MIN_NIGHTS = 1
export const MAX_NIGHTS = 10

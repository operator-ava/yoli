// Форматирование для вывода. Конвертация валюты и округление живут только здесь —
// в расчёте их нет, там всё в долларах с полной точностью.
import { CURRENCY_STEP, CURRENCY_SYMBOL, RATES, type CurrencyCode } from '@/data/pricing'
import { locale } from './useI18n'

/** Язык определяет валюту. */
const CURRENCY_BY_LOCALE: Record<string, CurrencyCode> = {
  ru: 'RUB',
  en: 'USD',
  zh: 'CNY',
}

/** Правила вывода числа по языку: разделитель разрядов и место символа. */
const NUMBER_LOCALE: Record<string, string> = {
  ru: 'ru-RU',
  en: 'en-US',
  zh: 'zh-CN',
}

export function currentCurrency(): CurrencyCode {
  return CURRENCY_BY_LOCALE[locale.value] ?? 'USD'
}

/** Целые единицы валюты без округления шагом: копеек и центов не показываем. */
export function exactUnits(usd: number): number {
  return Math.round(usd * RATES[currentCurrency()])
}

/** Единицы валюты, округлённые вверх до шага: рубли до 100, юани и доллары до 10.
 *  Так выводятся итог и цены на карточках тарифов. */
export function steppedUnits(usd: number): number {
  const step = CURRENCY_STEP[currentCurrency()]
  return Math.ceil((usd * RATES[currentCurrency()]) / step) * step
}

/** Готовые единицы валюты в строку с символом. */
export function formatUnits(units: number): string {
  const number = units.toLocaleString(NUMBER_LOCALE[locale.value] ?? 'en-US')
  const symbol = CURRENCY_SYMBOL[currentCurrency()]
  // В русском символ валюты идёт после числа, в английском и китайском — перед.
  return locale.value === 'ru' ? `${number} ${symbol}` : `${symbol}${number}`
}

/** Сумма со шагом округления: итог и карточки тарифов. */
export function money(usd: number): string {
  return formatUnits(steppedUnits(usd))
}

/** Сумма без шага округления: строки разбивки. */
export function moneyExact(usd: number): string {
  return formatUnits(exactUnits(usd))
}

/** Разложить целую сумму по долям так, чтобы части сложились в неё ТОЧНО.
 *  Остаток раздаём по наибольшей дробной части — классический largest remainder. */
export function allocate(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0)
  if (sum <= 0) return weights.map(() => 0)
  const raw = weights.map((w) => (total * w) / sum)
  const parts = raw.map(Math.floor)
  let rest = total - parts.reduce((a, b) => a + b, 0)
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac)
  for (let k = 0; rest > 0; k++, rest--) parts[order[k % order.length].i]++
  return parts
}

/** Процент целым числом: 0.12 -> «12%». */
export function percent(rate: number): string {
  return Math.round(rate * 100) + '%'
}

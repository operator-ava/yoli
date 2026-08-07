// Форматирование для вывода. Округление и конвертация валюты живут только здесь —
// в расчёте их нет, там всё в долларах.
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

/** Сумма в валюте языка. На вход всегда доллары.
 *  Округление вверх до шага валюты: клиенту не показывается цена ниже расчётной. */
export function money(usd: number): string {
  const code = currentCurrency()
  const step = CURRENCY_STEP[code]
  const value = Math.ceil((usd * RATES[code]) / step) * step
  const number = value.toLocaleString(NUMBER_LOCALE[locale.value] ?? 'en-US')
  const symbol = CURRENCY_SYMBOL[code]
  // В русском символ валюты идёт после числа, в английском и китайском — перед.
  return locale.value === 'ru' ? `${number} ${symbol}` : `${symbol}${number}`
}

/** Процент целым числом: 0.12 -> «12%». */
export function percent(rate: number): string {
  return Math.round(rate * 100) + '%'
}

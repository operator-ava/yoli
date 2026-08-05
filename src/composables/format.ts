// Форматирование для вывода. Округление живёт только здесь — в расчёте его нет.
import { CURRENCY_SYMBOL } from '@/data'

/** Сумма без копеек: «$12 480». */
export function money(value: number): string {
  return CURRENCY_SYMBOL + Math.round(value).toLocaleString('ru-RU').replace(/ /g, ' ')
}

/** Процент целым числом: 0.12 -> «12%». */
export function percent(rate: number): string {
  return Math.round(rate * 100) + '%'
}

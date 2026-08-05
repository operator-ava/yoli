// Форматирование для вывода. Округление живёт только здесь — в расчёте его нет.
import { CURRENCY_SYMBOL } from '@/data'

/** Сумма без копеек: «$12 480». */
export function money(value: number): string {
  return CURRENCY_SYMBOL + Math.round(value).toLocaleString('ru-RU').replace(/ /g, ' ')
}

const MONTHS_GEN = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

/** Склонение: 1 человек / 2 человека / 5 человек. */
export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

/** Строка периода: «12 дней, 5–16 мая».
 *  Если месяцы разные — «5 мая – 16 июня». */
export function tripPeriod(startISO: string, nights: number): string {
  if (nights <= 0) return ''
  const start = new Date(startISO + 'T00:00:00')
  if (Number.isNaN(start.getTime())) return ''
  const end = new Date(start)
  end.setDate(end.getDate() + nights)

  const days = nights + 1
  const daysLabel = `${days} ${plural(days, 'день', 'дня', 'дней')}`

  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
  const range = sameMonth
    ? `${start.getDate()}–${end.getDate()} ${MONTHS_GEN[end.getMonth()]}`
    : `${start.getDate()} ${MONTHS_GEN[start.getMonth()]} – ${end.getDate()} ${MONTHS_GEN[end.getMonth()]}`

  return `${daysLabel}, ${range}`
}

/** Процент целым числом: 0.12 → «12%». */
export function percent(rate: number): string {
  return Math.round(rate * 100) + '%'
}

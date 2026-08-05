// Работа с датами. Даты хранятся строкой ISO «ГГГГ-ММ-ДД» — без времени и часовых поясов,
// чтобы расчёт оставался детерминированным.
// Названия месяцев и дней недели берутся из словаря — они переводятся вместе с языком.
import { list } from './useI18n'

export function todayISO(): string {
  return toISO(new Date())
}

export function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(iso: string, n: number): string {
  const d = parseISO(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

/** Ночей между заездом и выездом: 12.08 → 15.08 это 3 ночи. */
export function nightsBetween(from: string, to: string): number {
  const ms = parseISO(to).getTime() - parseISO(from).getTime()
  return Math.max(0, Math.round(ms / 86400000))
}

/** Ночи диапазона: [from, to). День выезда свободен — в него можно заехать в другой город. */
export function nightsOf(from: string, to: string): string[] {
  const out: string[] = []
  for (let d = from; d < to; d = addDays(d, 1)) out.push(d)
  return out
}

/** «12.08» — числовой формат, одинаковый в обоих языках. */
export function short(iso: string): string {
  const d = parseISO(iso)
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** «12 августа» / «12 August» */
export function dayMonth(iso: string): string {
  const d = parseISO(iso)
  return `${d.getDate()} ${list('dates.monthsGen')[d.getMonth()] ?? ''}`
}

/** «12–18 августа» / «12–18 August», а при разных месяцах — обе даты полностью. */
export function rangeLabel(from: string, to: string): string {
  const a = parseISO(from)
  const b = parseISO(to)
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    return `${a.getDate()}–${b.getDate()} ${list('dates.monthsGen')[b.getMonth()] ?? ''}`
  }
  return `${dayMonth(from)} – ${dayMonth(to)}`
}

export function monthTitle(year: number, month: number): string {
  return `${list('dates.monthsNom')[month] ?? ''} ${year}`
}

/** Сетка месяца: недели с понедельника, пустые ячейки — null. */
export function monthGrid(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1)
  const shift = (first.getDay() + 6) % 7 // понедельник — первый день недели
  const days = new Date(year, month + 1, 0).getDate()
  const cells: (string | null)[] = Array(shift).fill(null)
  for (let d = 1; d <= days; d++) cells.push(toISO(new Date(year, month, d)))
  while (cells.length % 7) cells.push(null)
  return cells
}

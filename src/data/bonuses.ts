// Блок «В подарок» по тарифам. Названия и объёмы заданы заказчиком.
import type { Level } from './pricing'

export interface Bonus {
  /** Ключ названия слева. */
  nameKey: string
  /** Ключ объёма справа. */
  amountKey: string
  /** Идентификатор пояснения. Есть — строка открывает нижний лист. */
  sheet?: 'insurance'
}

const NAMES = ['bonus.dedBobo', 'bonus.translator', 'bonus.audio', 'bonus.routes']

/** Страховка включена на всех уровнях без ограничений. */
const INSURANCE: Bonus = {
  nameKey: 'bonus.insurance',
  amountKey: 'bonus.included',
  sheet: 'insurance',
}

function set(amounts: string[]): Bonus[] {
  return [...NAMES.map((nameKey, i) => ({ nameKey, amountKey: amounts[i] })), INSURANCE]
}

export const BONUSES: Record<Level, Bonus[]> = {
  econom: set(['bonus.hours3', 'bonus.hours3', 'bonus.unlimited', 'bonus.unlimited']),
  medium: set(['bonus.hours7', 'bonus.hours7', 'bonus.unlimited', 'bonus.unlimited']),
  lux: set(['bonus.unlimited', 'bonus.unlimited', 'bonus.unlimited', 'bonus.unlimited']),
}

// Блок «В подарок» по тарифам. Названия и объёмы заданы заказчиком.
import type { Level } from './pricing'

export interface Bonus {
  /** Название слева. */
  name: string
  /** Объём справа. */
  amount: string
}

const MEDIUM: Bonus[] = [
  { name: 'Дед Бобо', amount: '7 часов' },
  { name: 'Переводчик', amount: '7 часов' },
  { name: 'Аудиогид', amount: 'без лимита' },
  { name: 'Маршруты', amount: 'без лимита' },
]

export const BONUSES: Record<Level, Bonus[]> = {
  econom: [
    { name: 'Дед Бобо', amount: '3 часа' },
    { name: 'Переводчик', amount: '3 часа' },
    { name: 'Аудиогид', amount: 'без лимита' },
    { name: 'Маршруты', amount: 'без лимита' },
  ],
  medium: MEDIUM,
  lux: [
    { name: 'Дед Бобо', amount: 'без лимита' },
    { name: 'Переводчик', amount: 'без лимита' },
    { name: 'Аудиогид', amount: 'без лимита' },
    { name: 'Маршруты', amount: 'без лимита' },
  ],
}

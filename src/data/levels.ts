// Названия уровней поездки. Числа — в pricing.ts.
import type { Level } from './pricing'

export interface LevelInfo {
  id: Level
  name: string
}

export const LEVELS: LevelInfo[] = [
  { id: 'econom', name: 'Эконом' },
  { id: 'medium', name: 'Средний' },
  { id: 'lux', name: 'Люкс' },
]

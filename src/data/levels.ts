// Уровни поездки. Числа — в pricing.ts.
import { t } from '@/composables/useI18n'
import type { Level } from './pricing'

export interface LevelInfo {
  id: Level
  /** Ключ названия в словаре. */
  nameKey: string
}

export const LEVELS: LevelInfo[] = [
  { id: 'econom', nameKey: 'level.econom' },
  { id: 'medium', nameKey: 'level.medium' },
  { id: 'lux', nameKey: 'level.lux' },
]

export function levelName(id: Level): string {
  const info = LEVELS.find((l) => l.id === id)
  return info ? t(info.nameKey) : id
}

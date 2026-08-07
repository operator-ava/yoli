// Состав тарифа — читаемый чек-лист «Что включено».
// Десять строк, порядок задан заказчиком. Названия гостиниц, марки транспорта
// и конкретные исполнители НЕ называются: обещаем категорию и условия.
import { t } from '@/composables/useI18n'
import { hotelCategory } from './hotels'
import type { CityId, Level, TransferKind } from './pricing'

/** Строки чек-листа. */
export type InclusionKey =
  | 'transfer'
  | 'hotel'
  | 'food'
  | 'guide'
  | 'aiGuide'
  | 'audio'
  | 'translator'
  | 'routes'
  | 'taxi'
  | 'insurance'

/** Строки, которые видны всегда. Порядок строгий. */
export const PRIMARY_ITEMS: InclusionKey[] = ['transfer', 'hotel', 'food', 'taxi']

/** Строки, свёрнутые в одну «Сопровождение YOLI». Порядок строгий. */
export const SECONDARY_ITEMS: InclusionKey[] = [
  'guide',
  'aiGuide',
  'audio',
  'translator',
  'routes',
  'insurance',
]

/** Полный список — для мест, где нужны все строки разом. */
export const INCLUSION_ITEMS: InclusionKey[] = [...PRIMARY_ITEMS, ...SECONDARY_ITEMS]

/** Контекст города: от позиции в маршруте зависит вид трансфера. */
export interface InclusionContext {
  transfer: TransferKind
  /** Название предыдущего города — для переезда между городами. */
  previousCity?: string
}

/** Ограничение по тарифу — мелким текстом справа. Пусто — подписи нет. */
const LIMITS: Partial<Record<InclusionKey, Record<Level, string>>> = {
  aiGuide: { econom: 'limit.h3', medium: 'limit.h7', lux: 'limit.unlimited' },
  translator: { econom: 'limit.h3', medium: 'limit.h7', lux: 'limit.unlimited' },
  audio: { econom: 'limit.unlimited', medium: 'limit.unlimited', lux: 'limit.unlimited' },
  routes: { econom: 'limit.unlimited', medium: 'limit.unlimited', lux: 'limit.unlimited' },
}

export function itemNote(key: InclusionKey, level: Level): string {
  const k = LIMITS[key]?.[level]
  return k ? t(k) : ''
}

/** Название строки. У трансфера зависит от позиции города, у гостиницы — от категории. */
export function itemLabel(key: InclusionKey, level: Level, ctx: InclusionContext): string {
  switch (key) {
    case 'transfer':
      return ctx.transfer === 'airport'
        ? t('transfer.airport.row')
        : t('transfer.intercity.row', { city: ctx.previousCity ?? '' })
    case 'hotel':
      return t('row.hotel', { stars: hotelCategory(level).starsLabel })
    default:
      return t(`row.${key}`)
  }
}

/** Какой лист открывает строка. */
export type SheetKind = 'transfer' | 'hotel' | 'food' | 'guide' | 'taxi' | 'insurance' | 'service'

export function sheetFor(key: InclusionKey): SheetKind {
  if (key === 'aiGuide' || key === 'audio' || key === 'translator' || key === 'routes')
    return 'service'
  return key
}

/** Абзацы пояснения для простых листов (AI-гид, аудиогид, переводчик, маршруты). */
export function serviceParagraphs(key: InclusionKey): string[] {
  return [t(`service.${key}.d1`), t(`service.${key}.d2`)]
}

/** Есть ли у услуги разница по тарифам — тогда в листе показываем уровень. */
export function hasLimits(key: InclusionKey): boolean {
  const l = LIMITS[key]
  if (!l) return false
  return new Set(Object.values(l)).size > 1
}

// ── Логистика: строка «Такси и перевозки» ───────────────────────────────────
// Источник: YOLi_DedBobo_KB/5_yoli_logistics.md.
const LOGISTICS_KEYS = Array.from({ length: 14 }, (_, i) => `logistics.d${i + 1}`)

export function logisticsDetails(): string[] {
  return LOGISTICS_KEYS.map((k) => t(k))
}

/** Пункты чек-листа: показываем все, галочка стоит у каждого. */
export function filledItems(_cityId: CityId, _level: Level, _ctx: InclusionContext) {
  return INCLUSION_ITEMS
}

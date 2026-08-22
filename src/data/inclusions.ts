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
  | 'excursions'
  | 'taxi'
  | 'guide'
  | 'aiGuide'
  | 'audio'
  | 'translator'
  | 'insurance'
  | 'sim'
  | 'bankCard'

/** Строки, которые видны всегда. Порядок строгий. */
export const PRIMARY_ITEMS: InclusionKey[] = [
  'transfer',
  'hotel',
  'food',
  'excursions',
  'guide',
  'taxi',
]

/** Дополнительные услуги, свёрнутые в блок-кнопку. Порядок строгий. */
const SECONDARY_ALL: InclusionKey[] = ['aiGuide', 'audio', 'translator', 'insurance', 'sim', 'bankCard']

/** Услуги, которые есть не на всех тарифах. Местная банковская карта — только люкс. */
const LUX_ONLY: InclusionKey[] = ['bankCard']

/** Состав дополнительных услуг тарифа: эконом и средний — пять, люкс — шесть.
 *  Заголовок блока считает длину этого списка, а не хранит число отдельно. */
export function secondaryItems(level: Level): InclusionKey[] {
  return SECONDARY_ALL.filter((key) => level === 'lux' || !LUX_ONLY.includes(key))
}

/** Полный список — для мест, где нужны все строки разом. */
export const INCLUSION_ITEMS: InclusionKey[] = [...PRIMARY_ITEMS, ...SECONDARY_ALL]

/** Контекст города: от позиции в маршруте зависит вид трансфера. */
export interface InclusionContext {
  transfer: TransferKind
  /** Название предыдущего города — для переезда между городами. */
  previousCity?: string
}

/** Ограничение по тарифу — мелким текстом справа. Пусто — подписи нет. */
const LIMITS: Partial<Record<InclusionKey, Partial<Record<Level, string>>>> = {
  aiGuide: { econom: 'limit.h3', medium: 'limit.h7', lux: 'limit.unlimited' },
  translator: { econom: 'limit.h3', medium: 'limit.h7', lux: 'limit.unlimited' },
  audio: { econom: 'limit.unlimited', medium: 'limit.unlimited', lux: 'limit.unlimited' },
  sim: { econom: 'limit.gb180', medium: 'limit.gb200', lux: 'limit.gb350' },
  // Подпись только у люкса: там маршрут можно менять. У эконома и среднего
  // подписи нет вовсе — «фиксированный план» звучал как ограничение,
  // а разница по тарифам объяснена словами внутри листа.
  excursions: { lux: 'limit.freeRoute' },
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

/** Ключи, у которых свой лист. Остальное показывает общий лист услуги. */
const OWN_SHEET: InclusionKey[] = ['transfer', 'hotel', 'food', 'guide', 'taxi', 'insurance']

export function sheetFor(key: InclusionKey): SheetKind {
  return OWN_SHEET.includes(key) ? (key as SheetKind) : 'service'
}

/** Сколько общих абзацев у листа. По умолчанию два. У SIM-карты их нет —
 *  только перечень условий, у банковской карты четыре, у экскурсий один:
 *  второй зависит от тарифа. */
const PARAGRAPH_COUNT: Partial<Record<InclusionKey, number>> = {
  sim: 0,
  bankCard: 4,
  excursions: 1,
}

/** Услуги, у которых последний абзац свой на каждом тарифе. Ключ строки —
 *  `service.<key>.<level>`, как уровни в остальных листах. */
const LEVEL_PARAGRAPH: InclusionKey[] = ['excursions']

export function hasLevelParagraph(key: InclusionKey): boolean {
  return LEVEL_PARAGRAPH.includes(key)
}

/** Услуги, у которых последним абзацем идёт отсылка к другому месту экрана.
 *  У экскурсий это раздел «Экскурсионные маршруты» ниже по странице:
 *  лист рассказывает про услугу, а разбивку по дням человек видит там. */
const SEE_BELOW: InclusionKey[] = ['excursions']

/** Абзацы пояснения для общего листа услуги: сперва общие, затем — если у
 *  услуги есть разница по тарифам — абзац этого тарифа, затем отсылка.
 *  Пустые отсеиваются. */
export function serviceParagraphs(key: InclusionKey, level: Level): string[] {
  const n = PARAGRAPH_COUNT[key] ?? 2
  const paragraphs = Array.from({ length: n }, (_, i) => t(`service.${key}.d${i + 1}`))
  if (hasLevelParagraph(key)) paragraphs.push(t(`service.${key}.${level}`))
  // Отсылка стоит последней, перед сноской: сперва про услугу, потом куда идти.
  if (SEE_BELOW.includes(key)) paragraphs.push(t(`service.${key}.seeBelow`))
  return paragraphs.filter(Boolean)
}

/** Перечень условий услуги по тарифу. Пусто — лист обходится абзацами.
 *  Стоимость услуги здесь не указывается: обещаем состав, а не цену. */
const BULLETS: Partial<Record<InclusionKey, Record<Level, number>>> = {
  sim: { econom: 4, medium: 5, lux: 5 },
}

export function serviceBullets(key: InclusionKey, level: Level): string[] {
  const n = BULLETS[key]?.[level] ?? 0
  return Array.from({ length: n }, (_, i) => t(`${key}.${level}.${i + 1}`))
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

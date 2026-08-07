// Состав тарифов: город → тариф → пункт.
// Названия гостиниц, блюда и марки транспорта НЕ ВЫДУМЫВАЮТСЯ.
// Пустой пункт (summary === '') в интерфейсе не показывается вовсе.
import { t } from '@/composables/useI18n'
import { hotelCategory } from './hotels'
import { MEAL_FORMAT, MEAL_LABEL_KEY } from './meals'
import type { CityId, Level, TransferKind } from './pricing'

/** Пункт состава тарифа. */
export type InclusionKey = 'hotel' | 'food' | 'transfer' | 'logistics' | 'guide'

export interface Inclusion {
  /** Короткая сводка одной строкой — справа в строке состава. */
  summary: string
  /** Подробности для нижнего листа. Пустой массив — подробностей нет. */
  details: string[]
}

/** Контекст города: от позиции в маршруте зависит вид трансфера. */
export interface InclusionContext {
  transfer: TransferKind
  /** Название предыдущего города — для переезда между городами. */
  previousCity?: string
}

/** Порядок и ключи названий пунктов. Порядок задан заказчиком. */
export const INCLUSION_ITEMS: { key: InclusionKey; labelKey: string }[] = [
  { key: 'hotel', labelKey: 'inc.hotel' },
  { key: 'food', labelKey: 'inc.food' },
  { key: 'transfer', labelKey: 'inc.transfer' },
  { key: 'logistics', labelKey: 'inc.logistics' },
  { key: 'guide', labelKey: 'inc.guide' },
]

const EMPTY: Inclusion = { summary: '', details: [] }

/** Название строки трансфера зависит от позиции города в маршруте. */
export function transferLabel(ctx: InclusionContext): string {
  return ctx.transfer === 'airport'
    ? t('transfer.airport.row')
    : t('transfer.intercity.row', { city: ctx.previousCity ?? '' })
}

function transfer(level: Level, ctx: InclusionContext): Inclusion {
  const kind = ctx.transfer
  return {
    summary: t(`transfer.${kind}.${level}`),
    details: [t(`transfer.${kind}.d1`), t(`transfer.${kind}.d2`), t(`transfer.${kind}.${level}`)],
  }
}

// Логистика и маршруты: многодневная аренда плюс общий состав поездки.
// Источник: YOLi_DedBobo_KB/5_yoli_logistics.md.
const LOGISTICS_KEYS = Array.from({ length: 14 }, (_, i) => `logistics.d${i + 1}`)

function logistics(): Inclusion {
  return { summary: t('logistics.summary'), details: LOGISTICS_KEYS.map((k) => t(k)) }
}

/** Сводка по гостинице: категория, а не конкретный объект. */
export function hotelSummary(level: Level): string {
  return t(hotelCategory(level).labelKey)
}

/** Сводка по питанию: перечисление приёмов пищи. */
export function mealSummary(level: Level): string {
  return MEAL_FORMAT[level].meals.map((m) => t(MEAL_LABEL_KEY[m])).join(' · ')
}

/** Состав пункта для города и тарифа. */
export function inclusion(
  _cityId: CityId,
  level: Level,
  key: InclusionKey,
  ctx: InclusionContext,
): Inclusion {
  switch (key) {
    case 'hotel':
      return { summary: hotelSummary(level), details: [] }
    case 'food':
      return { summary: mealSummary(level), details: [] }
    case 'transfer':
      return transfer(level, ctx)
    case 'logistics':
      return logistics()
    case 'guide':
      // ТРЕБУЕТ ДАННЫХ: что входит в тариф — не задано ни по одному городу.
      return EMPTY
  }
}

/** Название строки состава: у трансфера оно зависит от позиции города. */
export function itemLabel(key: InclusionKey, ctx: InclusionContext): string {
  if (key === 'transfer') return transferLabel(ctx)
  const labelKey = INCLUSION_ITEMS.find((i) => i.key === key)?.labelKey
  return labelKey ? t(labelKey) : ''
}

/** Пункты, у которых есть что показать. Пустые не выводятся. */
export function filledItems(cityId: CityId, level: Level, ctx: InclusionContext) {
  return INCLUSION_ITEMS.filter((item) => inclusion(cityId, level, item.key, ctx).summary !== '')
}

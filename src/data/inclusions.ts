// Состав тарифов: город → тариф → пункт.
// Источник по трансферу и логистике: YOLi_DedBobo_KB/5_yoli_logistics.md.
// Названия гостиниц, блюда и марки транспорта НЕ ВЫДУМЫВАЮТСЯ.
// Пустой пункт (summary === '') в интерфейсе не показывается вовсе.
import { t } from '@/composables/useI18n'
import { hotelCategory } from './hotels'
import { MEAL_FORMAT, MEAL_LABEL_KEY } from './meals'
import type { CityId, Level } from './pricing'

/** Пункт состава тарифа. */
export type InclusionKey = 'hotel' | 'food' | 'transfer' | 'logistics' | 'guide'

export interface Inclusion {
  /** Короткая сводка одной строкой — справа в строке состава. */
  summary: string
  /** Подробности для нижнего листа. Пустой массив — подробностей нет. */
  details: string[]
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

// ── Трансфер ────────────────────────────────────────────────────────────────
// ⚠️ ТРЕБУЕТ УТВЕРЖДЕНИЯ: сопоставление классов авто из материалов
// (эконом / комфорт / бизнес / минивэн) с тарифами эконом / средний / люкс
// в документах заказчика отсутствует, оно задано вручную.
const CAR_KEY: Record<Level, string> = {
  econom: 'transfer.car.econom',
  medium: 'transfer.car.medium',
  lux: 'transfer.car.lux',
}

// Остальной состав трансфера одинаков для всех уровней — так в материалах.
const TRANSFER_COMMON = [
  'transfer.d1',
  'transfer.d2',
  'transfer.d3',
  'transfer.d4',
  'transfer.d5',
  'transfer.d6',
  'transfer.d7',
  'transfer.d8',
]

function transfer(level: Level): Inclusion {
  const car = t(CAR_KEY[level])
  return {
    summary: car,
    details: [t('transfer.carLine', { car }), ...TRANSFER_COMMON.map((k) => t(k))],
  }
}

// ── Логистика и маршруты ────────────────────────────────────────────────────
// Из раздела «МНОГОДНЕВНАЯ АРЕНДА». Различий по тарифам в материалах нет.
function logistics(): Inclusion {
  return {
    summary: t('logistics.summary'),
    details: ['logistics.d1', 'logistics.d2', 'logistics.d3', 'logistics.d4', 'logistics.d5', 'logistics.d6'].map(
      (k) => t(k),
    ),
  }
}

/** Сводка по гостинице: категория, а не конкретный объект. */
export function hotelSummary(level: Level): string {
  return t(hotelCategory(level).labelKey)
}

/** Сводка по питанию: перечисление приёмов пищи. */
export function mealSummary(level: Level): string {
  const labels = MEAL_FORMAT[level].meals.map((m) => t(MEAL_LABEL_KEY[m]))
  return labels.join(' · ')
}

/** Состав пункта для города и тарифа. */
export function inclusion(_cityId: CityId, level: Level, key: InclusionKey): Inclusion {
  switch (key) {
    case 'hotel':
      return { summary: hotelSummary(level), details: [] }
    case 'food':
      return { summary: mealSummary(level), details: [] }
    case 'transfer':
      return transfer(level)
    case 'logistics':
      return logistics()
    case 'guide':
      // ТРЕБУЕТ ДАННЫХ: что входит в тариф — не задано ни по одному городу.
      return EMPTY
  }
}

/** Пункты, у которых есть что показать. Пустые не выводятся. */
export function filledItems(cityId: CityId, level: Level) {
  return INCLUSION_ITEMS.filter((item) => inclusion(cityId, level, item.key).summary !== '')
}

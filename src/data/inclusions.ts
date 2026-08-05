// Состав тарифов: город → тариф → пункт.
// Источник по трансферу и логистике: YOLi_DedBobo_KB/5_yoli_logistics.md.
// Названия гостиниц, блюда и марки транспорта НЕ ВЫДУМЫВАЮТСЯ.
// Пустой пункт (summary === '') в интерфейсе не показывается вовсе.
import { hotelSummary } from './hotels'
import { mealSummary } from './meals'
import type { CityId, Level } from './pricing'

/** Пункт состава тарифа. */
export type InclusionKey = 'hotel' | 'food' | 'transfer' | 'logistics' | 'guide'

export interface Inclusion {
  /** Короткая сводка одной строкой — справа в строке состава. */
  summary: string
  /** Подробности для нижнего листа. Пустой массив — подробностей нет. */
  details: string[]
}

/** Порядок и названия пунктов состава. Порядок задан заказчиком. */
export const INCLUSION_ITEMS: { key: InclusionKey; label: string }[] = [
  { key: 'hotel', label: 'Гостиница' },
  { key: 'food', label: 'Питание' },
  { key: 'transfer', label: 'Трансфер' },
  { key: 'logistics', label: 'Логистика и маршруты' },
  { key: 'guide', label: 'Живой гид' },
]

const EMPTY: Inclusion = { summary: '', details: [] }

// ── Трансфер ────────────────────────────────────────────────────────────────
// ⚠️ ТРЕБУЕТ УТВЕРЖДЕНИЯ: сопоставление классов авто из материалов
// (эконом / комфорт / бизнес / минивэн) с тарифами эконом / средний / люкс
// в документах заказчика отсутствует, оно задано вручную.
const CAR_CLASS: Record<Level, string> = {
  econom: 'Nexia или Lacetti',
  medium: 'Malibu или аналог',
  lux: 'Минивэн H-1 или представительский класс',
}

// Остальной состав трансфера одинаков для всех уровней — так в материалах.
const TRANSFER_COMMON = [
  'Водитель со знанием русского языка и дорог, рейтинг 4.5+',
  'Бензин на весь маршрут',
  'Бутилированная вода в машине',
  'Кондиционер',
  'Wi-Fi, если доступен в машине',
  'Помощь с переводом: в ресторане, на заправке',
  'До трёх остановок по 30–40 минут: отдых, чайхана',
  'Не входит: входные билеты в музеи, еда и напитки пассажиров',
]

function transfer(level: Level): Inclusion {
  return {
    summary: CAR_CLASS[level],
    details: [`Класс автомобиля: ${CAR_CLASS[level]}`, ...TRANSFER_COMMON],
  }
}

// ── Логистика и маршруты ────────────────────────────────────────────────────
// Из раздела «МНОГОДНЕВНАЯ АРЕНДА». Различий по тарифам в материалах нет.
const LOGISTICS: Inclusion = {
  summary: 'Водитель-гид на весь маршрут, гибкий план',
  details: [
    'Водитель-гид сопровождает весь маршрут',
    'Гибкий маршрут: план можно менять каждый день',
    'Остановки без ограничений',
    'Рекомендации водителя: места и заведения по пути',
    'Изменение маршрута в процессе пересчитывается без штрафов',
    'Не входит: ночёвка водителя при многодневной аренде',
  ],
}

// ── Живой гид ───────────────────────────────────────────────────────────────
// ТРЕБУЕТ ДАННЫХ: что входит в тариф — не задано ни по одному городу.
// Пока пусто, строка в карточке не показывается вовсе.
const GUIDE: Inclusion = EMPTY

/** Состав пункта для города и тарифа. */
export function inclusion(cityId: CityId, level: Level, key: InclusionKey): Inclusion {
  switch (key) {
    case 'hotel':
      return { summary: hotelSummary(cityId, level), details: [] }
    case 'food':
      return { summary: mealSummary(level), details: [] }
    case 'transfer':
      return transfer(level)
    case 'logistics':
      return LOGISTICS
    case 'guide':
      return GUIDE
  }
}

/** Пункты, у которых есть что показать. Пустые не выводятся. */
export function filledItems(cityId: CityId, level: Level) {
  return INCLUSION_ITEMS.filter((item) => inclusion(cityId, level, item.key).summary !== '')
}

// Размещение описывается КАТЕГОРИЕЙ, а не конкретным отелем.
//
// Причина: заказчик работает по модели «сначала оплата, потом бронирование».
// Наличие мест на момент расчёта неизвестно, поэтому называть отель нельзя —
// это обещание, которое можно не сдержать. Названий, адресов, районов
// и расстояний до конкретных объектов здесь нет и быть не должно.
//
// Каждая категория описана ПОЛНОСТЬЮ и читается сама по себе:
// отсылок «всё из предыдущей категории» нет.
import type { Level } from './pricing'

export interface HotelCategory {
  /** Ключ названия категории: «Отель 2–3★». */
  labelKey: string
  /** Ключ уровня: «Эконом», «Средний класс», «Люкс». */
  nameKey: string
  /** Звёздность для заглушки фото: «2–3★». */
  starsLabel: string
  /** Ключи строк с привилегиями категории. */
  benefitKeys: string[]
}

function benefits(level: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `hotel.benefit.${level}.${i + 1}`)
}

export const HOTEL_CATEGORIES: Record<Level, HotelCategory> = {
  econom: {
    labelKey: 'hotel.cat.econom',
    nameKey: 'hotel.catName.econom',
    starsLabel: '2–3★',
    benefitKeys: benefits('econom', 8),
  },
  medium: {
    labelKey: 'hotel.cat.medium',
    nameKey: 'hotel.catName.medium',
    starsLabel: '3–4★',
    benefitKeys: benefits('medium', 10),
  },
  lux: {
    labelKey: 'hotel.cat.lux',
    nameKey: 'hotel.catName.lux',
    starsLabel: '4–5★',
    benefitKeys: benefits('lux', 10),
  },
}

export function hotelCategory(level: Level): HotelCategory {
  return HOTEL_CATEGORIES[level]
}

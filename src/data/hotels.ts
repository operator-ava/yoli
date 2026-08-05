// ⚠️ МАКЕТНОЕ НАПОЛНЕНИЕ. Названия — узнаваемые ташкентские гостиницы, НЕ ПРОВЕРЕНЫ
// и НЕ ЗАКОНТРАКТОВАНЫ. Требует подтверждения заказчиком перед показом клиенту.
//
// Самарканд, Бухара и Хива пока без отелей — там показывается категория без имени.
// Выбор отеля НЕ ВЛИЯЕТ на цену.
import type { CityId, Level } from './pricing'

/** Возможные удобства. */
export type AmenityKey =
  | 'wifi'
  | 'breakfast'
  | 'ac'
  | 'hairdryer'
  | 'safe'
  | 'shower'
  | 'bath'
  | 'cleaning'
  | 'reception'
  | 'robe'
  | 'roomService'

/** Ключ удобства → ключ строки в словаре. */
export const AMENITY_KEYS: AmenityKey[] = [
  'wifi',
  'breakfast',
  'ac',
  'hairdryer',
  'safe',
  'shower',
  'bath',
  'cleaning',
  'reception',
  'robe',
  'roomService',
]

/** ⚠️ ТРЕБУЕТ ПОДТВЕРЖДЕНИЯ: набор удобств по уровням — реконструкция.
 *  Задаётся на уровень, а не на отель. */
export const AMENITIES_BY_LEVEL: Record<Level, AmenityKey[]> = {
  econom: ['wifi', 'breakfast', 'ac', 'shower', 'cleaning'],
  medium: ['wifi', 'breakfast', 'ac', 'hairdryer', 'safe', 'bath', 'cleaning', 'reception'],
  lux: [
    'wifi',
    'breakfast',
    'ac',
    'hairdryer',
    'safe',
    'bath',
    'cleaning',
    'reception',
    'robe',
    'roomService',
  ],
}

export interface Hotel {
  id: string
  /** Имя собственное — не переводится. */
  name: string
  stars: number
  /** Ключ строки района в словаре. */
  areaKey: string
  /** Ключ строки описания обслуживания в словаре. */
  serviceKey: string
}

/** ⚠️ ТРЕБУЕТ УТВЕРЖДЕНИЯ: категории размещения по уровням — реконструкция. */
export const LEVEL_STARS: Record<Level, number> = { econom: 3, medium: 4, lux: 5 }

const TASHKENT: Record<Level, Hotel[]> = {
  econom: [
    {
      id: 'tas-uzbekistan',
      name: 'Hotel Uzbekistan',
      stars: 3,
      areaKey: 'hotel.area.tasAmirTemur',
      serviceKey: 'hotel.service.tasUzbekistan',
    },
    {
      id: 'tas-shodlik',
      name: 'Shodlik Palace Hotel',
      stars: 3,
      areaKey: 'hotel.area.tasCenter',
      serviceKey: 'hotel.service.tasShodlik',
    },
    {
      id: 'tas-orzu',
      name: 'Grand Orzu Hotel',
      stars: 3,
      areaKey: 'hotel.area.tasMirabad',
      serviceKey: 'hotel.service.tasOrzu',
    },
  ],
  medium: [
    {
      id: 'tas-lotte',
      name: 'Lotte City Hotel Tashkent Palace',
      stars: 4,
      areaKey: 'hotel.area.tasCenter',
      serviceKey: 'hotel.service.tasLotte',
    },
    {
      id: 'tas-ramada',
      name: 'Ramada by Wyndham Tashkent',
      stars: 4,
      areaKey: 'hotel.area.tasMirabad',
      serviceKey: 'hotel.service.tasRamada',
    },
    {
      id: 'tas-grandmir',
      name: 'Grand Mir Hotel',
      stars: 4,
      areaKey: 'hotel.area.tasCenter',
      serviceKey: 'hotel.service.tasGrandMir',
    },
    {
      id: 'tas-international',
      name: 'International Hotel Tashkent',
      stars: 4,
      areaKey: 'hotel.area.tasYunusabad',
      serviceKey: 'hotel.service.tasInternational',
    },
    {
      id: 'tas-citypalace',
      name: 'City Palace Hotel',
      stars: 4,
      areaKey: 'hotel.area.tasCenter',
      serviceKey: 'hotel.service.tasCityPalace',
    },
  ],
  lux: [
    {
      id: 'tas-hyatt',
      name: 'Hyatt Regency Tashkent',
      stars: 5,
      areaKey: 'hotel.area.tasCity',
      serviceKey: 'hotel.service.tasHyatt',
    },
    {
      id: 'tas-hilton',
      name: 'Hilton Tashkent City',
      stars: 5,
      areaKey: 'hotel.area.tasCity',
      serviceKey: 'hotel.service.tasHilton',
    },
  ],
}

const BY_CITY: Partial<Record<CityId, Record<Level, Hotel[]>>> = {
  tashkent: TASHKENT,
}

/** Отели города на уровне. Пусто — показывается категория без имени. */
export function hotelsFor(cityId: CityId, level: Level): Hotel[] {
  return BY_CITY[cityId]?.[level] ?? []
}

export function hotelById(cityId: CityId, level: Level, id: string | undefined): Hotel | undefined {
  if (!id) return undefined
  return hotelsFor(cityId, level).find((h) => h.id === id)
}

/** Первый отель уровня — на него сбрасывается выбор при смене тарифа. */
export function firstHotelId(cityId: CityId, level: Level): string | undefined {
  return hotelsFor(cityId, level)[0]?.id
}

export function amenitiesFor(level: Level): AmenityKey[] {
  return AMENITIES_BY_LEVEL[level]
}

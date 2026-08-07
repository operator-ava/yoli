// Города проекта: ключи названий и фото. Цен здесь нет — они в pricing.ts.
import { t } from '@/composables/useI18n'
import type { CityId } from './pricing'

export interface City {
  id: CityId
  /** Ключ названия в словаре, именительный падеж. */
  nameKey: string
  /** Ключ названия в родительном падеже: «из Ташкента», «из Хивы».
   *  Падежная форма — свойство города, а не строки, которая его подставляет. */
  nameGenKey: string
  /** Фото 1600px webp, лежит в public/photos/cities */
  photo: string
}

export const CITIES: City[] = [
  {
    id: 'tashkent',
    nameKey: 'city.tashkent',
    nameGenKey: 'city.tashkent.gen',
    photo: '/photos/cities/tashkent.webp',
  },
  {
    id: 'samarkand',
    nameKey: 'city.samarkand',
    nameGenKey: 'city.samarkand.gen',
    photo: '/photos/cities/samarkand.webp',
  },
  {
    id: 'bukhara',
    nameKey: 'city.bukhara',
    nameGenKey: 'city.bukhara.gen',
    photo: '/photos/cities/bukhara.webp',
  },
  {
    id: 'khiva',
    nameKey: 'city.khiva',
    nameGenKey: 'city.khiva.gen',
    photo: '/photos/cities/khiva.webp',
  },
]

const BY_ID = new Map(CITIES.map((c) => [c.id, c]))

export function cityName(id: CityId): string {
  const key = BY_ID.get(id)?.nameKey
  return key ? t(key) : id
}

/** Название в родительном падеже — для строк вида «Переезд из Ташкента». */
export function cityNameGen(id: CityId): string {
  const key = BY_ID.get(id)?.nameGenKey
  return key ? t(key) : id
}

export function city(id: CityId): City | undefined {
  return BY_ID.get(id)
}

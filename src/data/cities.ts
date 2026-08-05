// Города проекта: названия и фото. Цен здесь нет — они в pricing.ts.
import type { CityId } from './pricing'

export interface City {
  id: CityId
  name: string
  /** Фото 1600px webp, лежит в public/photos/cities */
  photo: string
}

export const CITIES: City[] = [
  { id: 'tashkent', name: 'Ташкент', photo: '/photos/cities/tashkent.webp' },
  { id: 'samarkand', name: 'Самарканд', photo: '/photos/cities/samarkand.webp' },
  { id: 'bukhara', name: 'Бухара', photo: '/photos/cities/bukhara.webp' },
  { id: 'fergana', name: 'Ферганская долина', photo: '/photos/cities/fergana.webp' },
  { id: 'khiva', name: 'Хива', photo: '/photos/cities/khiva.webp' },
]

const BY_ID = new Map(CITIES.map((c) => [c.id, c]))

export function cityName(id: CityId): string {
  return BY_ID.get(id)?.name ?? id
}

export function city(id: CityId): City | undefined {
  return BY_ID.get(id)
}

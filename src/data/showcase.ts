// Контент витрин: «Маршруты», «Проживание», «Питание».
// Карточки некликабельные, переходов внутрь нет.
// Названия точек взяты из фотобанка заказчика как есть — это имена собственные,
// они не переводятся. Адреса, часы работы, звёздность и цены здесь НЕ указываются.
import { CITIES } from './cities'

export interface ShowcaseCard {
  id: string
  /** Имя собственное — показывается как есть. */
  title?: string
  /** Ключ названия в словаре — для карточек по городам. */
  titleKey?: string
  /** Ключ пояснения под заголовком. */
  textKey: string
  photo: string
}

/** Витрина «Маршруты» — точки из фотобанка проекта. */
export const ROUTE_CARDS: ShowcaseCard[] = [
  { id: 'poi-50', title: 'Минарет Кальта-Минор' },
  { id: 'poi-51', title: 'Цитадель Куня-Арк' },
  { id: 'poi-53', title: 'Джума-мечеть' },
  { id: 'poi-57', title: 'Мавзолей Пахлавана Махмуда' },
  { id: 'poi-66', title: 'Базар Чорсу' },
  { id: 'poi-67', title: 'Площадь Амира Темура' },
  { id: 'poi-69', title: 'Комплекс Хазрати-Имам' },
  { id: 'poi-71', title: 'Ташкентская телебашня' },
  { id: 'poi-75', title: 'Театр имени Алишера Навои' },
  { id: 'poi-81', title: 'Японский сад' },
  { id: 'poi-89', title: 'Дворец Худояр-хана' },
  { id: 'poi-91', title: 'Шёлковая фабрика Ёдгорлик' },
].map((p) => ({ ...p, textKey: 'showcase.routes.text', photo: `/photos/poi/${p.id}.webp` }))

/** Витрина «Проживание» — по городам маршрута. */
export const STAY_CARDS: ShowcaseCard[] = CITIES.map((c) => ({
  id: `stay-${c.id}`,
  titleKey: c.nameKey,
  textKey: 'showcase.stay.text',
  photo: c.photo,
}))

/** Витрина «Питание» — по городам маршрута. */
export const FOOD_CARDS: ShowcaseCard[] = CITIES.map((c) => ({
  id: `food-${c.id}`,
  titleKey: c.nameKey,
  textKey: 'showcase.food.text',
  photo: c.photo,
}))

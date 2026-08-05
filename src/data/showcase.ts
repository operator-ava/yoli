// Контент витрин: «Маршруты», «Проживание», «Питание».
// Карточки некликабельные, переходов внутрь нет.
// Названия точек взяты из фотобанка заказчика как есть. Адреса, часы работы,
// звёздность и цены здесь НЕ указываются — этих данных у нас нет.
import { CITIES } from './cities'

export interface ShowcaseCard {
  id: string
  title: string
  /** Пояснение под заголовком. Заглушка до получения текстов от заказчика. */
  text: string
  photo: string
}

/** ⚠️ ЗАГЛУШКА: тексты витрин временные, ждут материалов заказчика. */
const DRAFT_TEXT = {
  route: 'Точка из программы. Описание готовится.',
  stay: 'Размещение уровней эконом, средний и люкс. Список отелей — после согласования.',
  food: 'Питание по программе. Меню и заведения — после согласования.',
} as const

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
].map((p) => ({ ...p, text: DRAFT_TEXT.route, photo: `/photos/poi/${p.id}.webp` }))

/** Витрина «Проживание» — по городам маршрута. */
export const STAY_CARDS: ShowcaseCard[] = CITIES.map((c) => ({
  id: `stay-${c.id}`,
  title: c.name,
  text: DRAFT_TEXT.stay,
  photo: c.photo,
}))

/** Витрина «Питание» — по городам маршрута. */
export const FOOD_CARDS: ShowcaseCard[] = CITIES.map((c) => ({
  id: `food-${c.id}`,
  title: c.name,
  text: DRAFT_TEXT.food,
  photo: c.photo,
}))

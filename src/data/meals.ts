// Питание по дням пребывания в городе.
//
// ⚠️ ТРЕБУЕТ УТВЕРЖДЕНИЯ ЗАКАЗЧИКОМ: различия по уровням (число приёмов пищи
// и формат заведений) — реконструкция, в материалах заказчика их нет.
//
// ⚠️ ТРЕБУЕТ ДАННЫХ: блюда расписаны ТОЛЬКО для узбекского обеда — единственный
// набор, подтверждённый заказчиком. Для остальных кухонь и приёмов пищи блюда
// НЕ ВЫДУМЫВАЮТСЯ. Заказчик обещал список из двенадцати кухонь — структура
// рассчитана на произвольное их число и произвольное число подач.
import type { Level } from './pricing'

export type CuisineId = string

export interface Cuisine {
  id: CuisineId
  /** Ключ названия в словаре. */
  nameKey: string
}

/** Кухни. Список открыт — добавление новых не требует правок логики. */
export const CUISINES: Cuisine[] = [
  { id: 'uzbek', nameKey: 'cuisine.uzbek' },
  { id: 'chinese', nameKey: 'cuisine.chinese' },
  { id: 'russian', nameKey: 'cuisine.russian' },
  { id: 'japanese', nameKey: 'cuisine.japanese' },
]

/** Порядок раскладки кухонь по дням: узбекской больше всего, дальше по убыванию.
 *  Цикл повторяется, пока не кончатся дни. Рандома нет — одна и та же поездка
 *  всегда даёт одну и ту же раскладку. */
export const CUISINE_CYCLE: CuisineId[] = [
  'uzbek',
  'uzbek',
  'chinese',
  'uzbek',
  'russian',
  'uzbek',
  'chinese',
  'japanese',
]

/** Короткое пребывание — только узбекская кухня. */
const SHORT_STAY_DAYS = 2

/** Кухня дня. index — номер дня с нуля, total — всего дней в городе. */
export function cuisineForDay(index: number, total: number): Cuisine {
  const id = total <= SHORT_STAY_DAYS ? 'uzbek' : CUISINE_CYCLE[index % CUISINE_CYCLE.length]
  return CUISINES.find((c) => c.id === id) ?? CUISINES[0]
}

/** Приём пищи. */
export type MealKey = 'breakfast' | 'lunch' | 'dinner'

export const MEAL_LABEL_KEY: Record<MealKey, string> = {
  breakfast: 'meal.breakfast',
  lunch: 'meal.lunch',
  dinner: 'meal.dinner',
}

export interface MealFormat {
  meals: MealKey[]
  /** Ключ строки с форматом заведений на этом уровне. */
  venuesKey: string
}

/** ⚠️ ТРЕБУЕТ УТВЕРЖДЕНИЯ ЗАКАЗЧИКОМ. */
export const MEAL_FORMAT: Record<Level, MealFormat> = {
  econom: { meals: ['breakfast', 'lunch'], venuesKey: 'meal.venues.econom' },
  medium: { meals: ['breakfast', 'lunch', 'dinner'], venuesKey: 'meal.venues.medium' },
  lux: { meals: ['breakfast', 'lunch', 'dinner'], venuesKey: 'meal.venues.lux' },
}

/** Подача: ключ названия подачи и ключи блюд. Число подач произвольное. */
export interface Course {
  labelKey: string
  itemKeys: string[]
}

/** Блюда для кухни и приёма пищи. Заполнен только узбекский обед —
 *  единственный набор, подтверждённый заказчиком. */
const DISHES: Record<string, Course[]> = {
  'uzbek|lunch': [
    { labelKey: 'course.first', itemKeys: ['dish.mastava'] },
    { labelKey: 'course.second', itemKeys: ['dish.plov'] },
    { labelKey: 'course.table', itemKeys: ['dish.samsa', 'dish.shashlik'] },
  ],
}

export function dishesFor(cuisineId: CuisineId, meal: MealKey): Course[] {
  return DISHES[`${cuisineId}|${meal}`] ?? []
}

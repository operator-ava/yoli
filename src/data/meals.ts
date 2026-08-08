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

/** Завтрак всегда узбекский: в отелях Узбекистана подают местный завтрак,
 *  и «русская кухня» на завтрак у прилетевшего туриста вызывает вопрос. */
const BREAKFAST_CUISINE: CuisineId = 'uzbek'

/** Цикл для ОБЕДОВ и УЖИНОВ. Завтраки в него не входят.
 *  Десять позиций: китайская 4, узбекская 3, русская 2, японская 1.
 *  Доля подобрана так, чтобы вместе с узбекскими завтраками общая пропорция
 *  за поездку осталась прежней: узбекская около половины, дальше китайская,
 *  русская, японская реже всех.
 *  Рандома нет: позиция считается от номера дня и номера приёма, поэтому
 *  одни и те же даты и город всегда дают одну и ту же раскладку. */
export const CUISINE_CYCLE: CuisineId[] = [
  'chinese',
  'uzbek',
  'russian',
  'chinese',
  'uzbek',
  'chinese',
  'russian',
  'uzbek',
  'chinese',
  'japanese',
]

/** Кухня конкретного приёма пищи.
 *  meal — какой это приём, dayIndex — номер дня с нуля,
 *  mealIndex — номер приёма внутри дня, mealsPerDay — сколько приёмов даёт тариф. */
export function cuisineForMeal(
  meal: MealKey,
  dayIndex: number,
  mealIndex: number,
  mealsPerDay: number,
): Cuisine {
  if (meal === 'breakfast') {
    return CUISINES.find((c) => c.id === BREAKFAST_CUISINE) ?? CUISINES[0]
  }
  // Завтрак идёт первым и в цикле не участвует — считаем позицию без него.
  const perDay = Math.max(1, mealsPerDay - 1)
  const position = (dayIndex * perDay + (mealIndex - 1)) % CUISINE_CYCLE.length
  const id = CUISINE_CYCLE[position]
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
 *  единственный набор, подтверждённый заказчиком.
 *  В интерфейсе НЕ показывается: обещаем кухню, а не конкретное блюдо.
 *  Данные оставлены, чтобы не потерять подтверждённое заказчиком. */
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

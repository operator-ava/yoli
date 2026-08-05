// Питание по дням пребывания в городе.
//
// ⚠️ ТРЕБУЕТ УТВЕРЖДЕНИЯ ЗАКАЗЧИКОМ: различия по уровням (число приёмов пищи
// и формат заведений) — реконструкция, в материалах заказчика их нет.
//
// ⚠️ ТРЕБУЕТ ДАННЫХ: блюда расписаны ТОЛЬКО для узбекского обеда — единственный
// набор, подтверждённый заказчиком. Для остальных кухонь и приёмов пищи блюда
// НЕ ВЫДУМЫВАЮТСЯ, поле пустое. Заказчик обещал список из двенадцати кухонь —
// структура рассчитана на произвольное их число.
import type { Level } from './pricing'

export type CuisineId = string

export interface Cuisine {
  id: CuisineId
  name: string
}

/** Кухни. Список открыт — добавление новых не требует правок логики. */
export const CUISINES: Cuisine[] = [
  { id: 'uzbek', name: 'Узбекская кухня' },
  { id: 'chinese', name: 'Китайская кухня' },
  { id: 'russian', name: 'Русская кухня' },
  { id: 'japanese', name: 'Японская кухня' },
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

export const MEAL_LABEL: Record<MealKey, string> = {
  breakfast: 'Завтрак',
  lunch: 'Обед',
  dinner: 'Ужин',
}

export interface MealFormat {
  meals: MealKey[]
  /** Формат заведений на этом уровне. */
  venues: string
}

/** ⚠️ ТРЕБУЕТ УТВЕРЖДЕНИЯ ЗАКАЗЧИКОМ. */
export const MEAL_FORMAT: Record<Level, MealFormat> = {
  econom: {
    meals: ['breakfast', 'lunch'],
    venues: 'Кафе и чайханы городского формата',
  },
  medium: {
    meals: ['breakfast', 'lunch', 'dinner'],
    venues: 'Рестораны с национальной и европейской картой',
  },
  lux: {
    meals: ['breakfast', 'lunch', 'dinner'],
    venues: 'Авторские и панорамные рестораны, ужин с программой',
  },
}

/** Подача блюда: название подачи и что в ней. */
export interface Course {
  label: string
  items: string[]
}

/** Блюда для кухни и приёма пищи. Заполнен только узбекский обед —
 *  единственный набор, подтверждённый заказчиком. */
const DISHES: Record<string, Course[]> = {
  'uzbek|lunch': [
    { label: 'Первое', items: ['Мастава'] },
    { label: 'Второе', items: ['Плов'] },
    { label: 'К столу', items: ['Самса', 'Шашлык'] },
  ],
}

export function dishesFor(cuisineId: CuisineId, meal: MealKey): Course[] {
  return DISHES[`${cuisineId}|${meal}`] ?? []
}

/** Сводка одной строкой для карточки тарифа. */
export function mealSummary(level: Level): string {
  const labels = MEAL_FORMAT[level].meals.map((m) => MEAL_LABEL[m].toLowerCase())
  if (labels.length <= 1) return labels[0] ?? ''
  return capitalize(labels.slice(0, -1).join(', ') + ' и ' + labels[labels.length - 1])
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

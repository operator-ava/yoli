// Питание: принцип, а не расписание.
//
// Раньше здесь жила раскладка кухонь по дням — какой день, какой приём,
// какая кухня. Решением заказчика 22.08.2026 расписание убрано из интерфейса
// целиком: на туре в 15 ночей оно превращалось в простыню. Вместе с ним
// удалены `CUISINE_CYCLE`, `cuisineForMeal()` и скрипт `check-meals.mjs` —
// проверять больше нечего.
//
// ⚠️ ВНИМАНИЕ, ДЕНЬГИ. Приёмов пищи теперь ТРИ на всех тарифах. В `pricing.ts`
// статья `food` эконома ($15 за ночь) была посчитана под ДВА приёма —
// завтрак и обед. Цена не менялась: это решение заказчика, а не наше.
// Долг записан в РЕШЕНИЯ.md, раздел «Известные долги».
import type { Level } from './pricing'

/** Приём пищи. */
export type MealKey = 'breakfast' | 'lunch' | 'dinner'

export interface MealBlock {
  key: MealKey
  /** Заголовок блока: «Завтрак — в гостинице». */
  titleKey: string
  /** Описание по тарифам. Каждый текст читается сам по себе: человек,
   *  выбравший средний тариф, не обязан читать эконом (правило раздела 5). */
  textKey: Record<Level, string>
}

/** Три приёма пищи. Порядок здесь задаёт порядок блоков в листе. */
export const MEALS: MealBlock[] = [
  {
    key: 'breakfast',
    titleKey: 'meal.breakfast.title',
    textKey: {
      econom: 'meal.breakfast.econom',
      medium: 'meal.breakfast.medium',
      lux: 'meal.breakfast.lux',
    },
  },
  {
    key: 'lunch',
    titleKey: 'meal.lunch.title',
    textKey: {
      econom: 'meal.lunch.econom',
      medium: 'meal.lunch.medium',
      lux: 'meal.lunch.lux',
    },
  },
  {
    key: 'dinner',
    titleKey: 'meal.dinner.title',
    textKey: {
      econom: 'meal.dinner.econom',
      medium: 'meal.dinner.medium',
      lux: 'meal.dinner.lux',
    },
  },
]

/** Сколько приёмов пищи в день. Одинаково на всех тарифах. */
export const MEALS_PER_DAY = MEALS.length

/** Подача: ключ названия подачи и ключи блюд. */
export interface Course {
  labelKey: string
  itemKeys: string[]
}

/** Блюда узбекского обеда — единственный набор, подтверждённый заказчиком.
 *  В интерфейсе НЕ показывается: обещаем кухню, а не конкретное блюдо.
 *  Данные оставлены, чтобы не потерять подтверждённое. */
export const DISHES: Record<string, Course[]> = {
  'uzbek|lunch': [
    { labelKey: 'course.first', itemKeys: ['dish.mastava'] },
    { labelKey: 'course.second', itemKeys: ['dish.plov'] },
    { labelKey: 'course.table', itemKeys: ['dish.samsa', 'dish.shashlik'] },
  ],
}

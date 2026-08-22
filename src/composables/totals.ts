// Единственное место, где расчёт превращается в числа для экрана.
//
// Панель итога и свёрнутые строки городов берут суммы ОТСЮДА, а не считают
// каждая своё: иначе одна и та же поездка показывала бы в двух местах разные
// числа. Композабл — синглтон, вычисление одно на всё приложение.
//
// Сходимости, которые обязаны держаться точно:
//   сумма за группу      = цена на человека × количество людей
//   статьи − скидка      = сумма за группу
//
// Третьей сходимости — «сумма всех городов = сумма за группу» — в пакетном
// режиме нет предмета: пакет продаётся целиком, отдельных цен по городам
// на экране не стоит. Блок «Маршрут» показывает дни и точки, но не деньги.
import { computed, type ComputedRef } from 'vue'
import { useTripStore } from '@/stores/trip'
import { allocate, steppedUnits } from './format'
import type { Article } from './calc'

/** Четыре укрупнённые статьи вместо семи. Внутренние статьи себестоимости
 *  остаются в pricing.ts — наружу они не выходят, иначе по ним считается маржа. */
const GROUPS: { key: string; items: Article[] }[] = [
  { key: 'stay', items: ['stay'] },
  { key: 'food', items: ['food'] },
  // Отдельной статьи «транспорт по городу» в новой модели нет: остались
  // трансферы и перелёт Ургенч–Ташкент — обоим отдельной строки не даём
  { key: 'transportAll', items: ['transfer', 'flight'] },
  { key: 'services', items: ['guide', 'dedBobo', 'tickets', 'insurance', 'sim', 'audio'] },
]

export interface TotalsView {
  /** Ничего не выбрано — показывать нечего. */
  empty: boolean
  perPersonUnits: number
  totalUnits: number
  discountUnits: number
  discountRate: number
  /** Ключ статьи — подпись подставляет компонент, здесь только числа. */
  articles: { key: string; units: number }[]
}

let cached: ComputedRef<TotalsView> | null = null

export function useTotals(): ComputedRef<TotalsView> {
  if (cached) return cached

  const trip = useTripStore()

  cached = computed<TotalsView>(() => {
    const r = trip.packageResult

    // Тариф не выбран — считать нечего, панель показывает одну строку-подсказку.
    if (!r) {
      return {
        empty: true,
        perPersonUnits: 0,
        totalUnits: 0,
        discountUnits: 0,
        discountRate: 0,
        articles: GROUPS.map((g) => ({ key: g.key, units: 0 })),
      }
    }

    // Цена на человека — это то, что человек читает первым, поэтому округляем
    // её, а сумму за группу выводим как «на человека × люди». Тогда умножение
    // в уме всегда сходится с тем, что написано в панели.
    const perPersonUnits = steppedUnits(r.perPerson)
    const totalUnits = perPersonUnits * trip.people
    // Скидку тоже округляем шагом валюты: точное число выбивалось из ряда круглых.
    const discountUnits = steppedUnits(r.discount)
    // Статьи раскладываются от базы «итог + скидка»: вычитание строки скидки
    // возвращает ровно итог.
    const base = totalUnits + discountUnits

    const articleUnits = allocate(
      base,
      GROUPS.map((g) => g.items.reduce((sum, a) => sum + r.articles[a], 0)),
    )
    return {
      empty: false,
      perPersonUnits,
      totalUnits,
      discountUnits,
      discountRate: r.discountRate,
      articles: GROUPS.map((g, i) => ({ key: g.key, units: articleUnits[i] })),
    }
  })

  return cached
}

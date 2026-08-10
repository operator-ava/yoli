// Единственное место, где расчёт превращается в числа для экрана.
//
// Панель итога и свёрнутые строки городов берут суммы ОТСЮДА, а не считают
// каждая своё: иначе одна и та же поездка показывала бы в двух местах разные
// числа. Композабл — синглтон, вычисление одно на всё приложение.
//
// Три сходимости, которые обязаны держаться точно:
//   сумма за группу      = цена на человека × количество людей
//   статьи − скидка      = сумма за группу
//   сумма всех городов   = сумма за группу
import { computed, type ComputedRef } from 'vue'
import { useTripStore } from '@/stores/trip'
import { allocate, steppedUnits } from './format'
import type { Article } from './calc'
import type { CityId, Level } from '@/data'

/** Четыре укрупнённые статьи вместо семи. Внутренние статьи себестоимости
 *  остаются в pricing.ts — наружу они не выходят, иначе по ним считается маржа. */
const GROUPS: { key: string; items: Article[] }[] = [
  { key: 'stay', items: ['stay'] },
  { key: 'food', items: ['food'] },
  // Отдельной статьи «транспорт по городу» в новой модели нет: остался трансфер
  { key: 'transportAll', items: ['transfer'] },
  { key: 'services', items: ['guide', 'dedBobo', 'tickets', 'insurance', 'sim', 'audio'] },
]

export interface CityUnits {
  cityId: CityId
  nights: number
  level: Level
  /** Сумма города за всю группу, со скидкой, в единицах валюты языка. */
  units: number
}

export interface TotalsView {
  /** Ничего не выбрано — показывать нечего. */
  empty: boolean
  perPersonUnits: number
  totalUnits: number
  discountUnits: number
  discountRate: number
  /** Ключ статьи — подпись подставляет компонент, здесь только числа. */
  articles: { key: string; units: number }[]
  cities: CityUnits[]
  /** Сумма города по id — для свёрнутой строки. */
  cityUnits: (id: CityId) => number | null
}

let cached: ComputedRef<TotalsView> | null = null

export function useTotals(): ComputedRef<TotalsView> {
  if (cached) return cached

  const trip = useTripStore()

  cached = computed<TotalsView>(() => {
    const r = trip.result

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
    // Города раскладываются от САМОГО итога, а не от базы: строка города —
    // это то, что человек платит за город, уже со скидкой.
    const cityUnits = allocate(
      totalUnits,
      r.byCity.map((c) => c.amount),
    )

    const cities: CityUnits[] = r.byCity.map((c, i) => ({
      cityId: c.cityId,
      nights: c.nights,
      level: c.level,
      units: cityUnits[i],
    }))

    return {
      empty: r.byCity.length === 0,
      perPersonUnits,
      totalUnits,
      discountUnits,
      discountRate: r.discountRate,
      articles: GROUPS.map((g, i) => ({ key: g.key, units: articleUnits[i] })),
      cities,
      cityUnits: (id: CityId) => cities.find((c) => c.cityId === id)?.units ?? null,
    }
  })

  return cached
}

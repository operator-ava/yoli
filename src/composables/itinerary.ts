// Раскладка точек маршрута по дням. Считается КОДОМ из данных poi.ts —
// по дням ничего не захардкожено.
//
// Расчёт ДЕТЕРМИНИРОВАННЫЙ: один и тот же пакет и одна и та же дата начала
// всегда дают одну и ту же программу. Случайного выбора нет.
//
// Правила утверждены заказчиком:
//   — точки сортируются по рейтингу, затем по близости друг к другу;
//   — время осмотра берётся из категории точки (VISIT_MINUTES);
//   — переезд между точками считается по координатам: 25 км/ч плюс 8 минут
//     на посадку-высадку, но не меньше 10 минут;
//   — точки набираются по рейтингу, пока день не заполнен нормой;
//   — норма активного дня 8 часов, включая переезды между точками;
//   — первый день тура и день вылета из Хивы — по 4 часа;
//   — что не влезло в дни города, в пакет НЕ ВХОДИТ.
//
// Отбор — решение заказчика от 22.08.2026. Раньше все точки города делились
// по дням поровну, и в коротком пакете выходило по 12 часов в день. Столько
// никто не проходит, и партнёр это видит. Следствие отбора нужное: короткий
// пакет показывает главное, длинный — больше, разница между 7 и 15 ночами
// становится видимой.
//
// Сколько точек вошло и сколько всего есть в городе — в полях `selected`
// и `total`. Экран обязан показывать оба числа: иначе человек решит, что
// часть достопримечательностей просто забыли.
import { poiByCity, VISIT_MINUTES, type Poi } from '@/data/poi'
import { DEFAULT_CITY_ORDER, type CityId, type PackageNights } from '@/data/pricing'
import { packageStops } from './calc'
import { addDays } from './dates'

/** Скорость перемещения по городу, км/ч. */
const SPEED_KMH = 25
/** Посадка-высадка, минут: прибавляется к каждому переезду. */
const BOARDING_MINUTES = 8
/** Ни один переезд не считается быстрее этого, минут. */
const MIN_TRAVEL_MINUTES = 10

/** Норма активного дня, минут: осмотр плюс переезды между точками. */
const FULL_DAY_MINUTES = 8 * 60

/** Норма первого дня тура и дня вылета, минут.
 *  В первый день человек добирается из аэропорта и заселяется, в последний —
 *  улетает. Полной программы ни там, ни там быть не может. */
const HALF_DAY_MINUTES = 4 * 60

/** Город, из которого улетают домой. Его последний день — день вылета. */
const DEPARTURE_CITY: CityId = 'khiva'

const EARTH_RADIUS_KM = 6371

/** Расстояние между точками по прямой, километры. */
export function distanceKm(a: Poi, b: Poi): number {
  const rad = Math.PI / 180
  const dLat = (b.lat - a.lat) * rad
  const dLon = (b.lon - a.lon) * rad
  const lat1 = a.lat * rad
  const lat2 = b.lat * rad
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Время переезда между точками, минуты: по координатам на скорости 25 км/ч,
 *  плюс посадка-высадка, но не меньше десяти минут. */
export function travelMinutes(a: Poi, b: Poi): number {
  const drive = (distanceKm(a, b) / SPEED_KMH) * 60
  return Math.max(MIN_TRAVEL_MINUTES, Math.round(drive + BOARDING_MINUTES))
}

/** Время осмотра точки, минуты. */
export function visitMinutes(p: Poi): number {
  return VISIT_MINUTES[p.category]
}

/** Порядок обхода точек города.
 *
 *  Сначала рейтинг: все точки с рейтингом 10 идут раньше точек с рейтингом 9.
 *  Внутри одного рейтинга — по близости: от текущей точки переходим к
 *  ближайшей из оставшихся. Первой встаёт точка высшего рейтинга, а при
 *  равенстве — первая по файлу заказчика, поэтому порядок устойчив.
 *
 *  Этот же порядок задаёт ОТБОР: чем раньше точка в цепочке, тем вернее
 *  она попадёт в короткий пакет. */
export function orderPoi(points: Poi[]): Poi[] {
  if (points.length < 2) return [...points]

  const rest = [...points].sort((a, b) => b.rating - a.rating || a.id.localeCompare(b.id))
  const chain: Poi[] = [rest.shift()!]

  while (rest.length) {
    const current = chain[chain.length - 1]
    const topRating = Math.max(...rest.map((p) => p.rating))
    // Ближайшая среди точек высшего оставшегося рейтинга. При равном
    // расстоянии выигрывает та, что раньше в файле, — порядок устойчив.
    let bestIndex = 0
    let bestDistance = Infinity
    rest.forEach((p, i) => {
      if (p.rating !== topRating) return
      const d = distanceKm(current, p)
      if (d < bestDistance - 1e-9) {
        bestDistance = d
        bestIndex = i
      }
    })
    chain.push(rest.splice(bestIndex, 1)[0])
  }

  return chain
}

/** Один день программы. */
export interface ItineraryDay {
  /** Дата дня, ISO. */
  date: string
  /** Номер дня внутри города, с единицы. */
  index: number
  points: Poi[]
  /** Занятое время дня, минуты: осмотр плюс переезды внутри дня. */
  minutes: number
  /** Норма этого дня, минуты: 8 часов, а у половинных — 4. */
  limit: number
  /** День прилёта: человек добирается из аэропорта и заселяется. */
  arrival: boolean
  /** День вылета: программа половинная. */
  departure: boolean
}

/** Город тура: даты, ночи и разложенная по дням программа. */
export interface ItineraryCity {
  cityId: CityId
  /** Дата заезда, ISO. */
  from: string
  /** Дата выезда, ISO. Она же дата заезда в следующий город. */
  to: string
  nights: number
  days: ItineraryDay[]
  /** Сколько точек вошло в программу города. */
  selected: number
  /** Сколько точек есть в городе всего. */
  total: number
}

/** Нормы дней города, в минутах.
 *
 *  Обычный день — 8 часов. Половинных дней ровно два на весь тур:
 *  первый день ПЕРВОГО города (прилёт и заселение) и день вылета из Хивы.
 *  В остальных городах день заезда — это переезд из соседнего города,
 *  дорога между ними в норму дня не входит.
 *
 *  Дней программы столько же, сколько ночей: день выезда — это переезд
 *  в следующий город. В городе вылета добавляется ещё один день, сам вылет. */
export function dayLimits(cityId: CityId, nights: number, isFirstCity: boolean): number[] {
  const limits = Array.from({ length: nights }, (_, i) =>
    isFirstCity && i === 0 ? HALF_DAY_MINUTES : FULL_DAY_MINUTES,
  )
  if (cityId === DEPARTURE_CITY) limits.push(HALF_DAY_MINUTES)
  return limits
}

/** Набрать точки по дням города.
 *
 *  Идём по цепочке — она уже упорядочена по рейтингу и близости — и набираем
 *  точки в день, пока он не заполнен своей нормой. Что не поместилось в дни
 *  города, В ПАКЕТ НЕ ВХОДИТ: растягивать день сверх нормы нельзя, а тащить
 *  точку в другой город бессмысленно.
 *
 *  Первая точка дня переезда не тянет: день начинается от гостиницы,
 *  а дорога до неё в норму не входит. */
export function fillDays(chain: Poi[], limits: number[]): { days: Poi[][]; dropped: Poi[] } {
  const days: Poi[][] = limits.map(() => [])
  if (!limits.length) return { days, dropped: [...chain] }

  let day = 0
  let spent = 0

  for (let i = 0; i < chain.length; i++) {
    const p = chain[i]
    const last = days[day][days[day].length - 1]
    const cost = visitMinutes(p) + (last ? travelMinutes(last, p) : 0)

    if (days[day].length > 0 && spent + cost > limits[day]) {
      // День заполнен — переходим к следующему. Дни кончились: остальные
      // точки в пакет не входят, и это видно в интерфейсе числом «N из M».
      day += 1
      if (day >= limits.length) return { days, dropped: chain.slice(i) }
      spent = 0
    }

    const first = days[day].length === 0
    const actual = first ? visitMinutes(p) : cost

    // Точка, которая не влезает даже в пустой день, пропускается:
    // норма дня важнее полноты списка.
    if (first && actual > limits[day]) continue

    days[day].push(p)
    spent += actual
  }

  return { days, dropped: [] }
}

/** Занятое время дня, минуты: осмотр плюс переезды внутри дня. */
function dayMinutes(points: Poi[]): number {
  let sum = 0
  points.forEach((p, i) => {
    sum += visitMinutes(p)
    if (i > 0) sum += travelMinutes(points[i - 1], p)
  })
  return sum
}

/** Программа города: точки набраны по дням, у каждого дня настоящая дата. */
export function planCity(
  cityId: CityId,
  nights: number,
  from: string,
  isFirstCity: boolean,
): ItineraryCity {
  const all = poiByCity(cityId)
  const limits = dayLimits(cityId, nights, isFirstCity)
  const { days: filled } = fillDays(orderPoi(all), limits)

  const days: ItineraryDay[] = filled.map((points, i) => ({
    date: addDays(from, i),
    index: i + 1,
    points,
    minutes: dayMinutes(points),
    limit: limits[i],
    arrival: isFirstCity && i === 0,
    departure: cityId === DEPARTURE_CITY && i === limits.length - 1,
  }))

  return {
    cityId,
    from,
    to: addDays(from, nights),
    nights,
    days,
    selected: filled.reduce((sum, d) => sum + d.length, 0),
    total: all.length,
  }
}

/** Весь тур: четыре города подряд от одной даты начала.
 *  Порядок жёсткий — Ташкент → Самарканд → Бухара → Хива. */
export function planTour(nights: PackageNights, startDate: string): ItineraryCity[] {
  const stops = packageStops(nights)
  const byId = new Map(stops.map((s) => [s.cityId, s.nights]))

  const cities: ItineraryCity[] = []
  let cursor = startDate
  for (const cityId of DEFAULT_CITY_ORDER) {
    const cityNights = byId.get(cityId)
    if (!cityNights) continue
    const city = planCity(cityId, cityNights, cursor, cities.length === 0)
    cities.push(city)
    cursor = city.to
  }
  return cities
}

/** Дата окончания тура: день вылета из последнего города. */
export function tourEnd(nights: PackageNights, startDate: string): string {
  return addDays(startDate, nights)
}

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
// Сколько точек вошло — в поле `selected`, время программы — в `minutes`.
// Наружу выводится ТОЛЬКО количество вошедших: сравнение «10 из 19»
// убрано решением заказчика от 22.08.2026, оно подсвечивало то, чего человек
// не увидит, вместо того, что увидит. Поле `total` осталось для проверок.
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
  /** Дата дня, ISO. null — дата вылета ещё не выбрана, программа известна,
   *  а числа календаря нет. */
  date: string | null
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
  /** Дата заезда, ISO. null — дата вылета не выбрана. */
  from: string | null
  /** Дата выезда, ISO. Она же дата заезда в следующий город. */
  to: string | null
  nights: number
  days: ItineraryDay[]
  /** Сколько точек вошло в программу города. */
  selected: number
  /** Сколько точек есть в городе всего. Наружу это число не выводится:
   *  экран показывает только то, что человек увидит, а не то, чего не увидит. */
  total: number
  /** Время программы города, минуты: осмотр всех вошедших точек плюс
   *  переезды между ними. Дорога между городами сюда не входит. */
  minutes: number
}

/** Нормы дней ОСМОТРА, в минутах.
 *
 *  Обычный день — 8 часов. Половинный ровно один: первый день ПЕРВОГО города,
 *  день прилёта, — человек добирается из аэропорта и заселяется. В остальных
 *  городах день заезда это переезд из соседнего города, и дорога между ними
 *  в норму дня не входит.
 *
 *  Дней осмотра в городе столько же, сколько ночей: день выезда — это переезд
 *  в следующий город. День вылета из Хивы сюда НЕ входит: он идёт отдельно
 *  и точек не содержит, см. planCity(). */
export function dayLimits(nights: number, isFirstCity: boolean): number[] {
  return Array.from({ length: nights }, (_, i) =>
    isFirstCity && i === 0 ? HALF_DAY_MINUTES : FULL_DAY_MINUTES,
  )
}

/** Время цепочки точек подряд, минуты: осмотр каждой плюс переезд от
 *  предыдущей. Первая точка дороги не тянет — день начинается от гостиницы. */
function chainMinutes(points: Poi[]): number {
  let sum = 0
  points.forEach((p, i) => {
    sum += visitMinutes(p)
    if (i > 0) sum += travelMinutes(points[i - 1], p)
  })
  return sum
}

/** Сколько точек с начала цепочки помещается в общий бюджет города.
 *
 *  Это ОТБОР: чем раньше точка в цепочке, тем выше её рейтинг и тем вернее
 *  она попадёт в короткий пакет. Что не поместилось — в пакет не входит. */
function selectCount(chain: Poi[], budget: number): number {
  let count = 0
  for (let k = 1; k <= chain.length; k++) {
    if (chainMinutes(chain.slice(0, k)) > budget) break
    count = k
  }
  return count
}

/** Разложить точки по дням РАВНОМЕРНО.
 *
 *  Раньше дни набирались по порядку до нормы, и в длинных пакетах последние
 *  дни оставались пустыми. Человек платит за каждый день и должен видеть,
 *  что в нём происходит, поэтому теперь сначала считается доля дня, а потом
 *  идёт раскладка: точек мало — дни становятся легче, но пустых нет.
 *
 *  Доля дня пропорциональна его норме: день прилёта вдвое короче обычного
 *  и получает вдвое меньше программы. Норму доля не превышает — восемь часов
 *  остаются потолком, а не средним.
 *
 *  Возвращает и то, что не поместилось: эти точки в пакет не входят. */
export function fillDays(chain: Poi[], limits: number[]): { days: Poi[][]; dropped: Poi[] } {
  const days: Poi[][] = limits.map(() => [])
  if (!limits.length) return { days, dropped: [...chain] }

  const budget = limits.reduce((a, b) => a + b, 0)
  const selected = chain.slice(0, selectCount(chain, budget))
  if (!selected.length) return { days, dropped: [...chain] }

  const total = chainMinutes(selected)
  const targets = limits.map((limit) => Math.min(limit, (total * limit) / budget))

  let day = 0
  let spent = 0
  let placed = 0

  /** Сколько времени добавит точка к текущему дню. Первая точка дня
   *  дороги не тянет — день начинается от гостиницы. */
  const costOf = (p: Poi) => {
    const last = days[day][days[day].length - 1]
    return visitMinutes(p) + (last ? travelMinutes(last, p) : 0)
  }

  for (const p of selected) {
    // Доля дня набрана — переходим к следующему, если он есть и если
    // оставшихся точек хватит, чтобы ни один день не остался пустым.
    const daysLeft = limits.length - day - 1
    const pointsLeft = selected.length - placed
    if (
      days[day].length > 0 &&
      daysLeft > 0 &&
      pointsLeft > daysLeft &&
      spent + costOf(p) > targets[day]
    ) {
      day += 1
      spent = 0
    }

    // Норма дня — ЖЁСТКИЙ потолок, а не средний ориентир. Точка, которая
    // в него не влезает, уезжает в следующий день, а если дней больше нет —
    // в пакет не входит вовсе.
    while (days[day].length > 0 && spent + costOf(p) > limits[day]) {
      if (day + 1 >= limits.length) return { days, dropped: selected.slice(placed) }
      day += 1
      spent = 0
    }

    // Точка, которая не влезает даже в пустой день, пропускается.
    if (days[day].length === 0 && visitMinutes(p) > limits[day]) {
      placed += 1
      continue
    }

    spent += costOf(p)
    days[day].push(p)
    placed += 1
  }

  return { days, dropped: [] }
}

/** Занятое время дня, минуты: осмотр плюс переезды внутри дня. */
function dayMinutes(points: Poi[]): number {
  return chainMinutes(points)
}

/** Программа города: точки разложены по дням, у каждого дня настоящая дата.
 *
 *  У города вылета в конце добавляется ещё один день — сам день вылета.
 *  Точек в нём нет: они уходят на предыдущие дни города. Пустым он при этом
 *  не остаётся — экран показывает в нём свободное время, трансфер в аэропорт
 *  Ургенча и перелёт. */
export function planCity(
  cityId: CityId,
  nights: number,
  from: string | null,
  isFirstCity: boolean,
): ItineraryCity {
  const all = poiByCity(cityId)
  const limits = dayLimits(nights, isFirstCity)
  const { days: filled } = fillDays(orderPoi(all), limits)

  const days: ItineraryDay[] = filled.map((points, i) => ({
    date: from ? addDays(from, i) : null,
    index: i + 1,
    points,
    minutes: dayMinutes(points),
    limit: limits[i],
    arrival: isFirstCity && i === 0,
    departure: false,
  }))

  // День вылета идёт сверх дней осмотра: человек ночует последнюю ночь
  // и улетает наутро. По календарю это отдельный день, и он должен быть
  // виден — иначе поездка на экране кончается на день раньше, чем в жизни.
  if (cityId === DEPARTURE_CITY) {
    days.push({
      date: from ? addDays(from, nights) : null,
      index: days.length + 1,
      points: [],
      minutes: 0,
      limit: HALF_DAY_MINUTES,
      arrival: false,
      departure: true,
    })
  }

  return {
    cityId,
    from,
    to: from ? addDays(from, nights) : null,
    nights,
    days,
    selected: filled.reduce((sum, d) => sum + d.length, 0),
    total: all.length,
    minutes: days.reduce((sum, d) => sum + d.minutes, 0),
  }
}

/** Весь тур: четыре города подряд от одной даты начала.
 *  Порядок жёсткий — Ташкент → Самарканд → Бухара → Хива. */
export function planTour(
  nights: PackageNights,
  startDate: string | null,
): ItineraryCity[] {
  const stops = packageStops(nights)
  const byId = new Map(stops.map((s) => [s.cityId, s.nights]))

  const cities: ItineraryCity[] = []
  // Дата вылета не выбрана — программа считается всё равно, просто без дат.
  let cursor: string | null = startDate
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


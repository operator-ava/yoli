// Переезды МЕЖДУ городами маршрута.
//
// Не путать с переездами внутри города: те считает планировщик точек
// (`src/composables/itinerary.ts`, 25 км/ч) и показывает в сводке города
// «19 достопримечательностей · 22 ч 1 мин с переездами». Здесь — дорога
// из города в город, отдельной строкой в шапке города.
//
// Расстояние считается ПО КООРДИНАТАМ ЦЕНТРОВ городов, скорость машины
// 70 км/ч. Прямая линия короче дороги, поэтому применяется коэффициент
// извилистости: он подобран так, чтобы Бухара — Хива дала 450 км —
// расстояние, названное заказчиком. На остальных парах он даёт 311 и 254 км.
//
// ⚠️ Время поездов — РЕАЛЬНОЕ РАСПИСАНИЕ «Афросиаба», названное заказчиком:
// Ташкент — Самарканд 2 ч 10 мин, Самарканд — Бухара 1 ч 30 мин.
// Из интернета ничего не тянем, как и курсы валют.
import type { CityId, Level } from './pricing'

/** Координаты центров городов. Используются только для расстояний. */
export const CITY_CENTER: Record<CityId, { lat: number; lon: number }> = {
  tashkent: { lat: 41.2995, lon: 69.2401 },
  samarkand: { lat: 39.627, lon: 66.975 },
  bukhara: { lat: 39.7747, lon: 64.4286 },
  khiva: { lat: 41.3783, lon: 60.3639 },
}

/** Скорость машины между городами, км/ч. */
export const CAR_SPEED_KMH = 70

/** Коэффициент извилистости дороги к прямой линии.
 *  Подобран по единственному названному заказчиком расстоянию:
 *  Бухара — Хива по прямой 386.8 км, по дороге около 450. */
export const ROAD_FACTOR = 1.163

const EARTH_RADIUS_KM = 6371

/** Расстояние между центрами городов по прямой, километры. */
export function centerDistanceKm(a: CityId, b: CityId): number {
  const rad = Math.PI / 180
  const p = CITY_CENTER[a]
  const q = CITY_CENTER[b]
  const dLat = (q.lat - p.lat) * rad
  const dLon = (q.lon - p.lon) * rad
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(p.lat * rad) * Math.cos(q.lat * rad) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Дорожное расстояние между городами, километры. */
export function roadKm(a: CityId, b: CityId): number {
  return centerDistanceKm(a, b) * ROAD_FACTOR
}

/** Чем едут между городами. */
export type HopMode = 'train' | 'car' | 'flight'

/** Скоростные поезда «Афросиаб» на плече, минут. Плечо без записи — только
 *  машиной. Ключ — «откуда|куда» в порядке маршрута. */
const TRAIN_MINUTES: Record<string, number> = {
  'tashkent|samarkand': 130,
  'samarkand|bukhara': 90,
}

/** Вид транспорта на плече.
 *
 *  У люкса вместо поезда частная машина: тариф обещает отдельный автомобиль
 *  на всю поездку, а не место в общем вагоне. Ехать дольше — это цена
 *  приватности, и человек должен видеть её заранее. */
export function hopMode(from: CityId, to: CityId, level: Level | null): HopMode {
  if (level === 'lux') return 'car'
  return TRAIN_MINUTES[`${from}|${to}`] !== undefined ? 'train' : 'car'
}

/** Перелёт Ургенч → Ташкент в день вылета, минут.
 *  Реальное время в воздухе, названное заказчиком. */
export const RETURN_FLIGHT_MINUTES = 80

/** Время переезда между городами, минуты. */
export function hopMinutes(from: CityId, to: CityId, level: Level | null): number {
  if (hopMode(from, to, level) === 'train') return TRAIN_MINUTES[`${from}|${to}`]
  return Math.round((roadKm(from, to) / CAR_SPEED_KMH) * 60)
}

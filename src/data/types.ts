// Черновые типы предметной области.
// Весь контент живёт в /src/data, компоненты его не хранят.

/** Уровень доступа к содержимому. Оплата пока не реализована —
 *  признак заложен в модель заранее, чтобы не переделывать данные потом. */
export type Access = 'free' | 'paid'

/** Категория платного блока — по ней потом соберётся покупка. */
export type PaidCategory = 'hotels' | 'logistics' | 'food'

/** Блок контента внутри точки или участка (текст, аудио, галерея и т.п.). */
export interface ContentBlock {
  id: string
  /** Тип блока — определяет, как его рисовать. */
  kind: 'text' | 'audio' | 'gallery' | 'tip'
  title: string
  /** Тело блока. Для 'text'/'tip' — текст, для 'audio'/'gallery' — путь к файлу. */
  body: string
  access: Access
  /** Заполняется только для access: 'paid'. */
  category?: PaidCategory
}

/** Географическая координата. */
export interface GeoPoint {
  lat: number
  lng: number
}

/** POI — точка маршрута, к которой приложение ведёт пользователя. */
export interface Poi {
  id: string
  routeId: string
  /** Порядковый номер точки в маршруте, с 1. */
  order: number
  title: string
  subtitle?: string
  coords: GeoPoint
  /** Радиус в метрах, при входе в который точка считается достигнутой. */
  arrivalRadius: number
  access: Access
  blocks: ContentBlock[]
}

/** Участок пути между двумя соседними точками. */
export interface Segment {
  id: string
  routeId: string
  fromPoiId: string
  toPoiId: string
  /** Длина участка в метрах. */
  distance: number
  /** Ожидаемое время прохождения в минутах. */
  duration: number
  /** Способ передвижения на участке. */
  mode: 'walk' | 'car' | 'transit' | 'boat'
  /** Подсказки в дороге: что смотреть, где свернуть. */
  blocks: ContentBlock[]
}

/** Маршрут целиком. */
export interface Route {
  id: string
  title: string
  summary: string
  /** Регион/город для группировки в списке. */
  region: string
  /** Суммарная длина в метрах и время в минутах. */
  distance: number
  duration: number
  difficulty: 'easy' | 'medium' | 'hard'
  /** Обложка — путь в /public или импорт ассета. */
  cover?: string
  /** Доступ к маршруту целиком: 'free' — открыт, 'paid' — часть точек под замком. */
  access: Access
  pois: Poi[]
  segments: Segment[]
}

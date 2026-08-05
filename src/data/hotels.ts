// Размещение по городам и тарифам.
//
// ⚠️ ТРЕБУЕТ УТВЕРЖДЕНИЯ ЗАКАЗЧИКОМ: категории размещения по уровням —
// реконструкция, в материалах заказчика различий по уровням нет.
//
// ⚠️ ТРЕБУЕТ ДАННЫХ: названий отелей у нас нет. Поле name пустое,
// в интерфейсе вместо имени показывается категория. Имена НЕ ВЫДУМЫВАЮТСЯ.
import type { CityId, Level } from './pricing'

/** Возможные удобства. Показываются только те, что заданы в данных отеля. */
export type AmenityKey =
  | 'wifi'
  | 'breakfast'
  | 'ac'
  | 'hairdryer'
  | 'safe'
  | 'bath'
  | 'cleaning'
  | 'reception'

export const AMENITIES: { key: AmenityKey; label: string }[] = [
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'breakfast', label: 'Завтрак' },
  { key: 'ac', label: 'Кондиционер' },
  { key: 'hairdryer', label: 'Фен' },
  { key: 'safe', label: 'Сейф' },
  { key: 'bath', label: 'Душ или ванна' },
  { key: 'cleaning', label: 'Уборка' },
  { key: 'reception', label: 'Ресепшн 24/7' },
]

export interface Hotel {
  /** ⚠️ ТРЕБУЕТ ДАННЫХ. Пока пусто — показывается категория. */
  name: string
  /** Категория размещения: то, что показываем вместо имени. */
  category: string
  /** Описание обслуживания. ⚠️ ТРЕБУЕТ ДАННЫХ — заполняет заказчик. */
  service: string
  /** ⚠️ ТРЕБУЕТ ДАННЫХ: пока пусто, блок удобств не рисуется. */
  amenities: AmenityKey[]
  /** Фото размещения. Пусто — в листе остаётся пустое место, заглушки не рисуем.
   *  В фотобанке заказчика только достопримечательности, отелей там нет. */
  photo: string
}

/** ⚠️ ТРЕБУЕТ УТВЕРЖДЕНИЯ: категории по уровням заданы вручную. */
const BY_LEVEL: Record<Level, Pick<Hotel, 'category'>> = {
  econom: { category: '3★, гостевой дом или отель в шаговой доступности от центра' },
  medium: { category: '4★ в центре города' },
  lux: { category: '5★ или бутик-отель исторического квартала' },
}

/** Короткая версия категории — для строки в карточке тарифа. */
const SHORT_BY_LEVEL: Record<Level, string> = {
  econom: '3★, рядом с центром',
  medium: '4★, центр города',
  lux: '5★ или бутик-отель',
}

/** Размещение для города и тарифа. Пока не зависит от города —
 *  ровно настолько, насколько это подтверждено данными. */
export function hotel(_cityId: CityId, level: Level): Hotel {
  return {
    name: '', // ⚠️ ТРЕБУЕТ ДАННЫХ
    category: BY_LEVEL[level].category,
    service: '', // ⚠️ ТРЕБУЕТ ДАННЫХ
    amenities: [], // ⚠️ ТРЕБУЕТ ДАННЫХ
    photo: '', // ⚠️ ТРЕБУЕТ ДАННЫХ
  }
}

/** Сводка одной строкой для карточки тарифа. */
export function hotelSummary(_cityId: CityId, level: Level): string {
  return SHORT_BY_LEVEL[level]
}

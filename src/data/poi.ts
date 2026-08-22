// Точки маршрута по четырём городам.
//
// СГЕНЕРИРОВАНО. Источник — файл заказчика «Точки_POI.xlsx» в корне проекта,
// 79 строк. Генератор — `python3 scripts/import-poi.py`. Руками не правится:
// пришёл новый файл — заменить его и перегенерировать.
//
// Взяты 69 точек из 79: Ферганская долина (10 точек) в маршрут не входит.
// Числа и названия перенесены КАК ЕСТЬ. Координаты, рейтинг и категория
// не додумываются: нет данных — точки нет.
// Названия точек — имена собственные, на всех трёх языках показываются
// по-русски: перевода у заказчика нет. Переведены только категории,
// ключи poi.cat.* в /src/i18n.
import type { CityId } from './pricing'

/** Категории точек — ровно те, что есть в файле заказчика. */
export type PoiCategory =
  | 'architecture'
  | 'crafts'
  | 'culture'
  | 'entertainment'
  | 'ethno'
  | 'gastro'
  | 'history'
  | 'market'
  | 'museum'
  | 'park'
  | 'religion'
  | 'viewpoint'
  | 'walk'

/** Время осмотра точки по категории, В МИНУТАХ. Утверждено заказчиком.
 *  Используется планировщиком дней — здесь и только здесь. */
export const VISIT_MINUTES: Record<PoiCategory, number> = {
  architecture: 60,
  crafts: 45,
  culture: 60,
  entertainment: 90,
  ethno: 50,
  gastro: 60,
  history: 50,
  market: 45,
  museum: 75,
  park: 40,
  religion: 50,
  viewpoint: 30,
  walk: 60,
}

export interface Poi {
  /** Устойчивый идентификатор: город и номер по порядку в файле заказчика. */
  id: string
  cityId: CityId
  /** Имя собственное. Показывается как есть на всех трёх языках. */
  name: string
  category: PoiCategory
  /** Рейтинг из файла заказчика: 9 или 10. Задаёт порядок обхода и отбор. */
  rating: number
  lat: number
  lon: number
}

/** Все точки маршрута. Порядок — по городам маршрута, внутри города как в файле. */
export const POI: Poi[] = [
  { id: 'tashkent-1', cityId: 'tashkent', name: 'Базар Чорсу', category: 'market', rating: 10, lat: 41.326736, lon: 69.235032 },
  { id: 'tashkent-2', cityId: 'tashkent', name: 'Площадь Амира Темура', category: 'walk', rating: 10, lat: 41.311139, lon: 69.279593 },
  { id: 'tashkent-3', cityId: 'tashkent', name: 'Площадь Независимости', category: 'walk', rating: 10, lat: 41.315256, lon: 69.266627 },
  { id: 'tashkent-4', cityId: 'tashkent', name: 'Комплекс Хазрати-Имам', category: 'religion', rating: 10, lat: 41.337178, lon: 69.240123 },
  { id: 'tashkent-5', cityId: 'tashkent', name: 'Мечеть Минор', category: 'architecture', rating: 10, lat: 41.33521, lon: 69.274992 },
  { id: 'tashkent-6', cityId: 'tashkent', name: 'Ташкентская телебашня', category: 'viewpoint', rating: 10, lat: 41.345569, lon: 69.284603 },
  { id: 'tashkent-7', cityId: 'tashkent', name: 'Музей истории Узбекистана', category: 'museum', rating: 10, lat: 41.311698, lon: 69.269361 },
  { id: 'tashkent-8', cityId: 'tashkent', name: 'Медресе Кукельдаш', category: 'architecture', rating: 10, lat: 41.323464, lon: 69.23627 },
  { id: 'tashkent-9', cityId: 'tashkent', name: 'Центр исламской цивилизации', category: 'museum', rating: 10, lat: 41.335276, lon: 69.240381 },
  { id: 'tashkent-10', cityId: 'tashkent', name: 'Театр имени Алишера Навои', category: 'culture', rating: 10, lat: 41.309163, lon: 69.271548 },
  { id: 'tashkent-11', cityId: 'tashkent', name: 'Музей прикладного искусства', category: 'museum', rating: 10, lat: 41.301028, lon: 69.259395 },
  { id: 'tashkent-12', cityId: 'tashkent', name: 'Станция метро Космонавтлар', category: 'architecture', rating: 10, lat: 41.305193, lon: 69.26477 },
  { id: 'tashkent-13', cityId: 'tashkent', name: 'Центр плова (Чорсу)', category: 'gastro', rating: 9, lat: 41.327232, lon: 69.235794 },
  { id: 'tashkent-14', cityId: 'tashkent', name: 'Медресе Барак-хана', category: 'architecture', rating: 9, lat: 41.336934, lon: 69.239049 },
  { id: 'tashkent-15', cityId: 'tashkent', name: 'Парк Magic City', category: 'entertainment', rating: 9, lat: 41.304055, lon: 69.244652 },
  { id: 'tashkent-16', cityId: 'tashkent', name: 'Японский сад', category: 'park', rating: 9, lat: 41.339734, lon: 69.282352 },
  { id: 'tashkent-17', cityId: 'tashkent', name: 'Дворец Романова', category: 'architecture', rating: 9, lat: 41.314251, lon: 69.270535 },
  { id: 'tashkent-18', cityId: 'tashkent', name: 'Алайский базар', category: 'market', rating: 9, lat: 41.319362, lon: 69.285339 },
  { id: 'tashkent-19', cityId: 'tashkent', name: 'Государственный музей искусств', category: 'museum', rating: 9, lat: 41.302746, lon: 69.277789 },
  { id: 'samarkand-1', cityId: 'samarkand', name: 'Площадь Регистан', category: 'architecture', rating: 10, lat: 39.654647, lon: 66.975767 },
  { id: 'samarkand-2', cityId: 'samarkand', name: 'Некрополь Шахи-Зинда', category: 'religion', rating: 10, lat: 39.662137, lon: 66.987938 },
  { id: 'samarkand-3', cityId: 'samarkand', name: 'Мавзолей Гур-Эмир', category: 'architecture', rating: 10, lat: 39.648547, lon: 66.969249 },
  { id: 'samarkand-4', cityId: 'samarkand', name: 'Мечеть Биби-Ханум', category: 'architecture', rating: 10, lat: 39.660734, lon: 66.9802 },
  { id: 'samarkand-5', cityId: 'samarkand', name: 'Обсерватория Улугбека', category: 'history', rating: 10, lat: 39.67481, lon: 67.005637 },
  { id: 'samarkand-6', cityId: 'samarkand', name: 'Сиабский базар', category: 'market', rating: 10, lat: 39.662048, lon: 66.979861 },
  { id: 'samarkand-7', cityId: 'samarkand', name: 'Музей Афрасиаб', category: 'museum', rating: 10, lat: 39.669295, lon: 66.993367 },
  { id: 'samarkand-8', cityId: 'samarkand', name: 'Мавзолей Святого Даниила', category: 'religion', rating: 10, lat: 39.673377, lon: 66.994531 },
  { id: 'samarkand-9', cityId: 'samarkand', name: 'Мавзолей имама аль-Бухари', category: 'religion', rating: 10, lat: 39.815637, lon: 66.944064 },
  { id: 'samarkand-10', cityId: 'samarkand', name: 'Фабрика бумаги Мерос (Конигил)', category: 'crafts', rating: 10, lat: 39.666646, lon: 67.034119 },
  { id: 'samarkand-11', cityId: 'samarkand', name: 'Мечеть Хазрат Хызр', category: 'religion', rating: 9, lat: 39.663438, lon: 66.983253 },
  { id: 'samarkand-12', cityId: 'samarkand', name: 'Мавзолей Рухабад', category: 'architecture', rating: 9, lat: 39.650825, lon: 66.968196 },
  { id: 'samarkand-13', cityId: 'samarkand', name: 'Комплекс Ходжа Ахрар Вали', category: 'religion', rating: 9, lat: 39.618849, lon: 66.953281 },
  { id: 'samarkand-14', cityId: 'samarkand', name: 'Парк имени Алишера Навои', category: 'park', rating: 9, lat: 39.650472, lon: 66.956895 },
  { id: 'samarkand-15', cityId: 'samarkand', name: 'Вечный город (Boqiy Shahar)', category: 'ethno', rating: 9, lat: 39.653818, lon: 67.061327 },
  { id: 'samarkand-16', cityId: 'samarkand', name: 'Шёлковые ковры «Худжум»', category: 'crafts', rating: 9, lat: 39.659665, lon: 66.992178 },
  { id: 'samarkand-17', cityId: 'samarkand', name: 'Мавзолей Ходжа Абди Дарун', category: 'religion', rating: 9, lat: 39.641776, lon: 66.991515 },
  { id: 'bukhara-1', cityId: 'bukhara', name: 'Комплекс Пои-Калян', category: 'architecture', rating: 10, lat: 39.776038, lon: 64.415095 },
  { id: 'bukhara-2', cityId: 'bukhara', name: 'Минарет Калян', category: 'architecture', rating: 10, lat: 39.775712, lon: 64.41512 },
  { id: 'bukhara-3', cityId: 'bukhara', name: 'Мечеть Калян', category: 'architecture', rating: 10, lat: 39.776173, lon: 64.414036 },
  { id: 'bukhara-4', cityId: 'bukhara', name: 'Медресе Мири-Араб', category: 'architecture', rating: 10, lat: 39.776027, lon: 64.41537 },
  { id: 'bukhara-5', cityId: 'bukhara', name: 'Крепость Арк', category: 'history', rating: 10, lat: 39.778032, lon: 64.409763 },
  { id: 'bukhara-6', cityId: 'bukhara', name: 'Площадь Ляби-Хауз', category: 'walk', rating: 10, lat: 39.773049, lon: 64.420765 },
  { id: 'bukhara-7', cityId: 'bukhara', name: 'Чор-Минор', category: 'architecture', rating: 10, lat: 39.774868, lon: 64.427349 },
  { id: 'bukhara-8', cityId: 'bukhara', name: 'Мавзолей Саманидов', category: 'architecture', rating: 10, lat: 39.777013, lon: 64.400593 },
  { id: 'bukhara-9', cityId: 'bukhara', name: 'Мечеть Боло-Хауз', category: 'architecture', rating: 10, lat: 39.777753, lon: 64.407287 },
  { id: 'bukhara-10', cityId: 'bukhara', name: 'Дворец Ситораи Мохи-Хоса', category: 'architecture', rating: 10, lat: 39.814197, lon: 64.441111 },
  { id: 'bukhara-11', cityId: 'bukhara', name: 'Мавзолей Чашма-Аюб', category: 'religion', rating: 10, lat: 39.778292, lon: 64.402392 },
  { id: 'bukhara-12', cityId: 'bukhara', name: 'Мечеть Магоки-Аттари', category: 'architecture', rating: 10, lat: 39.773281, lon: 64.418315 },
  { id: 'bukhara-13', cityId: 'bukhara', name: 'Токи-Заргарон', category: 'market', rating: 10, lat: 39.776386, lon: 64.416641 },
  { id: 'bukhara-14', cityId: 'bukhara', name: 'Токи-Тельпак-Фурушон', category: 'market', rating: 10, lat: 39.773855, lon: 64.417257 },
  { id: 'bukhara-15', cityId: 'bukhara', name: 'Токи-Саррафон', category: 'market', rating: 10, lat: 39.772508, lon: 64.41863 },
  { id: 'bukhara-16', cityId: 'bukhara', name: 'Медресе Нодир Диван-беги', category: 'architecture', rating: 10, lat: 39.773079, lon: 64.421442 },
  { id: 'bukhara-17', cityId: 'bukhara', name: 'Комплекс Бахауддина Накшбанди', category: 'religion', rating: 10, lat: 39.800333, lon: 64.5369 },
  { id: 'bukhara-18', cityId: 'bukhara', name: 'Некрополь Чор-Бакр', category: 'religion', rating: 10, lat: 39.774326, lon: 64.333548 },
  { id: 'bukhara-19', cityId: 'bukhara', name: 'Медресе Кукельдаш (Бухара)', category: 'architecture', rating: 10, lat: 39.773646, lon: 64.421106 },
  { id: 'bukhara-20', cityId: 'bukhara', name: 'Тим Абдуллахана', category: 'market', rating: 9, lat: 39.775455, lon: 64.417117 },
  { id: 'bukhara-21', cityId: 'bukhara', name: 'Мавзолей Сайфиддина Бахарзи', category: 'religion', rating: 9, lat: 39.766662, lon: 64.444763 },
  { id: 'bukhara-22', cityId: 'bukhara', name: 'Парк Саманидов', category: 'park', rating: 9, lat: 39.776352, lon: 64.399865 },
  { id: 'khiva-1', cityId: 'khiva', name: 'Ичан-Кала', category: 'architecture', rating: 10, lat: 41.378069, lon: 60.35933 },
  { id: 'khiva-2', cityId: 'khiva', name: 'Минарет Кальта-Минор', category: 'architecture', rating: 10, lat: 41.378323, lon: 60.357991 },
  { id: 'khiva-3', cityId: 'khiva', name: 'Цитадель Куня-Арк', category: 'history', rating: 10, lat: 41.379351, lon: 60.357885 },
  { id: 'khiva-4', cityId: 'khiva', name: 'Дворец Таш-Хаули', category: 'architecture', rating: 10, lat: 41.378418, lon: 60.361667 },
  { id: 'khiva-5', cityId: 'khiva', name: 'Джума-мечеть', category: 'architecture', rating: 10, lat: 41.377498, lon: 60.359911 },
  { id: 'khiva-6', cityId: 'khiva', name: 'Минарет Ислам-Ходжи', category: 'viewpoint', rating: 10, lat: 41.376598, lon: 60.360103 },
  { id: 'khiva-7', cityId: 'khiva', name: 'Медресе Мухаммада Амин-хана', category: 'architecture', rating: 10, lat: 41.378033, lon: 60.357445 },
  { id: 'khiva-8', cityId: 'khiva', name: 'Западные ворота Ата-Дарваза', category: 'architecture', rating: 10, lat: 41.378585, lon: 60.3571 },
  { id: 'khiva-9', cityId: 'khiva', name: 'Мавзолей Пахлавана Махмуда', category: 'religion', rating: 9, lat: 41.377133, lon: 60.359513 },
  { id: 'khiva-10', cityId: 'khiva', name: 'Медресе Аллакули-хана', category: 'architecture', rating: 9, lat: 41.377497, lon: 60.362075 },
  { id: 'khiva-11', cityId: 'khiva', name: 'Мавзолей Сайида Алауддина', category: 'religion', rating: 9, lat: 41.377799, lon: 60.358535 },
]

const BY_CITY = new Map<CityId, Poi[]>()
for (const p of POI) {
  const list = BY_CITY.get(p.cityId)
  if (list) list.push(p)
  else BY_CITY.set(p.cityId, [p])
}

/** Точки города в порядке файла заказчика. Порядок обхода и отбор
 *  считает планировщик в /src/composables/itinerary.ts. */
export function poiByCity(id: CityId): Poi[] {
  return BY_CITY.get(id) ?? []
}

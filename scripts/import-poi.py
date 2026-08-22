#!/usr/bin/env python3
# Генерация src/data/poi.ts из файла заказчика «Точки_POI.xlsx».
#
# Числа и названия переносятся КАК ЕСТЬ, руками ничего не набирается.
# Ферганская долина в маршрут не входит и отбрасывается здесь.
#
# Только стандартная библиотека: xlsx — это zip с XML, внешние пакеты
# ради одного разбора в проект не тянем.
#
# Запуск из корня проекта:  python3 scripts/import-poi.py
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

SOURCE = 'Точки_POI.xlsx'
TARGET = 'src/data/poi.ts'
NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'

# Города маршрута. Всё, чего здесь нет, в poi.ts не попадает.
CITY = {
    'Ташкент': 'tashkent',
    'Самарканд': 'samarkand',
    'Бухара': 'bukhara',
    'Хива': 'khiva',
}

# Категории заказчика и время осмотра, минут. Утверждено заказчиком.
CATEGORY = {
    'Архитектура': ('architecture', 60),
    'Религия': ('religion', 50),
    'Музей': ('museum', 75),
    'Рынок': ('market', 45),
    'Парк': ('park', 40),
    'Прогулка': ('walk', 60),
    'Культура': ('culture', 60),
    'История': ('history', 50),
    'Ремёсла': ('crafts', 45),
    'Этно': ('ethno', 50),
    'Смотровая': ('viewpoint', 30),
    'Развлечение': ('entertainment', 90),
    'Гастро': ('gastro', 60),
}

ORDER = ['tashkent', 'samarkand', 'bukhara', 'khiva']


def read_rows(path):
    """Строки листа. Заказчик кладёт всю строку CSV в одну ячейку."""
    z = zipfile.ZipFile(path)
    shared = []
    try:
        root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in root.findall(NS + 'si'):
            shared.append(''.join(t.text or '' for t in si.iter(NS + 't')))
    except KeyError:
        pass

    sheet = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
    rows = []
    for row in sheet.iter(NS + 'row'):
        cells = {}
        for c in row.findall(NS + 'c'):
            col = re.match(r'[A-Z]+', c.get('r')).group()
            v = c.find(NS + 'v')
            kind = c.get('t')
            if kind == 'inlineStr':
                node = c.find(NS + 'is')
                value = ''.join(x.text or '' for x in node.iter(NS + 't')) if node is not None else ''
            elif v is None:
                value = ''
            elif kind == 's':
                value = shared[int(v.text)]
            else:
                value = v.text
            cells[col] = value
        if cells:
            rows.append(cells)
    return rows


def parse(rows):
    lines = [r['A'].split(',') for r in rows if r.get('A')]
    header = lines[0]
    expected = ['city', 'poi', 'category', 'rating', 'latitude', 'longitude']
    if header != expected:
        sys.exit(f'Шапка файла изменилась: {header}. Ждём {expected}.')

    points = []
    skipped = {}
    for parts in lines[1:]:
        if len(parts) != 6:
            sys.exit(f'Строка не с шестью полями: {parts}')
        city, name, category, rating, lat, lon = parts
        if city not in CITY:
            skipped[city] = skipped.get(city, 0) + 1
            continue
        if category not in CATEGORY:
            sys.exit(f'Неизвестная категория «{category}» у точки «{name}».')
        points.append((CITY[city], name, CATEGORY[category][0], int(rating), float(lat), float(lon)))

    points.sort(key=lambda p: ORDER.index(p[0]))
    return points, skipped


def render(points):
    cats = sorted({c for c, _ in CATEGORY.values()})
    minutes = {slug: m for slug, m in CATEGORY.values()}

    out = []
    w = out.append
    w('// Точки маршрута по четырём городам.\n')
    w('//\n')
    w('// СГЕНЕРИРОВАНО. Источник — файл заказчика «Точки_POI.xlsx» в корне проекта,\n')
    w('// 79 строк. Генератор — `python3 scripts/import-poi.py`. Руками не правится:\n')
    w('// пришёл новый файл — заменить его и перегенерировать.\n')
    w('//\n')
    w('// Взяты 69 точек из 79: Ферганская долина (10 точек) в маршрут не входит.\n')
    w('// Числа и названия перенесены КАК ЕСТЬ. Координаты, рейтинг и категория\n')
    w('// не додумываются: нет данных — точки нет.\n')
    w('// Названия точек — имена собственные, на всех трёх языках показываются\n')
    w('// по-русски: перевода у заказчика нет. Переведены только категории,\n')
    w('// ключи poi.cat.* в /src/i18n.\n')
    w("import type { CityId } from './pricing'\n\n")

    w('/** Категории точек — ровно те, что есть в файле заказчика. */\n')
    w('export type PoiCategory =\n')
    for c in cats:
        w(f"  | '{c}'\n")

    w('\n/** Время осмотра точки по категории, В МИНУТАХ. Утверждено заказчиком.\n')
    w(' *  Используется планировщиком дней — здесь и только здесь. */\n')
    w('export const VISIT_MINUTES: Record<PoiCategory, number> = {\n')
    for c in cats:
        w(f'  {c}: {minutes[c]},\n')
    w('}\n\n')

    w('export interface Poi {\n')
    w('  /** Устойчивый идентификатор: город и номер по порядку в файле заказчика. */\n')
    w('  id: string\n')
    w('  cityId: CityId\n')
    w('  /** Имя собственное. Показывается как есть на всех трёх языках. */\n')
    w('  name: string\n')
    w('  category: PoiCategory\n')
    w('  /** Рейтинг из файла заказчика: 9 или 10. Задаёт порядок обхода и отбор. */\n')
    w('  rating: number\n')
    w('  lat: number\n')
    w('  lon: number\n')
    w('}\n\n')

    w('/** Все точки маршрута. Порядок — по городам маршрута, внутри города как в файле. */\n')
    w('export const POI: Poi[] = [\n')
    seen = {}
    for cid, name, cat, rating, lat, lon in points:
        seen[cid] = seen.get(cid, 0) + 1
        w(
            f"  {{ id: '{cid}-{seen[cid]}', cityId: '{cid}', name: '{name}', "
            f"category: '{cat}', rating: {rating}, lat: {lat}, lon: {lon} }},\n"
        )
    w(']\n\n')

    w('const BY_CITY = new Map<CityId, Poi[]>()\n')
    w('for (const p of POI) {\n')
    w('  const list = BY_CITY.get(p.cityId)\n')
    w('  if (list) list.push(p)\n')
    w('  else BY_CITY.set(p.cityId, [p])\n')
    w('}\n\n')
    w('/** Точки города в порядке файла заказчика. Порядок обхода и отбор\n')
    w(' *  считает планировщик в /src/composables/itinerary.ts. */\n')
    w('export function poiByCity(id: CityId): Poi[] {\n')
    w('  return BY_CITY.get(id) ?? []\n')
    w('}\n')
    return ''.join(out)


def main():
    points, skipped = parse(read_rows(SOURCE))
    with open(TARGET, 'w', encoding='utf-8') as f:
        f.write(render(points))

    print(f'{TARGET}: точек записано {len(points)}')
    for c in ORDER:
        print(f'  {c}: {sum(1 for p in points if p[0] == c)}')
    for city, n in skipped.items():
        print(f'  пропущено (не в маршруте): {city} — {n}')


if __name__ == '__main__':
    main()

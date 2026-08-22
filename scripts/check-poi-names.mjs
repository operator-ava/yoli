// Контроль переводов названий точек: все ли переведены, нет ли кириллицы
// в английском и китайском, что требует проверки заказчиком.
// Запуск: node scripts/check-poi-names.mjs
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { POI } = await server.ssrLoadModule('/src/data/poi.ts')
const { POI_NAMES } = await server.ssrLoadModule('/src/data/poi-names.ts')

const CYRILLIC = /[а-яёА-ЯЁ]/
const NAME = { tashkent: 'Ташкент', samarkand: 'Самарканд', bukhara: 'Бухара', khiva: 'Хива' }

let ok = true

const missing = POI.filter((p) => !POI_NAMES[p.id])
if (missing.length) {
  ok = false
  console.log(`БЕЗ ПЕРЕВОДА: ${missing.length}`)
  for (const p of missing) console.log(`  ${p.id} · ${p.name}`)
} else {
  console.log(`Переведены все ${POI.length} точек.`)
}

// Кириллица в английском или китайском — это непереведённое название.
for (const p of POI) {
  const tr = POI_NAMES[p.id]
  if (!tr) continue
  if (CYRILLIC.test(tr.en)) {
    ok = false
    console.log(`КИРИЛЛИЦА В АНГЛИЙСКОМ: ${p.id} · ${tr.en}`)
  }
  if (CYRILLIC.test(tr.zh)) {
    ok = false
    console.log(`КИРИЛЛИЦА В КИТАЙСКОМ: ${p.id} · ${tr.zh}`)
  }
  if (!tr.en.trim() || !tr.zh.trim()) {
    ok = false
    console.log(`ПУСТОЙ ПЕРЕВОД: ${p.id}`)
  }
}

// Лишние записи — точка удалена из файла заказчика, перевод остался.
const ids = new Set(POI.map((p) => p.id))
const extra = Object.keys(POI_NAMES).filter((id) => !ids.has(id))
if (extra.length) {
  ok = false
  console.log(`ПЕРЕВОД БЕЗ ТОЧКИ: ${extra.join(', ')}`)
}

// Длина строк: китайские и английские названия короче или длиннее русских,
// и вёрстка блока «Маршрут» на 375 px должна выдержать самое длинное.
const longest = { ru: '', en: '', zh: '' }
for (const p of POI) {
  const tr = POI_NAMES[p.id]
  if (p.name.length > longest.ru.length) longest.ru = p.name
  if (tr && tr.en.length > longest.en.length) longest.en = tr.en
  if (tr && tr.zh.length > longest.zh.length) longest.zh = tr.zh
}
console.log('\nСАМОЕ ДЛИННОЕ НАЗВАНИЕ')
console.log(`  ru  ${longest.ru.length} знаков · ${longest.ru}`)
console.log(`  en  ${longest.en.length} знаков · ${longest.en}`)
console.log(`  zh  ${longest.zh.length} знаков · ${longest.zh}`)

const check = POI.filter((p) => POI_NAMES[p.id]?.check)
console.log(`\nТРЕБУЮТ ПРОВЕРКИ ЗАКАЗЧИКОМ: ${check.length}`)
console.table(
  check.map((p) => ({
    город: NAME[p.cityId],
    'по-русски': p.name,
    english: POI_NAMES[p.id].en,
    中文: POI_NAMES[p.id].zh,
  })),
)

console.log(ok ? 'Переводы на месте, кириллицы в en и zh нет.' : 'ЕСТЬ ПРОБЛЕМЫ — смотри выше.')
await server.close()
process.exit(ok ? 0 : 1)

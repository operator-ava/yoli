// Контроль счётной модели: цена города по дням и уровням.
// Всё берётся из pricing.ts и calc.ts, здесь ничего не дублируется.
// Запуск: node scripts/check-prices.mjs
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { cityPrice, cityCost } = await server.ssrLoadModule('/src/composables/calc.ts')
const { MARGIN_RATE } = await server.ssrLoadModule('/src/data/pricing.ts')

/** Цена до округления — для сверки с контрольными числами заказчика. */
const raw = (l, d, k) => cityCost(l, d, k).total / (1 - MARGIN_RATE)

const LEVELS = ['econom', 'medium', 'lux']

console.log(`Маржа ${Math.round(MARGIN_RATE * 100)}%. Цены на человека, в долларах.\n`)

console.log('ПЕРВЫЙ ГОРОД (трансфер из аэропорта)')
console.table(
  Array.from({ length: 7 }, (_, i) => {
    const d = i + 1
    const row = { дней: d }
    for (const l of LEVELS) row[l] = cityPrice(l, d, 'airport')
    return row
  }),
)

console.log('ВТОРОЙ И ДАЛЕЕ (переезд между городами)')
console.table(
  Array.from({ length: 7 }, (_, i) => {
    const d = i + 1
    const row = { дней: d }
    for (const l of LEVELS) row[l] = cityPrice(l, d, 'intercity')
    return row
  }),
)

const CONTROL = { econom: 625, medium: 900, lux: 1510 }
let ok = true
console.log('Контроль: 3 дня, первый город')
for (const l of LEVELS) {
  const got = cityPrice(l, 3, 'airport')
  const cost = cityCost(l, 3, 'airport').total
  const before = raw(l, 3, 'airport')
  const pass = before === CONTROL[l]
  if (!pass) ok = false
  console.log(
    `  ${l.padEnd(7)} себестоимость $${cost} → до округления $${before} | ожидание $${CONTROL[l]} ${pass ? '✓' : '✗'} → на карточке $${got}`,
  )
}
console.log(ok ? '\nФормула сходится с контролем.' : '\nФОРМУЛА НЕ СХОДИТСЯ.')

await server.close()
process.exit(ok ? 0 : 1)

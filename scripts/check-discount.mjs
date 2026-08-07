// Таблица скидки по числу людей: от MIN_PEOPLE до MAX_PEOPLE.
// Ступени берутся из pricing.ts, здесь ничего не дублируется.
// Запуск: node scripts/check-discount.mjs
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { discountRate, nextDiscountStep } = await server.ssrLoadModule('/src/composables/calc.ts')
const { MIN_PEOPLE, MAX_PEOPLE } = await server.ssrLoadModule('/src/data/pricing.ts')

const rows = []
for (let n = MIN_PEOPLE; n <= MAX_PEOPLE; n++) {
  const next = nextDiscountStep(n)
  rows.push({
    людей: n,
    скидка: Math.round(discountRate(n) * 100) + '%',
    'до следующей': next ? `+${next.add} → ${Math.round(next.rate * 100)}%` : '—',
  })
}
console.table(rows)

await server.close()
process.exit(0)

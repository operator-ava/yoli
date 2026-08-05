// Проверочный расчёт: 1 человек, только Ташкент, 3 ночи.
// Ожидание — опорные пакеты заказчика 1900 / 2500 / 5200 на человека.
// Формула и цены берутся прямо из исходников, здесь ничего не дублируется.
// Запуск: node scripts/check-calc.mjs
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { calculate } = await server.ssrLoadModule('/src/composables/calc.ts')

const LEVELS = [
  ['econom', 1900],
  ['medium', 2500],
  ['lux', 5200],
]

console.log('Проверка: 1 человек, только Ташкент, 3 ночи\n')
let ok = true
for (const [level, expected] of LEVELS) {
  const r = calculate({
    people: 1,
    singleRooms: false,
    stops: [{ cityId: 'tashkent', nights: 3, level }],
  })
  const diff = ((r.perPerson - expected) / expected) * 100
  const pass = Math.abs(diff) <= 1
  if (!pass) ok = false
  console.log(
    `${level.padEnd(7)} на человека $${r.perPerson.toFixed(2).padStart(8)}` +
      ` (подытог $${r.subtotal.toFixed(2)}, сбор $${r.serviceFee.toFixed(2)})` +
      ` | опора $${expected} | отклонение ${diff >= 0 ? '+' : ''}${diff.toFixed(2)}% ${pass ? '✓' : '✗'}`,
  )
}
console.log(ok ? '\nСходится.' : '\nНЕ СХОДИТСЯ.')
await server.close()
process.exit(ok ? 0 : 1)

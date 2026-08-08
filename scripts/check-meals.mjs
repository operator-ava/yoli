// Раскладка кухонь по приёмам пищи. Правило — в src/data/meals.ts.
// Запуск: node scripts/check-meals.mjs
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { cuisineForMeal, MEAL_FORMAT, MEAL_LABEL_KEY, CUISINE_CYCLE } =
  await server.ssrLoadModule('/src/data/meals.ts')

const NAMES = { uzbek: 'Узбекская', chinese: 'Китайская', russian: 'Русская', japanese: 'Японская' }
const LABEL = { breakfast: 'Завтрак', lunch: 'Обед', dinner: 'Ужин' }

console.log('Завтрак всегда узбекский. Цикл обедов и ужинов из', CUISINE_CYCLE.length, 'позиций:')
console.log(' ', CUISINE_CYCLE.map((c) => NAMES[c]).join(', '), '\n')

for (const level of ['medium', 'econom']) {
  const meals = MEAL_FORMAT[level].meals
  console.log(`=== ${level}: ${meals.length} приёма в день, 7 дней ===`)
  const tally = {}
  const rows = []
  for (let d = 0; d < 7; d++) {
    const row = { день: d + 1 }
    meals.forEach((m, i) => {
      const c = cuisineForMeal(m, d, i, meals.length)
      row[LABEL[m]] = NAMES[c.id]
      tally[c.id] = (tally[c.id] ?? 0) + 1
    })
    rows.push(row)
  }
  console.table(rows)
  const total = Object.values(tally).reduce((a, b) => a + b, 0)
  console.log(
    'Итого:',
    Object.entries(tally)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${NAMES[k]} ${v} (${Math.round((v / total) * 100)}%)`)
      .join(' · '),
    '\n',
  )
}

// Детерминированность: два прогона подряд дают одно и то же
const MEALS = ['breakfast', 'lunch', 'dinner']
const seq = () =>
  Array.from({ length: 21 }, (_, i) =>
    cuisineForMeal(MEALS[i % 3], Math.floor(i / 3), i % 3, 3).id,
  ).join()
const a = seq()
const b = seq()
console.log(a === b ? 'Раскладка детерминированная ✓' : 'РАСКЛАДКА ПЛАВАЕТ ✗')

await server.close()
process.exit(0)

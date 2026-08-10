// Контроль счётной модели: цена города по ночам и уровням плюс базовый маршрут.
// Всё берётся из pricing.ts и calc.ts, здесь ничего не дублируется.
// Запуск: node scripts/check-prices.mjs
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { cityPrice, cityCost, calculate, discountRate } =
  await server.ssrLoadModule('/src/composables/calc.ts')
const { MARKUP_RATE } = await server.ssrLoadModule('/src/data/pricing.ts')

/** Цена до округления — для сверки с контрольными числами заказчика. */
const raw = (l, d, k) => cityCost(l, d, k).total * (1 + MARKUP_RATE)

const LEVELS = ['econom', 'medium', 'lux']
const NAME = { econom: 'Budget', medium: 'Comfort', lux: 'Premium' }

console.log(`Наценка ${Math.round(MARKUP_RATE * 100)}% на базу. Цены на человека, в долларах.\n`)

console.log('ПЕРВЫЙ ГОРОД (трансфер из аэропорта)')
console.table(
  Array.from({ length: 7 }, (_, i) => {
    const d = i + 1
    const row = { ночей: d }
    for (const l of LEVELS) row[NAME[l]] = cityPrice(l, d, 'airport')
    return row
  }),
)

console.log('ВТОРОЙ И ДАЛЕЕ (переезд между городами)')
console.table(
  Array.from({ length: 7 }, (_, i) => {
    const d = i + 1
    const row = { ночей: d }
    for (const l of LEVELS) row[NAME[l]] = cityPrice(l, d, 'intercity')
    return row
  }),
)

let ok = true
let modelOk = true

// ── Контроль 1: один город, один человек ────────────────────────────────────
const CITY_CONTROL = {
  1: { econom: 160, medium: 240, lux: 400 },
  3: { econom: 410, medium: 620, lux: 1000 },
  7: { econom: 910, medium: 1390, lux: 2190 },
}

console.log('КОНТРОЛЬ 1 — первый город, трансфер из аэропорта, один человек')
for (const nights of Object.keys(CITY_CONTROL)) {
  for (const l of LEVELS) {
    const got = cityPrice(l, Number(nights), 'airport')
    const want = CITY_CONTROL[nights][l]
    const pass = got === want
    if (!pass) ok = false
    console.log(
      `  ${nights} ноч. ${NAME[l].padEnd(8)} база $${cityCost(l, Number(nights), 'airport').total.toFixed(2)} → до округления $${raw(l, Number(nights), 'airport').toFixed(2)} | получено $${got} | ожидание $${want} ${pass ? '✓' : '✗'}`,
    )
  }
}

// ── Контроль 2: базовый маршрут модели ──────────────────────────────────────
// Семь ночей, четыре города, один трансфер из аэропорта и три переезда.
// Разбивка ночей 1+2+2+2: приложение округляет цену КАЖДОГО города отдельно,
// поэтому разбивка влияет на итог.
const ROUTE_NIGHTS = [1, 2, 2, 2]
const ROUTE_CONTROL = {
  1: { econom: 1030, medium: 1510, lux: 2490 },
  2: { econom: 640, medium: 940, lux: 1550 },
  4: { econom: 580, medium: 850, lux: 1400 },
  12: { econom: 490, medium: 710, lux: 1170 },
}

/** Цена на человека по базовому маршруту, как её показывает панель:
 *  цена КАЖДОГО города округляется до $10 отдельно, затем скидка,
 *  затем шаг валюты $10. Округлений получается несколько. */
function routeApp(level, people) {
  const stops = ROUTE_NIGHTS.map((nights, i) => ({
    cityId: 'tashkent',
    nights,
    level,
    transfer: i === 0 ? 'airport' : 'intercity',
  }))
  const r = calculate({ people, stops })
  return Math.ceil(r.perPerson / 10) * 10
}

/** Та же цена, но с ОДНИМ округлением в самом конце — как считает модель
 *  заказчика: база всего маршрута × наценка × (1 − скидка), потом до $10. */
function routeModel(level, people) {
  const base = ROUTE_NIGHTS.reduce(
    (sum, nights, i) => sum + cityCost(level, nights, i === 0 ? 'airport' : 'intercity').total,
    0,
  )
  const perPerson = base * (1 + MARKUP_RATE) * (1 - discountRate(people))
  return Math.ceil(perPerson / 10) * 10
}

console.log('\nКОНТРОЛЬ 2 — базовый маршрут: 7 ночей, 4 города (1+2+2+2), цена на человека')
console.log('  «прил.» — как считает приложение: округление цены каждого города')
console.log('  «мод.»  — как считает модель заказчика: одно округление в конце\n')
const routeRows = []
for (const people of Object.keys(ROUTE_CONTROL)) {
  const row = { человек: Number(people) }
  for (const l of LEVELS) {
    const app = routeApp(l, Number(people))
    const model = routeModel(l, Number(people))
    const want = ROUTE_CONTROL[people][l]
    if (model !== want) modelOk = false
    if (app !== want) ok = false
    row[NAME[l]] = `прил. ${app}${app === want ? ' ✓' : ' ≠'} | мод. ${model}${model === want ? ' ✓' : ' ≠'} | ждём ${want}`
  }
  routeRows.push(row)
}
console.table(routeRows)

if (!ok && modelOk) {
  console.log(
    '\nМодель заказчика воспроизводится ТОЧНО во всех клетках.',
    '\nРасхождение даёт только поцелочное округление в приложении:',
    '\nцена каждого города округляется вверх до $10, чтобы на карточке',
    '\nстояло круглое число. На маршруте из четырёх городов это набегает',
    '\nдо $30. Приложение НИКОГДА не занижает цену — только округляет вверх.',
  )
}

console.log(ok ? '\nФормула сходится с контролем.' : '\nЕСТЬ РАСХОЖДЕНИЯ — смотри отметки ≠.')

await server.close()
process.exit(ok ? 0 : 1)

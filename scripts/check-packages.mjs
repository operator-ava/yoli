// Контроль пакетных туров: цена трёх пакетов против контрольной таблицы
// заказчика. Всё берётся из pricing.ts и calc.ts, здесь ничего не дублируется.
// Запуск: node scripts/check-packages.mjs
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { packagePrice, packageCost, calculatePackage, packageStops } =
  await server.ssrLoadModule('/src/composables/calc.ts')
const { PACKAGES, MARKUP_RATE, FLIGHT_COST } = await server.ssrLoadModule('/src/data/pricing.ts')

const LEVELS = ['econom', 'medium', 'lux']
const NAME = { econom: 'Эконом', medium: 'Средний', lux: 'Люкс' }

// Контрольные значения заказчика: цена на человека, в долларах.
// Эконом пересчитан 22.08.2026:статья food 15 → 22, третий приём пищи.
// Средний и люкс не менялись — у них ужин был всегда.
const EXPECT = {
  7: { 1: [1160, 1580, 2570], 2: [720, 980, 1590], 12: [550, 740, 1210] },
  10: { 1: [1560, 2150, 3460], 2: [970, 1330, 2150], 12: [730, 1010, 1630] },
  15: { 1: [2220, 3100, 4960], 2: [1380, 1920, 3080], 12: [1050, 1460, 2330] },
}

console.log(
  `Наценка ${Math.round(MARKUP_RATE * 100)}% на базу, перелёт Ургенч–Ташкент $${FLIGHT_COST}.`,
)
console.log('Порядок: наценка → скидка → округление вверх до $10, ОДНО на весь тур.\n')

console.log('СОСТАВ ПАКЕТОВ')
console.table(
  PACKAGES.map((p) => {
    const row = { ночей: p.nights }
    for (const s of packageStops(p.nights)) row[s.cityId] = s.nights
    row['сумма'] = packageStops(p.nights).reduce((a, s) => a + s.nights, 0)
    return row
  }),
)

let ok = true

console.log('КОНТРОЛЬНАЯ ТАБЛИЦА — цена на человека, доллары')
console.table(
  Object.keys(EXPECT).flatMap((n) =>
    Object.keys(EXPECT[n]).map((p) => {
      const row = { ночей: Number(n), человек: Number(p) }
      LEVELS.forEach((l, i) => {
        const got = packagePrice(l, Number(n), Number(p))
        const exp = EXPECT[n][p][i]
        if (got !== exp) ok = false
        row[NAME[l]] = got === exp ? `${got} ✓` : `${got} ≠ ждём ${exp}`
      })
      return row
    }),
  ),
)

// Сходимости: сумма за группу = цена на человека × людей;
// статьи − скидка = сумма за группу.
let convOk = true
for (const n of [7, 10, 15]) {
  for (const l of LEVELS) {
    for (const p of [1, 2, 3, 7, 12, 20]) {
      const r = calculatePackage({ people: p, level: l, nights: n })
      const sumArticles = Object.values(r.articles).reduce((a, b) => a + b, 0)
      if (r.total !== r.perPerson * p) {
        convOk = false
        console.log(`СХОДИМОСТЬ 1 сломана: ${n} ноч, ${l}, ${p} чел`)
      }
      if (Math.abs(sumArticles - r.discount - r.total) > 1e-6) {
        convOk = false
        console.log(
          `СХОДИМОСТЬ 2 сломана: ${n} ноч, ${l}, ${p} чел — ` +
            `статьи ${sumArticles.toFixed(2)} − скидка ${r.discount.toFixed(2)} ≠ ${r.total}`,
        )
      }
    }
  }
}

// Себестоимость пакета: сумма статей равна заявленному итогу.
for (const n of [7, 10, 15]) {
  for (const l of LEVELS) {
    const c = packageCost(l, n)
    const sum = Object.values(c.byArticle).reduce((a, b) => a + b, 0)
    if (Math.abs(sum - c.total) > 1e-9) {
      convOk = false
      console.log(`СЕБЕСТОИМОСТЬ не сходится: ${n} ноч, ${l}`)
    }
  }
}

console.log(
  convOk ? 'Сходимости держатся на 1, 2, 3, 7, 12 и 20 людях.' : 'СХОДИМОСТИ СЛОМАНЫ.',
)
console.log(ok ? 'Контрольная таблица сходится во всех 27 клетках.' : 'ЕСТЬ РАСХОЖДЕНИЯ — смотри ≠.')

await server.close()
process.exit(ok && convOk ? 0 : 1)

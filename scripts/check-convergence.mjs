// Контроль сходимостей на экране: числа берутся ровно те, что видит человек —
// через steppedUnits и allocate, в каждой из трёх валют.
//
//   сумма за группу = цена на человека × количество людей
//   статьи − скидка = сумма за группу
//
// Запуск: node scripts/check-convergence.mjs
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { calculatePackage } = await server.ssrLoadModule('/src/composables/calc.ts')
const { steppedUnits, allocate } = await server.ssrLoadModule('/src/composables/format.ts')
const { locale } = await server.ssrLoadModule('/src/composables/useI18n.ts')

// Те же четыре группы статей, что показывает панель.
const GROUPS = [['stay'], ['food'], ['transfer', 'flight'], ['guide', 'dedBobo', 'tickets', 'insurance', 'sim', 'audio']]

const LOCALES = [['ru', 'рубли'], ['en', 'доллары'], ['zh', 'юани']]
const PEOPLE = [1, 2, 3, 5, 7, 12, 20]
const LEVELS = ['econom', 'medium', 'lux']

let ok = true
let checks = 0

for (const [loc, money] of LOCALES) {
  locale.value = loc
  for (const nights of [7, 10, 15]) {
    for (const level of LEVELS) {
      for (const people of PEOPLE) {
        const r = calculatePackage({ people, level, nights })
        const perPersonUnits = steppedUnits(r.perPerson)
        const totalUnits = perPersonUnits * people
        const discountUnits = steppedUnits(r.discount)
        const base = totalUnits + discountUnits
        const units = allocate(base, GROUPS.map((g) => g.reduce((s, a) => s + r.articles[a], 0)))
        const sum = units.reduce((a, b) => a + b, 0)
        checks++

        if (totalUnits !== perPersonUnits * people) {
          ok = false
          console.log(`1) ${money}, ${nights} ноч, ${level}, ${people} чел`)
        }
        if (sum - discountUnits !== totalUnits) {
          ok = false
          console.log(
            `2) ${money}, ${nights} ноч, ${level}, ${people} чел: ` +
              `${sum} − ${discountUnits} = ${sum - discountUnits}, ждём ${totalUnits}`,
          )
        }
      }
    }
  }
}

console.log(`Проверено сочетаний: ${checks} (3 валюты × 3 пакета × 3 тарифа × 7 размеров группы)`)
console.log(ok ? 'Обе сходимости держатся точно.' : 'СХОДИМОСТИ СЛОМАНЫ.')
await server.close()
process.exit(ok ? 0 : 1)

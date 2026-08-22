// Контроль раскладки точек по дням: нормы дня соблюдены, дублей нет,
// расчёт детерминированный. Плюс таблица отбора: сколько точек входит
// в каждый пакет по каждому городу.
// Запуск: node scripts/check-itinerary.mjs
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { planTour, travelMinutes, visitMinutes } =
  await server.ssrLoadModule('/src/composables/itinerary.ts')
const { poiByCity, POI } = await server.ssrLoadModule('/src/data/poi.ts')
const { CALENDAR_START_DATE, DEFAULT_CITY_ORDER } = await server.ssrLoadModule('/src/data/pricing.ts')

const NAME = { tashkent: 'Ташкент', samarkand: 'Самарканд', bukhara: 'Бухара', khiva: 'Хива' }
const hhmm = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`

console.log(`Точек всего: ${POI.length}`)
for (const c of DEFAULT_CITY_ORDER) console.log(`  ${NAME[c]}: ${poiByCity(c).length}`)
console.log(`Норма дня: 8:00, первый день тура и день вылета: 4:00\n`)

let ok = true
const empty = []

// ── Отбор: сколько точек входит в пакет ─────────────────────────────────────
console.log('ЧТО ВХОДИТ В ПАКЕТ — точек из всего в городе')
console.table(
  [7, 10, 15].map((nights) => {
    const tour = planTour(nights, CALENDAR_START_DATE)
    const row = { ночей: nights }
    let sel = 0
    let tot = 0
    for (const c of tour) {
      row[NAME[c.cityId]] = `${c.selected} из ${c.total}`
      sel += c.selected
      tot += c.total
    }
    row['всего'] = `${sel} из ${tot}`
    return row
  }),
)

// ── Дни: нормы, пустые дни, дубли ───────────────────────────────────────────
for (const nights of [7, 10, 15]) {
  console.log(`══ ПАКЕТ ${nights} НОЧЕЙ ══`)
  const tour = planTour(nights, CALENDAR_START_DATE)
  const rows = []
  const seen = new Set()

  for (const city of tour) {
    for (const d of city.days) {
      if (d.minutes > d.limit) {
        ok = false
        console.log(
          `  ПЕРЕБОР НОРМЫ: ${NAME[city.cityId]}, день ${d.index} — ` +
            `${hhmm(d.minutes)} при норме ${hhmm(d.limit)}`,
        )
      }
      if (!d.points.length && !d.departure) {
        // День без точек и не день вылета — это ОШИБКА раскладки: человек
        // платит за день и должен видеть, что в нём происходит.
        ok = false
        empty.push(`${NAME[city.cityId]}, день ${d.index} (${d.date})`)
      }
      for (const p of d.points) {
        if (seen.has(p.id)) {
          ok = false
          console.log(`  ДУБЛЬ ТОЧКИ: ${p.id}`)
        }
        seen.add(p.id)
      }
      rows.push({
        город: NAME[city.cityId],
        день: d.index,
        дата: d.date,
        точек: d.points.length,
        время: hhmm(d.minutes),
        норма: hhmm(d.limit),
        запас: hhmm(d.limit - d.minutes),
        особый: d.arrival ? 'прилёт' : d.departure ? 'вылет' : '',
      })
    }
  }
  console.table(rows)
  console.log(`  ${tour[0].from} → ${tour[tour.length - 1].to}, ночей ${nights}\n`)
}

// ── Детерминированность ─────────────────────────────────────────────────────
if (JSON.stringify(planTour(10, CALENDAR_START_DATE)) !== JSON.stringify(planTour(10, CALENDAR_START_DATE))) {
  ok = false
  console.log('РАСЧЁТ НЕ ДЕТЕРМИНИРОВАН: два прогона разошлись.')
}

// ── Переезды и время осмотра ────────────────────────────────────────────────
for (const c of DEFAULT_CITY_ORDER) {
  const pts = poiByCity(c)
  for (let i = 1; i < pts.length; i++) {
    if (travelMinutes(pts[i - 1], pts[i]) < 10) {
      ok = false
      console.log('ПЕРЕЕЗД КОРОЧЕ 10 МИНУТ')
    }
  }
  for (const p of pts) {
    if (!(visitMinutes(p) > 0)) {
      ok = false
      console.log('НЕТ ВРЕМЕНИ ОСМОТРА:', p.id)
    }
  }
}

if (empty.length) {
  console.log(`ДНЕЙ БЕЗ ТОЧЕК, КРОМЕ ДНЯ ВЫЛЕТА: ${empty.length}`)
  for (const e of empty) console.log(`  ${e}`)
  console.log('')
} else {
  console.log('Пустых дней нет: точки разложены на все дни каждого города.')
  console.log('День вылета из Хивы точек не содержит по правилу — в нём')
  console.log('свободное время, трансфер в аэропорт и перелёт.\n')
}

console.log(ok ? 'Раскладка сходится: нормы дня соблюдены, дублей нет.' : 'ЕСТЬ ПРОБЛЕМЫ — смотри выше.')
await server.close()
process.exit(ok ? 0 : 1)

// Сверка словарей: ключи ru.ts, en.ts и zh.ts должны совпадать.
// Запуск: node scripts/check-i18n.mjs
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { ru } = await server.ssrLoadModule('/src/i18n/ru.ts')
const { en } = await server.ssrLoadModule('/src/i18n/en.ts')
const { zh } = await server.ssrLoadModule('/src/i18n/zh.ts')

const base = Object.keys(ru)
let bad = 0

console.log(`ключей: ru ${base.length}, en ${Object.keys(en).length}, zh ${Object.keys(zh).length}`)

for (const [name, dict] of [
  ['en', en],
  ['zh', zh],
]) {
  const keys = Object.keys(dict)
  const missing = base.filter((k) => !keys.includes(k))
  const extra = keys.filter((k) => !base.includes(k))
  if (missing.length || extra.length) bad++
  console.log(`нет в ${name}:`, missing.length ? missing.join(', ') : '—')
  console.log(`лишние в ${name}:`, extra.length ? extra.join(', ') : '—')
}

await server.close()
process.exit(bad ? 1 : 0)

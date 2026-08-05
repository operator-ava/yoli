// Сверка словарей: ключи ru.ts и en.ts должны совпадать.
// Запуск: node scripts/check-i18n.mjs
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { ru } = await server.ssrLoadModule('/src/i18n/ru.ts')
const { en } = await server.ssrLoadModule('/src/i18n/en.ts')

const a = Object.keys(ru)
const b = Object.keys(en)
const missing = a.filter((k) => !b.includes(k))
const extra = b.filter((k) => !a.includes(k))

console.log(`ключей: ru ${a.length}, en ${b.length}`)
console.log('нет в en:', missing.length ? missing.join(', ') : '—')
console.log('лишние в en:', extra.length ? extra.join(', ') : '—')

await server.close()
process.exit(missing.length || extra.length ? 1 : 0)

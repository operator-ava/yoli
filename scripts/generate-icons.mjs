// Генератор иконок PWA из фирменного знака YOLI.
// Источник — public/brand/mark.webp (знак «Y», подготовлен prepare-assets.mjs).
// Запуск: node scripts/generate-icons.mjs
import sharp from 'sharp'
import path from 'node:path'

const YELLOW = '#FFE52A' // фирменный жёлтый, точный замер по логотипу
const OUT = path.resolve(import.meta.dirname, '../public')
const MARK = path.join(OUT, 'brand/mark.webp')

// Вырезаем из знака только чёрную букву «Y», без жёлтого круга:
// круг в исходнике залит ровно этим же жёлтым, но буква должна лечь на чистый фон.
async function glyph() {
  const { data, info } = await sharp(MARK).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const out = Buffer.alloc(info.width * info.height * 4, 0)
  for (let i = 0; i < info.width * info.height; i++) {
    const p = i * info.channels
    const lum = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]
    // Тёмный непрозрачный пиксель — часть буквы.
    if (lum < 128 && data[p + 3] > 128) {
      out[i * 4] = 0x1a
      out[i * 4 + 1] = 0x1a
      out[i * 4 + 2] = 0x1a
      out[i * 4 + 3] = 255
    }
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim()
    .png()
    .toBuffer()
}

const GLYPH = await glyph()

// Знак на фирменном жёлтом фоне. share — доля стороны иконки под знак.
async function icon(size, share, file, { alpha = true } = {}) {
  const inner = Math.round(size * share)
  const mark = await sharp(GLYPH)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()

  let img = sharp({
    create: { width: size, height: size, channels: 4, background: YELLOW },
  }).composite([{ input: mark, gravity: 'centre' }])

  // Для apple-touch-icon альфа-канал недопустим: iOS подставляет чёрный фон.
  if (!alpha) img = img.flatten({ background: YELLOW }).removeAlpha()

  await img.png().toFile(path.join(OUT, file))
}

await icon(192, 0.78, 'pwa-192x192.png')
await icon(512, 0.78, 'pwa-512x512.png')
// Maskable: знак ужат, чтобы пережить обрезку под любую системную маску.
await icon(512, 0.55, 'pwa-maskable-512x512.png')
await icon(180, 0.72, 'apple-touch-icon.png', { alpha: false })
// Фавикон
await icon(64, 0.78, 'favicon.png')

console.log('иконки собраны из фирменного знака')

// Генератор иконок-заглушек для PWA.
// Рисуем SVG в памяти и растеризуем через sharp.
// Запуск: node scripts/generate-icons.mjs
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const BG = '#14171C' // тёмный фон (совпадает с background_color манифеста)
const FG = '#F2B441' // акцент — булавка маршрута

// Метка-булавка по центру холста 512×512.
// scale — доля холста, которую занимает глиф (для maskable делаем меньше,
// чтобы содержимое влезло в безопасную зону при обрезке системой).
function svg(scale = 1) {
  const s = scale
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>
  <g transform="translate(256 256) scale(${s}) translate(-256 -256)">
    <path d="M256 96c-56 0-100 44-100 100 0 66 100 204 100 204s100-138 100-204c0-56-44-100-100-100z" fill="${FG}"/>
    <circle cx="256" cy="196" r="38" fill="${BG}"/>
  </g>
</svg>`
}

const out = new URL('../public/', import.meta.url)
await mkdir(out, { recursive: true })
const file = (n) => new URL(n, out).pathname

// Обычные иконки: прозрачность не нужна, фон непрозрачный.
await sharp(Buffer.from(svg(1))).resize(192, 192).png().toFile(file('pwa-192x192.png'))
await sharp(Buffer.from(svg(1))).resize(512, 512).png().toFile(file('pwa-512x512.png'))

// Maskable: глиф ужат до ~60%, чтобы пережить обрезку под любую маску.
await sharp(Buffer.from(svg(0.6))).resize(512, 512).png().toFile(file('pwa-maskable-512x512.png'))

// apple-touch-icon: строго 180×180 PNG БЕЗ альфа-канала —
// iOS не умеет прозрачный фон и подставляет чёрный.
await sharp(Buffer.from(svg(1)))
  .resize(180, 180)
  .flatten({ background: BG })
  .png({ palette: false })
  .removeAlpha()
  .toFile(file('apple-touch-icon.png'))

console.log('иконки сгенерированы')

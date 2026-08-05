// Разовая подготовка медиа для веба.
// Источники лежат ВНЕ репозитория (/Users/alex/Desktop/YOLi), в git не попадают —
// скрипт оставлен, чтобы пересобрать картинки можно было повторно.
// Запуск: node scripts/prepare-assets.mjs
import sharp from 'sharp'
import { mkdir, readdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const SRC = '/Users/alex/Desktop/YOLi'
const OUT = path.resolve(import.meta.dirname, '../public')

const MAX_W = 1600 // максимальная ширина фото для веба
const Q = 78 // качество webp

async function ensure(dir) {
  await mkdir(dir, { recursive: true })
}

// ── Логотипы ────────────────────────────────────────────────────────────────
async function brand() {
  const dir = path.join(OUT, 'brand')
  await ensure(dir)

  // Горизонтальный логотип для шапки — с прозрачностью.
  await sharp(path.join(SRC, 'Logo_full_YOLi.png'))
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(dir, 'logo-full.webp'))

  // Жёлтый вариант — на случай тёмной подложки.
  await sharp(path.join(SRC, 'Logo_full_YOLi желтый.png'))
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(dir, 'logo-full-yellow.webp'))

  // Знак «Y» отдельно — с прозрачностью, для мелких мест.
  await sharp(path.join(SRC, 'y.png')).webp({ quality: 92 }).toFile(path.join(dir, 'mark.webp'))

  // Квадратный знак в круге — источник иконок PWA.
  await sharp(path.join(SRC, 'logo_yoli.png'))
    .resize(1024, 1024, { fit: 'cover' })
    .png()
    .toFile(path.join(dir, 'mark-square.png'))
}

// ── Фото городов ────────────────────────────────────────────────────────────
// Ровно пять городов проекта; Нукус, Термез и Шахрисабз не переносим.
const CITIES = [
  ['Ташкент1.png', 'tashkent'],
  ['Самарканд1.png', 'samarkand'],
  ['Бухара1.png', 'bukhara'],
  ['Фергана1.png', 'fergana'],
  ['Хива1.png', 'khiva'],
]

async function cities() {
  const dir = path.join(OUT, 'photos/cities')
  await ensure(dir)
  for (const [file, slug] of CITIES) {
    await sharp(path.join(SRC, 'Фото города', file))
      .resize({ width: MAX_W, withoutEnlargement: true })
      .webp({ quality: Q })
      .toFile(path.join(dir, `${slug}.webp`))
  }
}

// ── Фотобанк точек ──────────────────────────────────────────────────────────
// Из каждой папки берём один кадр: банк нужен витринам, а не полной галерее.
// Имя папки начинается с номера точки — он и становится идентификатором файла.
async function poi() {
  const src = path.join(SRC, 'Фото_POI/Готовые ')
  const dir = path.join(OUT, 'photos/poi')
  if (existsSync(dir)) await rm(dir, { recursive: true })
  await ensure(dir)

  const folders = (await readdir(src, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)

  const index = []
  for (const folder of folders) {
    const num = folder.trim().match(/^(\d+)/)?.[1]
    if (!num) continue
    const files = (await readdir(path.join(src, folder)))
      .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
      .sort()
    if (!files.length) continue
    const slug = `poi-${num}`
    await sharp(path.join(src, folder, files[0]))
      .resize({ width: MAX_W, withoutEnlargement: true })
      .webp({ quality: Q })
      .toFile(path.join(dir, `${slug}.webp`))
    // Название точки — из имени папки, без выдуманных подробностей.
    index.push({ slug, title: folder.trim().replace(/^\d+\s*/, '').trim() })
  }
  console.log('точек перенесено:', index.length)
  console.log(JSON.stringify(index, null, 2))
}

await brand()
await cities()
await poi()
console.log('медиа готово')

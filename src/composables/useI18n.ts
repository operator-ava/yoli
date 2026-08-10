// Свой i18n на ref, без библиотеки. Языки: русский и английский.
// В шаблонах только ключи. Нет ключа в en — берём русский и пишем предупреждение,
// приложение при этом не падает.
import { computed, ref } from 'vue'
import { ru } from '@/i18n/ru'
import { en } from '@/i18n/en'
import { zh } from '@/i18n/zh'

export type Locale = 'ru' | 'en' | 'zh'

export type Dict = Record<string, string | string[]>

const DICTS: Record<Locale, Dict> = { ru, en, zh }
const STORAGE_KEY = 'yoli.locale'

/** Русский по умолчанию. */
function load(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'ru' || saved === 'en' || saved === 'zh') return saved
  } catch {
    // localStorage недоступен — остаёмся на языке по умолчанию
  }
  return 'ru'
}

export const locale = ref<Locale>(load())

/** Значение атрибута lang в <html> для каждого языка. */
const HTML_LANG: Record<Locale, string> = { ru: 'ru', en: 'en', zh: 'zh-Hans' }

// Уже показанные предупреждения, чтобы не сорить в консоль на каждый кадр.
const warned = new Set<string>()

function lookup(key: string, loc: Locale): string | string[] | undefined {
  const value = DICTS[loc][key]
  if (value !== undefined) return value
  if (loc !== 'ru') {
    if (!warned.has(loc + key)) {
      warned.add(loc + key)
      console.warn(`[i18n] нет ключа «${key}» для языка ${loc}, показан русский`)
    }
    return DICTS.ru[key]
  }
  return undefined
}

/** Подстановка {имя} из vars. */
function fill(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text
  return text.replace(/\{(\w+)\}/g, (whole, name) =>
    vars[name] !== undefined ? String(vars[name]) : whole,
  )
}

/** Строка по ключу. */
export function t(key: string, vars?: Record<string, string | number>): string {
  const value = lookup(key, locale.value)
  if (value === undefined) {
    if (!warned.has('missing' + key)) {
      warned.add('missing' + key)
      console.warn(`[i18n] ключ «${key}» не найден ни в одном словаре`)
    }
    return key
  }
  return fill(Array.isArray(value) ? value[0] : value, vars)
}

/** Форма слова по числу. Русский — три формы, английский — две,
 *  китайский числом не изменяется — форма одна. */
export function plural(n: number, key: string): string {
  const forms = lookup(key, locale.value)
  if (!Array.isArray(forms) || !forms.length) return t(key)
  if (locale.value === 'zh') return forms[0]
  if (locale.value === 'en') return forms[n === 1 ? 0 : 1] ?? forms[0]
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2] ?? forms[1] ?? forms[0]
}

/** «5 ночей» — число вместе с формой слова.
 *  Пробел НЕРАЗРЫВНЫЙ: при переносе строки «10» не должно оставаться на одной
 *  строке, а «ночей» уходить на следующую — это читается как поломка. */
export function count(n: number, key: string): string {
  return `${n}\u00A0${plural(n, key)}`
}

/** Список строк по ключу — месяцы, дни недели. */
export function list(key: string): string[] {
  const value = lookup(key, locale.value)
  return Array.isArray(value) ? value : []
}

export function setLocale(next: Locale) {
  locale.value = next
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // Не смогли сохранить — язык всё равно переключится на эту сессию
  }
  // Атрибут lang меняется вместе с языком
  document.documentElement.lang = HTML_LANG[next]
}

export function useI18n() {
  return { locale: computed(() => locale.value), t, plural, count, list, setLocale }
}

// Стартовое значение атрибута lang
if (typeof document !== 'undefined') document.documentElement.lang = HTML_LANG[locale.value]

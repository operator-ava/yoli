<script setup lang="ts">
import { useI18n, t, type Locale } from '@/composables/useI18n'

// Слева фирменный знак, по центру название экрана, справа переключатель языка.
const { locale, setLocale } = useI18n()
const LANGS: { id: Locale; label: string }[] = [
  { id: 'ru', label: 'RU' },
  { id: 'en', label: 'EN' },
  { id: 'zh', label: '中文' },
]
</script>

<template>
  <header class="app-header">
    <img class="logo" src="/brand/logo-full.webp" alt="YOLI" width="108" height="42" />
    <!-- Название экрана по центру свободной середины: колонка 1fr между
         знаком и переключателем, заголовок центрируется внутри неё -->
    <h1 class="title">{{ t('nav.calc') }}</h1>
    <div class="lang" role="group" aria-label="Язык / Language">
      <button
        v-for="l in LANGS"
        :key="l.id"
        class="lang-btn"
        :class="{ on: locale === l.id }"
        :aria-pressed="locale === l.id"
        @click="setLocale(l.id)"
      >
        {{ l.label }}
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  /* Три колонки: знак — свободная середина — переключатель. Заголовок стоит
     по центру середины, поэтому просветы до знака и до переключателя равны
     на любой ширине. Ось экрана тут не годится: знак слева уже переключателя
     справа, и заголовок по оси прижимался бы к переключателю.
     Боковые колонки не ужимаются меньше содержимого — переключатель языка
     не сжимается; при нехватке места ужимается и обрезается средняя. */
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  background: var(--card);
  border-bottom: 1px solid var(--border);
  /* Вырез iPhone не должен наезжать на логотип */
  padding: 8px calc(16px + var(--safe-right)) 8px calc(16px + var(--safe-left));
  padding-top: calc(8px + var(--safe-top));
  flex-shrink: 0;
  /* Шапка не ниже 56px даже когда safe-area нулевая */
  min-height: 56px;
}

.logo {
  height: 32px;
  width: auto;
  display: block;
  justify-self: start;
}

/* Заголовок экрана. Кегль меньше прежнего h1 в теле страницы: в шапке
   он соседствует со знаком и не должен спорить с ним по весу.
   Длинное название не ломает шапку — обрезается многоточием. */
.title {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

/* Две половинки одной пилюли */
.lang {
  display: flex;
  border: 1px solid var(--border);
  border-radius: 999px;
  overflow: hidden;
  flex-shrink: 0;
  justify-self: end;
}

/* Три кнопки: на узком экране ужимаем горизонтальные отступы, высоту не трогаем */
.lang-btn {
  min-height: 44px;
  min-width: 44px;
  padding: 0 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
}

@media (max-width: 379px) {
  .lang-btn {
    padding: 0 8px;
  }
}

.lang-btn.on {
  background: var(--brand-yellow);
  color: var(--text);
}
</style>

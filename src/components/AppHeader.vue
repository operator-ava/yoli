<script setup lang="ts">
import { useI18n, type Locale } from '@/composables/useI18n'

// Слева фирменный знак, справа переключатель языка.
const { locale, setLocale } = useI18n()
const LANGS: { id: Locale; label: string }[] = [
  { id: 'ru', label: 'RU' },
  { id: 'en', label: 'EN' },
]
</script>

<template>
  <header class="app-header">
    <img class="logo" src="/brand/logo-full.webp" alt="YOLI" width="108" height="42" />
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: var(--card);
  border-bottom: 1px solid var(--border);
  /* Вырез iPhone не должен наезжать на логотип */
  padding: 8px calc(16px + var(--safe-right)) 8px calc(16px + var(--safe-left));
  padding-top: calc(8px + var(--safe-top));
  flex-shrink: 0;
}

.logo {
  height: 32px;
  width: auto;
  display: block;
}

/* Две половинки одной пилюли */
.lang {
  display: flex;
  border: 1px solid var(--border);
  border-radius: 999px;
  overflow: hidden;
  flex-shrink: 0;
}

.lang-btn {
  min-height: 44px;
  min-width: 48px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

.lang-btn.on {
  background: var(--brand-yellow);
  color: var(--text);
}
</style>

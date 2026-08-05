<script setup lang="ts">
import { t } from '@/composables/useI18n'

// Нижний бар навигации: четыре вкладки, главная — «Расчёт».
const tabs = [
  { to: '/', key: 'nav.calc' },
  { to: '/routes', key: 'nav.routes' },
  { to: '/stay', key: 'nav.stay' },
  { to: '/food', key: 'nav.food' },
] as const
</script>

<template>
  <nav class="bottom-nav">
    <RouterLink v-for="tab in tabs" :key="tab.to" :to="tab.to" class="tab tap">
      {{ t(tab.key) }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: flex;
  background: var(--card);
  border-top: 1px solid var(--border);
  /* Полоса жеста «домой» на iPhone не должна перекрывать вкладки */
  padding-bottom: var(--safe-bottom);
  padding-left: var(--safe-left);
  padding-right: var(--safe-right);
  flex-shrink: 0;
}

.tab {
  flex: 1;
  min-height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  padding: 6px 4px;
  border-top: 2px solid transparent;
  margin-top: -1px;
}

/* Активная вкладка — фирменный жёлтый */
.tab.router-link-exact-active {
  color: var(--text);
  font-weight: 600;
  border-top-color: var(--brand-yellow);
}
</style>

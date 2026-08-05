<script setup lang="ts">
// Нижний бар навигации. Подписи здесь — часть каркаса, не контент.
const tabs = [
  { to: '/', label: 'Маршруты', icon: '◎' },
  { to: '/map', label: 'Карта', icon: '⌖' },
  { to: '/guide', label: 'Гид', icon: '➤' },
  { to: '/profile', label: 'Профиль', icon: '☰' },
] as const
</script>

<template>
  <nav class="bottom-nav">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      class="tab tap"
      :aria-label="tab.label"
    >
      <span class="icon" aria-hidden="true">{{ tab.icon }}</span>
      <span class="label">{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: flex;
  background: var(--surface);
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--text-muted);
  font-size: 11px;
  padding: 6px 4px;
}

.icon {
  font-size: 18px;
  line-height: 1;
}

/* Активная вкладка подсвечивается акцентом */
.tab.router-link-exact-active {
  color: var(--accent);
}
</style>

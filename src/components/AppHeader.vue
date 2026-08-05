<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <header class="app-header">
    <img class="logo" src="/brand/logo-full.webp" alt="YOLI" width="108" height="42" />
    <span class="screen">{{ route.meta.title }}</span>
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

.screen {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}
</style>

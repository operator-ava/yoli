<script setup lang="ts">
import type { ShowcaseCard } from '@/data'
import { t } from '@/composables/useI18n'

// Витрина: карточки некликабельные, переходов внутрь нет.
defineProps<{ titleKey: string; noteKey: string; cards: ShowcaseCard[] }>()
</script>

<template>
  <section class="app-content">
    <h1>{{ t(titleKey) }}</h1>
    <p class="note muted">{{ t(noteKey) }}</p>

    <div class="grid">
      <article v-for="c in cards" :key="c.id" class="card item">
        <img class="photo" :src="c.photo" :alt="c.title ?? t(c.titleKey!)" loading="lazy" decoding="async" />
        <div class="body">
          <h3>{{ c.title ?? t(c.titleKey!) }}</h3>
          <p class="muted">{{ t(c.textKey) }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
h1 {
  margin-top: 16px;
}

.note {
  font-size: 14px;
  margin: 0 0 16px;
}

.grid {
  display: grid;
  gap: 12px;
  /* На iPad и десктопе — две колонки, на телефоне одна */
  grid-template-columns: 1fr;
}

@media (min-width: 600px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.item {
  overflow: hidden;
}

.photo {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  background: var(--border);
}

.body {
  padding: 12px 14px 14px;
}

h3 {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 4px;
}

.body p {
  font-size: 14px;
  margin: 0;
}
</style>

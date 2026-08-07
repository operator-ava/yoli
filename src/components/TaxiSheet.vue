<script setup lang="ts">
import { logisticsDetails } from '@/data'
import { t } from '@/composables/useI18n'

// Лист «Такси и перевозки»: общий состав поездки из материалов заказчика.
defineEmits<{ close: [] }>()
</script>

<template>
  <div class="body">
    <header class="head">
      <h2 class="title">{{ t('taxi.title') }}</h2>
      <button class="close" :aria-label="t('sheet.close')" @click="$emit('close')">✕</button>
    </header>

    <div class="scroll">
      <ul class="list">
        <li v-for="d in logisticsDetails()" :key="d">{{ d }}</li>
      </ul>
      <p class="note muted">{{ t('transfer.note') }}</p>
    </div>
  </div>
</template>

<style scoped>
.body { display: flex; flex-direction: column; min-height: 0 }
.head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding-bottom: 10px }
.title { font-size: 18px; font-weight: 700; margin: 0; color: var(--text) }
.close { width: 40px; height: 40px; min-height: 40px; font-size: 18px; color: var(--text-muted); flex-shrink: 0 }
.scroll { overflow-y: auto; overscroll-behavior: contain; flex: 1; min-height: 0 }
.list { margin: 0; padding: 0; list-style: none }
.list li {
  position: relative;
  font-size: 14px;
  line-height: 1.45;
  padding: 7px 0 7px 18px;
  border-bottom: 1px solid var(--border);
}
.list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 15px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-yellow);
}
.note { font-size: 12px; line-height: 1.4; margin: 12px 0 0 }
</style>

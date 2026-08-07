<script setup lang="ts">
import { t } from '@/composables/useI18n'

// Лист «Страховка путешественника». Открывается из блока подарков.
defineEmits<{ close: [] }>()
</script>

<template>
  <div class="body">
    <header class="head">
      <h2 class="title">{{ t('insurance.title') }}</h2>
      <button class="close" :aria-label="t('sheet.close')" @click="$emit('close')">✕</button>
    </header>

    <div class="scroll">
      <p v-for="k in ['insurance.d1', 'insurance.d2', 'insurance.d3', 'insurance.d4']" :key="k" class="line">
        {{ t(k) }}
      </p>
      <p class="note muted">{{ t('insurance.note') }}</p>
    </div>
  </div>
</template>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  text-transform: none;
  letter-spacing: 0;
  color: var(--text);
}

.close {
  width: 40px;
  height: 40px;
  min-height: 40px;
  font-size: 18px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.scroll {
  overflow-y: auto;
  overscroll-behavior: contain;
  flex: 1;
  min-height: 0;
}

.line {
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 10px;
}

.note {
  font-size: 12px;
  line-height: 1.4;
  margin: 14px 0 0;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}
</style>

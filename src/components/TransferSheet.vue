<script setup lang="ts">
import { computed } from 'vue'
import { levelName, type Level, type TransferKind } from '@/data'
import { t } from '@/composables/useI18n'

// Лист трансфера. Вид зависит от позиции города в маршруте:
// первый город — из аэропорта, остальные — переезд из предыдущего.
const props = defineProps<{
  level: Level
  kind: TransferKind
  /** Название предыдущего города, для переезда между городами. */
  previousCity?: string
  selectedLevel: Level | null
}>()

const emit = defineEmits<{ choose: [Level]; close: [] }>()

const title = computed(() =>
  props.kind === 'airport'
    ? t('transfer.airport.row')
    : t('transfer.intercity.row', { city: props.previousCity ?? '' }),
)

const lines = computed(() => [t(`transfer.${props.kind}.d1`), t(`transfer.${props.kind}.d2`)])

const current = computed(() => t(`transfer.${props.kind}.${props.level}`))

</script>

<template>
  <div class="body">
    <header class="head">
      <div>
        <h2 class="title">{{ title }}</h2>
        <p class="sub muted">{{ t('sheet.tariff', { name: levelName(level) }) }}</p>
      </div>
      <button class="close" :aria-label="t('sheet.close')" @click="emit('close')">✕</button>
    </header>

    <div class="scroll">
      <p v-for="l in lines" :key="l" class="line">{{ l }}</p>

      <div class="level-line">{{ current }}</div>

      <p class="note muted">{{ t('transfer.note') }}</p>

    </div>

    <footer v-if="selectedLevel !== level" class="foot">
      <button class="btn primary" @click="emit('choose', level)">{{ t('sheet.choose') }}</button>
    </footer>
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

.sub {
  font-size: 13px;
  margin: 2px 0 0;
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
  -webkit-overflow-scrolling: touch;
  flex: 1;
  min-height: 0;
}

.line {
  font-size: 14px;
  line-height: 1.45;
  margin: 0 0 8px;
}

.level-line {
  background: var(--bg);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  font-size: 15px;
  font-weight: 600;
  margin-top: 6px;
}

.note {
  font-size: 12px;
  line-height: 1.4;
  margin: 12px 0 0;
}

.foot {
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.btn {
  width: 100%;
  min-height: var(--tap-min);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-size: 15px;
  font-weight: 600;
}

.btn.primary {
  background: var(--brand-yellow);
  border-color: var(--brand-yellow);
}
</style>

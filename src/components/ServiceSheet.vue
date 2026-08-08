<script setup lang="ts">
import { computed } from 'vue'
import { itemNote, levelName, serviceParagraphs, type InclusionKey, type Level } from '@/data'
import { t } from '@/composables/useI18n'

// Общий лист для услуг с простым описанием: AI-гид, аудиогид, переводчик, маршруты.
const props = defineProps<{
  itemKey: InclusionKey
  level: Level
  selectedLevel: Level | null
}>()

const emit = defineEmits<{ choose: [Level]; close: [] }>()

const paragraphs = computed(() => serviceParagraphs(props.itemKey))
const limit = computed(() => itemNote(props.itemKey, props.level))

</script>

<template>
  <div class="body">
    <header class="head">
      <div>
        <h2 class="title">{{ t(`service.${itemKey}.title`) }}</h2>
        <p class="sub muted">{{ t('sheet.tariff', { name: levelName(level) }) }}</p>
      </div>
      <button class="close" :aria-label="t('sheet.close')" @click="emit('close')">✕</button>
    </header>

    <div class="scroll">
      <p v-for="p in paragraphs" :key="p" class="line">{{ p }}</p>

      <div v-if="limit" class="level-line">{{ limit }}</div>

      <p class="note muted">{{ t(`service.${itemKey}.note`) }}</p>

      <!-- Сравнение показываем только там, где тарифы реально различаются -->
    </div>

    <footer v-if="selectedLevel !== level" class="foot">
      <button class="btn primary" @click="emit('choose', level)">{{ t('sheet.choose') }}</button>
    </footer>
  </div>
</template>

<style scoped>
.body { display: flex; flex-direction: column; min-height: 0 }
.head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding-bottom: 10px }
.title { font-size: 18px; font-weight: 700; margin: 0; text-transform: none; letter-spacing: 0; color: var(--text) }
.sub { font-size: 13px; margin: 2px 0 0 }
.close { width: 40px; height: 40px; min-height: 40px; font-size: 18px; color: var(--text-muted); flex-shrink: 0 }
.scroll { overflow-y: auto; overscroll-behavior: contain; flex: 1; min-height: 0 }
.line { font-size: 14px; line-height: 1.5; margin: 0 0 8px }
.level-line {
  background: var(--bg);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  font-size: 15px;
  font-weight: 600;
  margin-top: 6px;
}
.note { font-size: 12px; line-height: 1.4; margin: 12px 0 0 }
.foot { padding-top: 12px; border-top: 1px solid var(--border) }
.btn {
  width: 100%;
  min-height: var(--tap-min);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-size: 15px;
  font-weight: 600;
}
.btn.primary { background: var(--brand-yellow); border-color: var(--brand-yellow) }
</style>

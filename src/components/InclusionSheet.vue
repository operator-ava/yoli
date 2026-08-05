<script setup lang="ts">
import { computed } from 'vue'
import {
  cityName,
  inclusion,
  INCLUSION_ITEMS,
  LEVELS,
  levelName,
  type CityId,
  type InclusionKey,
  type Level,
} from '@/data'
import { t } from '@/composables/useI18n'

// Нижний лист по строке состава: подробности выбранного тарифа
// и то же самое для двух остальных, чтобы разница читалась глазами.
const props = defineProps<{
  cityId: CityId
  level: Level
  itemKey: InclusionKey
  /** Тариф, выбранный в городе сейчас. */
  selectedLevel: Level | null
}>()

const emit = defineEmits<{ choose: [Level]; close: [] }>()

const itemLabel = computed(() => {
  const key = INCLUSION_ITEMS.find((i) => i.key === props.itemKey)?.labelKey
  return key ? t(key) : ''
})

const current = computed(() => inclusion(props.cityId, props.level, props.itemKey))

const others = computed(() =>
  LEVELS.filter((l) => l.id !== props.level).map((l) => ({
    name: levelName(l.id),
    data: inclusion(props.cityId, l.id, props.itemKey),
  })),
)
</script>

<template>
  <div class="body">
    <header class="head">
      <div>
        <h2 class="title">{{ itemLabel }} · {{ cityName(cityId) }}</h2>
        <p class="sub muted">{{ t('sheet.tariff', { name: levelName(level) }) }}</p>
      </div>
      <button class="close" :aria-label="t('sheet.close')" @click="emit('close')">✕</button>
    </header>

    <div class="scroll">
      <p class="summary">{{ current.summary }}</p>
      <ul v-if="current.details.length" class="list">
        <li v-for="d in current.details" :key="d">{{ d }}</li>
      </ul>

      <h3>{{ t('sheet.others') }}</h3>
      <div v-for="o in others" :key="o.name" class="other">
        <div class="other-name">{{ o.name }}</div>
        <p v-if="o.data.summary" class="muted other-text">{{ o.data.summary }}</p>
        <p v-else class="muted other-text">{{ t('sheet.pending') }}</p>
      </div>
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
  flex: 1;
  min-height: 0;
}

.summary {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 10px;
}

.list {
  margin: 0;
  padding-left: 18px;
}

.list li {
  font-size: 14px;
  padding: 3px 0;
}

h3 {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin: 20px 0 8px;
}

.other {
  border-top: 1px solid var(--border);
  padding: 10px 0;
}

.other-name {
  font-size: 14px;
  font-weight: 600;
}

.other-text {
  font-size: 14px;
  margin: 2px 0 0;
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

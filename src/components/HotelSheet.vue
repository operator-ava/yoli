<script setup lang="ts">
import { computed } from 'vue'
import { cityName, hotelCategory, LEVELS, type CityId, type Level } from '@/data'
import { t } from '@/composables/useI18n'
import HotelPhoto from '@/components/HotelPhoto.vue'

// Лист «Гостиница»: обещание КАТЕГОРИИ, а не конкретного объекта.
// Названий отелей, адресов и расстояний здесь нет.
const props = defineProps<{
  cityId: CityId
  level: Level
  selectedLevel: Level | null
}>()

const emit = defineEmits<{ choose: [Level]; close: [] }>()

const cat = computed(() => hotelCategory(props.level))

const others = computed(() =>
  LEVELS.filter((l) => l.id !== props.level).map((l) => {
    const c = hotelCategory(l.id)
    return { id: l.id, label: t(c.labelKey), name: t(c.nameKey) }
  }),
)
</script>

<template>
  <div class="body">
    <header class="head">
      <div>
        <h2 class="title">{{ t(cat.labelKey) }}</h2>
        <p class="sub muted">{{ t(cat.nameKey) }} · {{ cityName(cityId) }}</p>
      </div>
      <button class="close" :aria-label="t('sheet.close')" @click="emit('close')">✕</button>
    </header>

    <div class="scroll">
      <HotelPhoto :label="cat.starsLabel" />

      <!-- Категория описана полностью и читается сама по себе -->
      <ul class="benefits">
        <li v-for="key in cat.benefitKeys" :key="key">{{ t(key) }}</li>
      </ul>

      <p class="note muted">{{ t('hotel.note') }}</p>

      <h3>{{ t('sheet.others') }}</h3>
      <div v-for="o in others" :key="o.id" class="other">
        <div class="other-name">{{ o.label }}</div>
        <p class="muted other-text">{{ o.name }}</p>
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

/* Список привилегий длинный — лист прокручивается */
.scroll {
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  flex: 1;
  min-height: 0;
}

.benefits {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.benefits li {
  position: relative;
  font-size: 14px;
  line-height: 1.45;
  padding: 7px 0 7px 18px;
  border-bottom: 1px solid var(--border);
}

.benefits li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 15px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-yellow);
}

.note {
  font-size: 12px;
  line-height: 1.4;
  margin: 12px 0 0;
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

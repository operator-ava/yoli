<script setup lang="ts">
// Выбор ОДНОЙ даты — дня, когда начинается тур. Даты городов считаются
// от неё подряд, поэтому пересечений не бывает и гасить занятые дни,
// как это делал календарь конструктора, больше не нужно.
import { computed, ref } from 'vue'
import { addDays, dayMonth, monthGrid, monthTitle, todayISO } from '@/composables/dates'
import { count, list, t } from '@/composables/useI18n'

const props = defineProps<{
  /** Текущая дата начала, ISO. */
  value: string
  /** Сколько ночей длится тур — показываем в подсказке. */
  nights: number
}>()

const emit = defineEmits<{ apply: [string]; close: [] }>()

const MONTHS_AHEAD = 12

const picked = ref(props.value)
const today = todayISO()

/** День возвращения: выбранная дата плюс все ночи тура. Человеку важно
 *  видеть обе границы сразу — он сверяет их с отпуском. */
const endDate = computed(() => addDays(picked.value, props.nights))

const months = computed(() => {
  const now = new Date()
  return Array.from({ length: MONTHS_AHEAD }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      cells: monthGrid(d.getFullYear(), d.getMonth()),
    }
  })
})

/** Прошедшие дни недоступны: уехать вчера нельзя. */
function isPast(day: string): boolean {
  return day < today
}

function pick(day: string) {
  if (isPast(day)) return
  picked.value = day
}
</script>

<template>
  <div class="sheet-body">
    <header class="head">
      <div>
        <h2 class="title">{{ t('start.title') }}</h2>
        <p class="hint muted">
          {{ t('start.hint', { date: dayMonth(picked), end: dayMonth(endDate) }) }} ·
          {{ count(nights, 'u.night') }}
        </p>
      </div>
      <button class="close" :aria-label="t('sheet.close')" @click="emit('close')">✕</button>
    </header>

    <div class="weekdays">
      <span v-for="w in list('dates.weekdays')" :key="w">{{ w }}</span>
    </div>

    <div class="scroll">
      <section v-for="m in months" :key="`${m.year}-${m.month}`" class="month">
        <h3>{{ monthTitle(m.year, m.month) }}</h3>
        <div class="grid">
          <template v-for="(day, i) in m.cells" :key="i">
            <span v-if="!day" class="cell empty" />
            <button
              v-else
              class="cell day"
              :class="{ edge: day === picked, off: isPast(day) }"
              :disabled="isPast(day)"
              @click="pick(day)"
            >
              <span class="num">{{ Number(day.slice(-2)) }}</span>
            </button>
          </template>
        </div>
      </section>
    </div>

    <footer class="foot">
      <button class="btn primary" @click="emit('apply', picked)">
        {{ t('start.done', { date: dayMonth(picked) }) }}
      </button>
    </footer>
  </div>
</template>

<style scoped>
.sheet-body {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0 12px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  text-transform: none;
  letter-spacing: 0;
  color: var(--text);
}

.hint {
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

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-size: 11px;
  color: var(--text-muted);
  text-align: center;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border);
}

.scroll {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-top: 8px;
}

.month h3 {
  font-size: 14px;
  font-weight: 700;
  margin: 10px 0 6px;
  text-transform: none;
  letter-spacing: 0;
  color: var(--text);
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-size: 15px;
  min-height: 0;
}

.empty {
  visibility: hidden;
}

/* Выбранный день — единственная заливка в сетке: выбирается одна дата */
.edge {
  background: var(--brand-yellow);
  font-weight: 700;
}

.off {
  color: var(--border);
}

.foot {
  padding: 10px 0 calc(8px + var(--safe-bottom));
  display: flex;
  gap: 8px;
}

.foot .btn {
  flex: 1;
}
</style>

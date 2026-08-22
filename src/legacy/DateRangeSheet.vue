<script setup lang="ts">
import { computed, ref } from 'vue'
import { addDays, monthGrid, monthTitle, nightsBetween, nightsOf, rangeLabel, short, todayISO } from '@/composables/dates'
import { count, list, t } from '@/composables/useI18n'
import type { DateRange } from '@/stores/trip'

const props = defineProps<{
  cityName: string
  /** Уже выбранный диапазон, если есть. */
  value?: DateRange
  /** Ночи, занятые другими городами: дата → название города. */
  busy: Map<string, string>
}>()

const emit = defineEmits<{ apply: [DateRange]; clear: []; close: [] }>()

const MONTHS_AHEAD = 12

const from = ref<string | null>(props.value?.from ?? null)
const to = ref<string | null>(props.value?.to ?? null)

const today = todayISO()

// Список месяцев от текущего вперёд.
const months = computed(() => {
  const now = new Date()
  return Array.from({ length: MONTHS_AHEAD }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    return { year: d.getFullYear(), month: d.getMonth(), cells: monthGrid(d.getFullYear(), d.getMonth()) }
  })
})

/** День занят другим городом — в него нельзя заехать. */
function busyCity(day: string): string | undefined {
  return props.busy.get(day)
}

/** Прошедшие дни недоступны. */
function isPast(day: string): boolean {
  return day < today
}

function isDisabled(day: string): boolean {
  if (isPast(day)) return true
  // Занятая ночь недоступна как день заезда.
  if (busyCity(day)) return true
  // Идёт выбор выезда: перекрыть занятую ночь нельзя, дальше неё не пускаем.
  if (from.value && !to.value) {
    if (day <= from.value) return day !== from.value
    for (const night of nightsOf(from.value, day)) {
      if (busyCity(night)) return true
    }
  }
  return false
}

function inRange(day: string): boolean {
  if (!from.value || !to.value) return false
  return day > from.value && day < to.value
}

function pick(day: string) {
  if (isDisabled(day)) return
  // Первый тап — заезд, второй — выезд. Третий начинает выбор заново.
  if (!from.value || to.value) {
    from.value = day
    to.value = null
    return
  }
  if (day === from.value) {
    // Одна ночь: выезд на следующий день, если он свободен.
    if (!busyCity(day)) to.value = addDays(day, 1)
    return
  }
  to.value = day
}

const nights = computed(() => (from.value && to.value ? nightsBetween(from.value, to.value) : 0))

const hint = computed(() => {
  if (!from.value) return t('dates.pickIn')
  if (!to.value) return t('dates.pickOut', { date: short(from.value) })
  return `${short(from.value)} – ${short(to.value)} · ${count(nights.value, 'u.night')}`
})

function apply() {
  if (from.value && to.value && nights.value > 0) emit('apply', { from: from.value, to: to.value })
}
</script>

<template>
  <div class="sheet-body">
    <header class="head">
      <div>
        <h2 class="title">{{ t('dates.title', { city: cityName }) }}</h2>
        <p class="hint muted">{{ hint }}</p>
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
              :class="{
                edge: day === from || day === to,
                between: inRange(day),
                busy: !!busyCity(day),
                off: isDisabled(day),
              }"
              :disabled="isDisabled(day)"
              :title="busyCity(day) ? t('dates.busy', { city: busyCity(day)! }) : undefined"
              @click="pick(day)"
            >
              <span class="num">{{ Number(day.slice(-2)) }}</span>
              <!-- Подпись, каким городом занят день -->
              <span v-if="busyCity(day)" class="who">{{ busyCity(day) }}</span>
            </button>
          </template>
        </div>
      </section>
    </div>

    <footer class="foot">
      <button v-if="value" class="btn" @click="emit('clear')">{{ t('dates.remove') }}</button>
      <button class="btn primary" :disabled="!from || !to" @click="apply()">
        {{ from && to ? t('dates.doneWith', { range: rangeLabel(from, to) }) : t('dates.done') }}
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
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  flex: 1;
  min-height: 0;
}

.month h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 16px 0 8px;
  color: var(--text);
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.cell {
  aspect-ratio: 1;
  min-height: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  border-radius: 10px;
  font-size: 15px;
  padding: 0 2px;
}

.cell.empty {
  visibility: hidden;
}

.num {
  line-height: 1;
}

/* День, занятый другим городом: приглушён и подписан */
.who {
  font-size: 8px;
  line-height: 1;
  color: var(--text-muted);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.day.off {
  color: var(--text-muted);
  opacity: 0.45;
}

.day.busy {
  background: var(--bg);
}

.day.between {
  background: var(--brand-yellow-soft);
  border-radius: 0;
}

.day.edge {
  background: var(--brand-yellow);
  font-weight: 700;
  opacity: 1;
}

.foot {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.btn {
  flex: 1;
  min-height: var(--tap-min);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-size: 15px;
  font-weight: 600;
  background: var(--card);
}

.btn.primary {
  background: var(--brand-yellow);
  border-color: var(--brand-yellow);
}

.btn:disabled {
  opacity: 0.5;
}
</style>

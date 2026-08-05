<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTripStore } from '@/stores/trip'
import { cityName, LEVELS, MAX_PEOPLE } from '@/data'
import { nextDiscountStep } from '@/composables/calc'
import { money, percent } from '@/composables/format'
import { plural, rangeLabel, short } from '@/composables/dates'

const trip = useTripStore()
const open = ref(false)
const copied = ref(false)

const r = computed(() => trip.result)

// Подсказка-стимул: сколько человек добрать до следующей ступени скидки.
const nextStep = computed(() => {
  if (trip.people >= MAX_PEOPLE) return null
  return nextDiscountStep(trip.people)
})

const articles = computed(() => [
  { label: 'Проживание', value: r.value.stay },
  { label: 'Питание', value: r.value.food },
  { label: 'Гид и экскурсии', value: r.value.guide },
  { label: 'Переезды', value: r.value.transfers },
  { label: 'Сервисный сбор', value: r.value.serviceFee },
])

function levelName(id: string) {
  return LEVELS.find((l) => l.id === id)?.name ?? id
}

/** Текстовая сводка для буфера обмена. */
function summaryText(): string {
  const lines: string[] = []
  lines.push('YOLI — предварительный расчёт путешествия по Узбекистану')
  lines.push('')
  if (trip.summary) {
    lines.push(
      `${rangeLabel(trip.summary.from, trip.summary.to)} · ${trip.summary.days} ${plural(trip.summary.days, 'день', 'дня', 'дней')}`,
    )
  }
  lines.push(`Человек: ${trip.people}`)
  lines.push('')
  lines.push('Маршрут:')
  for (const c of r.value.byCity) {
    const range = trip.ranges[c.cityId]
    const dates = range ? `${short(range.from)}–${short(range.to)}, ` : ''
    lines.push(
      `  ${cityName(c.cityId)} — ${dates}${c.nights} ${plural(c.nights, 'ночь', 'ночи', 'ночей')}, тариф «${levelName(c.level)}»`,
    )
  }
  lines.push('')
  for (const a of articles.value) lines.push(`${a.label}: ${money(a.value)}`)
  if (r.value.discount > 0) {
    lines.push(`Скидка группы ${percent(r.value.discountRate)}: −${money(r.value.discount)}`)
  }
  lines.push('')
  lines.push(`Итого за группу: ${money(r.value.total)}`)
  lines.push(`На человека: ${money(r.value.perPerson)}`)
  lines.push('')
  lines.push('Цены предварительные, не являются офертой.')
  return lines.join('\n')
}

async function share() {
  try {
    await navigator.clipboard.writeText(summaryText())
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // Буфер недоступен (нет разрешения или небезопасный контекст) — молча выходим.
    copied.value = false
  }
}
</script>

<template>
  <div class="panel">
    <!-- Тап по шапке панели раскрывает разбивку -->
    <button class="head tap" :aria-expanded="open" @click="open = !open">
      <div>
        <div class="per-person tnum">{{ money(r.perPerson) }}</div>
        <div class="per-person-label">на человека</div>
      </div>
      <div class="side">
        <div class="group tnum">
          за группу из {{ trip.people }}: <b>{{ money(r.total) }}</b>
        </div>
        <div class="chevron" :class="{ open }" aria-hidden="true">⌃</div>
      </div>
    </button>

    <!-- Скидка и подсказка-стимул: чем больше группа, тем выгоднее -->
    <div v-if="r.discount > 0" class="discount">
      Скидка группы <b>{{ percent(r.discountRate) }}</b> · вы экономите
      <b>{{ money(r.discount) }}</b>
    </div>
    <div v-if="nextStep" class="nudge">
      +{{ nextStep.add }} {{ plural(nextStep.add, 'человек', 'человека', 'человек') }} — скидка
      {{ percent(nextStep.rate) }}
    </div>

    <div v-if="open" class="details">
      <h3>По статьям</h3>
      <div v-for="a in articles" :key="a.label" class="row">
        <span>{{ a.label }}</span>
        <span class="tnum">{{ money(a.value) }}</span>
      </div>
      <div v-if="r.discount > 0" class="row minus">
        <span>Скидка группы {{ percent(r.discountRate) }}</span>
        <span class="tnum">−{{ money(r.discount) }}</span>
      </div>

      <h3>По городам</h3>
      <p v-if="!r.byCity.length" class="muted empty">Выберите даты и тариф хотя бы в одном городе.</p>
      <div v-for="c in r.byCity" :key="c.cityId" class="row">
        <span>
          {{ cityName(c.cityId) }} · {{ c.nights }}
          {{ plural(c.nights, 'ночь', 'ночи', 'ночей') }} · {{ levelName(c.level) }}
        </span>
        <span class="tnum">{{ money(c.amount) }}</span>
      </div>

      <div class="actions">
        <button class="btn" @click="trip.reset()">Сбросить</button>
        <button class="btn primary" @click="share()">
          {{ copied ? 'Скопировано' : 'Поделиться расчётом' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  background: var(--card);
  border-top: 1px solid var(--border);
  box-shadow: var(--shadow-up);
  flex-shrink: 0;
  padding-left: calc(16px + var(--safe-left));
  padding-right: calc(16px + var(--safe-right));
  max-height: 70dvh;
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* На iPad и десктопе панель держит ту же колонку, что и контент */
.panel > * {
  max-width: 720px;
  margin-inline: auto;
}

.head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  text-align: left;
}

.per-person {
  font-size: 30px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.per-person-label {
  font-size: 12px;
  color: var(--text-muted);
}

.side {
  display: flex;
  align-items: center;
  gap: 10px;
}

.group {
  font-size: 13px;
  color: var(--text-muted);
  text-align: right;
}

.group b {
  color: var(--text);
  font-weight: 600;
}

.chevron {
  font-size: 16px;
  color: var(--text-muted);
  transition: transform 0.15s;
  transform: rotate(180deg);
}

.chevron.open {
  transform: rotate(0deg);
}

/* Без подложки: заливка спорила с ценой. Выделены только числа. */
.discount {
  font-size: 13px;
  color: var(--text-muted);
  padding-bottom: 2px;
}

.discount b {
  color: var(--accent-strong);
  font-weight: 700;
}

.nudge {
  font-size: 13px;
  color: var(--text-muted);
  padding-bottom: 10px;
}

.details {
  border-top: 1px solid var(--border);
  padding: 12px 0 16px;
}

h3 {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin: 12px 0 6px;
}

h3:first-child {
  margin-top: 0;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
  padding: 5px 0;
}

.row.minus {
  color: #1a7f3c;
}

.empty {
  font-size: 14px;
  margin: 0;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
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
</style>

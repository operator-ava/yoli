<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTripStore } from '@/stores/trip'
import { cityName, levelName, MAX_PEOPLE } from '@/data'
import { ARTICLES } from '@/composables/calc'
import { nextDiscountStep } from '@/composables/calc'
import { allocate, exactUnits, formatUnits, percent, steppedUnits } from '@/composables/format'
import { rangeLabel, short } from '@/composables/dates'
import { count, plural, t } from '@/composables/useI18n'

const trip = useTripStore()
const open = ref(false)
const copied = ref(false)

const r = computed(() => trip.result)

// Подсказка-стимул: сколько человек добрать до следующей ступени скидки.
const nextStep = computed(() => {
  if (trip.people >= MAX_PEOPLE) return null
  return nextDiscountStep(trip.people)
})

// Разбивка считается в целых единицах валюты и складывается в итог ТОЧНО.
// Итог округляется шагом валюты, скидка выводится без шага,
// а строки раскладываются по долям так, чтобы сумма сошлась копейка в копейку.
const view = computed(() => {
  // Цена на человека — это то, что человек читает первым, поэтому округляем её,
  // а итог за группу выводим как «на человека × люди». Тогда умножение в уме
  // всегда сходится с тем, что написано в панели.
  const perPersonUnits = steppedUnits(r.value.perPerson)
  const totalUnits = perPersonUnits * trip.people
  const discountUnits = exactUnits(r.value.discount)
  const base = totalUnits + discountUnits

  const articleUnits = allocate(
    base,
    ARTICLES.map((a) => r.value.articles[a]),
  )
  const cityUnits = allocate(
    base,
    r.value.byCity.map((c) => c.amount),
  )

  return {
    perPersonUnits,
    totalUnits,
    discountUnits,
    articles: ARTICLES.map((a, i) => ({
      key: a,
      label: t(`art.${a}`),
      units: articleUnits[i],
    })),
    cities: r.value.byCity.map((c, i) => ({ ...c, units: cityUnits[i] })),
  }
})

/** Текстовая сводка для буфера обмена. */
function summaryText(): string {
  const lines: string[] = []
  lines.push(t('share.title'))
  lines.push('')
  if (trip.summary) {
    lines.push(
      `${rangeLabel(trip.summary.from, trip.summary.to)} · ${count(trip.summary.days, 'u.day')}`,
    )
  }
  lines.push(t('share.people', { n: trip.people }))
  lines.push('')
  lines.push(t('share.route'))
  for (const c of view.value.cities) {
    const range = trip.ranges[c.cityId]
    const dates = range ? `${short(range.from)}–${short(range.to)}, ` : ''
    lines.push(
      `  ${cityName(c.cityId)} — ${dates}${count(c.nights, 'u.night')}, ${levelName(c.level)}`,
    )
  }
  lines.push('')
  for (const a of view.value.articles) lines.push(`${a.label}: ${formatUnits(a.units)}`)
  if (r.value.discount > 0) {
    lines.push(
      `${t('art.discount', { rate: percent(r.value.discountRate) })}: −${formatUnits(view.value.discountUnits)}`,
    )
  }
  lines.push('')
  lines.push(t('share.total', { sum: formatUnits(view.value.totalUnits) }))
  lines.push(t('share.perPerson', { sum: formatUnits(view.value.perPersonUnits) }))
  lines.push('')
  lines.push(t('share.note'))
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
        <div class="per-person tnum">{{ formatUnits(view.perPersonUnits) }}</div>
        <div class="per-person-label">{{ t('total.perPerson') }}</div>
      </div>
      <div class="side">
        <div class="group tnum">
          {{ t('total.forGroup', { n: trip.people }) }} <b>{{ formatUnits(view.totalUnits) }}</b>
        </div>
        <div class="chevron" :class="{ open }" aria-hidden="true">⌃</div>
      </div>
    </button>

    <!-- Скидка и подсказка-стимул: чем больше группа, тем выгоднее -->
    <div v-if="r.discount > 0" class="discount">
      {{ t('total.discount') }} <b>{{ percent(r.discountRate) }}</b> · {{ t('total.saving') }}
      <b>{{ formatUnits(view.discountUnits) }}</b>
    </div>
    <div v-if="nextStep" class="nudge">
      {{
        t('total.nudge', {
          n: nextStep.add,
          people: plural(nextStep.add, 'u.person'),
          rate: percent(nextStep.rate),
        })
      }}
    </div>

    <div v-if="open" class="details">
      <h3>{{ t('total.byArticles') }}</h3>
      <div v-for="a in view.articles" :key="a.key" class="row">
        <span>{{ a.label }}</span>
        <span class="tnum">{{ formatUnits(a.units) }}</span>
      </div>
      <div v-if="r.discount > 0" class="row minus">
        <span>{{ t('art.discount', { rate: percent(r.discountRate) }) }}</span>
        <span class="tnum">−{{ formatUnits(view.discountUnits) }}</span>
      </div>

      <h3>{{ t('total.byCities') }}</h3>
      <p v-if="!r.byCity.length" class="muted empty">{{ t('total.empty') }}</p>
      <div v-for="c in view.cities" :key="c.cityId" class="row">
        <span>
          {{ cityName(c.cityId) }} · {{ count(c.nights, 'u.night') }} · {{ levelName(c.level) }}
        </span>
        <span class="tnum">{{ formatUnits(c.units) }}</span>
      </div>

      <div class="actions">
        <button class="btn" @click="trip.reset()">{{ t('total.reset') }}</button>
        <button class="btn primary" @click="share()">
          {{ copied ? t('total.copied') : t('total.share') }}
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

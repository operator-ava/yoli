<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTripStore } from '@/stores/trip'
import { cityName, levelName, MAX_PEOPLE } from '@/data'
import type { Article } from '@/composables/calc'
import { nextDiscountStep } from '@/composables/calc'
import { allocate, formatUnits, percent, steppedUnits } from '@/composables/format'
import { count, plural, t } from '@/composables/useI18n'

const trip = useTripStore()
const open = ref(false)

// Оплата — макет: экран благодарности открывает экран расчёта.
const emit = defineEmits<{ pay: [] }>()

const r = computed(() => trip.result)

// Подсказка-стимул: сколько человек добрать до следующей ступени скидки.
const nextStep = computed(() => {
  if (trip.people >= MAX_PEOPLE) return null
  return nextDiscountStep(trip.people)
})

// Разбивка считается в целых единицах валюты и складывается в итог ТОЧНО.
// Итог округляется шагом валюты, скидка выводится без шага,
// а строки раскладываются по долям так, чтобы сумма сошлась копейка в копейку.
/** Четыре укрупнённые статьи вместо семи. Внутренние статьи себестоимости
 *  остаются в pricing.ts — наружу они не выходят, иначе по ним считается маржа. */
const GROUPS: { key: string; items: Article[] }[] = [
  { key: 'stay', items: ['stay'] },
  { key: 'food', items: ['food'] },
  { key: 'transportAll', items: ['transport', 'transfer'] },
  { key: 'services', items: ['guide', 'dedBobo', 'tickets', 'insurance'] },
]

/** Пока не выбрано ни одного города, суммы нет — панель не раскрывается. */
const empty = computed(() => r.value.byCity.length === 0)

const view = computed(() => {
  // Цена на человека — это то, что человек читает первым, поэтому округляем её,
  // а итог за группу выводим как «на человека × люди». Тогда умножение в уме
  // всегда сходится с тем, что написано в панели.
  const perPersonUnits = steppedUnits(r.value.perPerson)
  const totalUnits = perPersonUnits * trip.people
  // Скидку тоже округляем шагом валюты: точное число выбивалось из ряда круглых.
  // Сходимость не страдает — строки раскладываются от базы «итог + скидка».
  const discountUnits = steppedUnits(r.value.discount)
  const base = totalUnits + discountUnits

  const articleUnits = allocate(
    base,
    GROUPS.map((g) => g.items.reduce((sum, a) => sum + r.value.articles[a], 0)),
  )
  const cityUnits = allocate(
    base,
    r.value.byCity.map((c) => c.amount),
  )

  return {
    perPersonUnits,
    totalUnits,
    discountUnits,
    articles: GROUPS.map((g, i) => ({
      key: g.key,
      label: t(`art.${g.key}`),
      units: articleUnits[i],
    })),
    cities: r.value.byCity.map((c, i) => ({ ...c, units: cityUnits[i] })),
  }
})

</script>

<template>
  <div class="panel">
    <!-- Тап по шапке панели раскрывает разбивку -->
    <!-- Ничего не выбрано: показываем задачу, а не ноль -->
    <div v-if="empty" class="head empty-head">
      <span class="empty-text">{{ t('total.empty.head') }}</span>
    </div>

    <div v-else class="head">
      <div class="main">
        <div class="per-person tnum">{{ formatUnits(view.perPersonUnits) }}</div>
        <div class="per-person-label">{{ t('total.perPerson') }}</div>
      </div>
      <div class="side">
        <div class="group tnum">
          {{ t('total.forGroup', { n: trip.people }) }} <b>{{ formatUnits(view.totalUnits) }}</b>
        </div>
        <!-- Явная кнопка вместо одной стрелки: понятно, что можно нажать -->
        <!-- Стрелка идёт внутри строки подписи, а не отдельным флекс-элементом:
             так она садится на базовую линию текста, рядом с которым стоит.
             Панель раскрывается ВВЕРХ: вверх раскрыть, вниз свернуть.
             Глифы разные, поворота одного нет. -->
        <button class="more" :aria-expanded="open" @click="open = !open">
          <span class="more-label"
            >{{ open ? t('total.collapse') : t('total.more')
            }}<span class="chev" :class="open ? 'chev-down' : 'chev-up'" aria-hidden="true">{{
              open ? '⌄' : '⌃'
            }}</span></span
          >
        </button>
      </div>
    </div>

    <!-- Скидка и подсказка-стимул: чем больше группа, тем выгоднее -->
    <div v-if="r.discount > 0" class="discount">
      {{ t('total.discount') }} <b>{{ percent(r.discountRate) }}</b> · {{ t('total.saving') }}
      <b>{{ formatUnits(view.discountUnits) }}</b>
    </div>
    <div v-if="nextStep && !empty" class="nudge">
      {{
        t('total.nudge', {
          n: nextStep.add,
          people: plural(nextStep.add, 'u.person'),
          rate: percent(nextStep.rate),
        })
      }}
    </div>

    <div v-if="open && !empty" class="details">
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

      <!-- «Сбросить» остаётся внутри раскрытой части: действие редкое
           и разрушительное, на виду ему не место -->
      <div class="actions">
        <button class="btn" @click="trip.reset()">{{ t('total.reset') }}</button>
      </div>
    </div>

    <!-- «Оплатить» видна всегда, в том числе когда панель свёрнута.
         Пустой расчёт — кнопки нет вовсе: платить не за что, а погашенная
         кнопка только шумит рядом с единственной строкой-подсказкой. -->
    <div v-if="!empty" class="pay-wrap">
      <button class="btn primary pay" @click="emit('pay')">
        {{ t('total.pay') }}
      </button>
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
  /* Нижнего бара больше нет — полосу жеста «домой» держит панель */
  padding-bottom: var(--safe-bottom);
  max-height: 70dvh;
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* На iPad и десктопе панель держит ту же колонку, что и контент */
.panel > * {
  max-width: 720px;
  margin-inline: auto;
}

.empty-head {
  min-height: var(--tap-min);
  display: flex;
  align-items: center;
}

.empty-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-muted);
}

.main {
  flex-shrink: 0;
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

/* Кнопка раскрытия: без заливки, текст и стрелка тем же оранжевым,
   что процент и сумма экономии. Тач-зона не меньше 44 px. */
.more {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 8px;
  color: var(--accent-strong);
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.per-person {
  /* Крупная цена не переносится: ломать её кнопкой нельзя */
  white-space: nowrap;
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
  min-width: 0;
}

.group {
  font-size: 13px;
  color: var(--text-muted);
  text-align: right;
  min-width: 0;
}

.group b {
  color: var(--text);
  font-weight: 600;
  /* Сумма и символ валюты не расходятся по разным строкам */
  white-space: nowrap;
}

/* Стрелка показывает, куда поедет панель: свёрнута — вверх, раскрыта — вниз.
   Кегль наследуется от подписи, выравнивание — в общем классе .chev. */
.more .chev {
  margin-left: 6px;
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

/* Главное действие панели: всегда на экране, во всю ширину */
.pay-wrap {
  padding-bottom: 12px;
}

.pay {
  width: 100%;
  font-size: 16px;
}
</style>

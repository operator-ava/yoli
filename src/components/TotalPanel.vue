<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTripStore } from '@/stores/trip'
import { cityName, levelName, MAX_PEOPLE } from '@/data'
import { nextDiscountStep } from '@/composables/calc'
import { formatUnits, percent } from '@/composables/format'
import { useTotals } from '@/composables/totals'
import { count, plural, t } from '@/composables/useI18n'

const trip = useTripStore()
const open = ref(false)

// Оплата — макет: экран благодарности открывает экран расчёта.
const emit = defineEmits<{ pay: [] }>()

const r = computed(() => trip.result)

// Числа для экрана считаются один раз на всё приложение: панель и свёрнутые
// строки городов берут их отсюда, а не считают каждая своё.
const view = useTotals()

/** Пока не выбрано ни одного города, суммы нет — панель не раскрывается. */
const empty = computed(() => view.value.empty)

// Подсказка-стимул: сколько человек добрать до следующей ступени скидки.
const nextStep = computed(() => {
  if (trip.people >= MAX_PEOPLE) return null
  return nextDiscountStep(trip.people)
})
</script>

<template>
  <div class="panel">
    <!-- Тап по шапке панели раскрывает разбивку -->
    <!-- Ничего не выбрано: показываем задачу, а не ноль -->
    <div v-if="empty" class="empty-head">
      <span class="empty-text">{{ t('total.empty.head') }}</span>
    </div>

    <!-- Слева числа, справа действия. Главное число панели — сумма за группу:
         платит группа, а цена на человека нужна для сверки. -->
    <div v-else class="head">
      <div class="main">
        <div class="group-label">{{ t('total.forGroup', { n: trip.people }) }}</div>
        <!-- Не переносится ни при какой сумме: ломать главное число нельзя -->
        <div class="group-sum tnum">{{ formatUnits(view.totalUnits) }}</div>
        <div class="per-person">
          <span class="tnum">{{ formatUnits(view.perPersonUnits) }}</span>
          <span class="per-person-label">{{ t('total.perPerson') }}</span>
        </div>
      </div>

      <div class="side">
        <button class="btn primary pay" @click="emit('pay')">{{ t('total.pay') }}</button>
        <!-- Стрелка идёт внутри строки подписи, а не отдельным флекс-элементом:
             так она садится на базовую линию текста, рядом с которым стоит.
             Панель раскрывается ВВЕРХ: вверх раскрыть, вниз свернуть.
             Глифы разные, поворота одного нет. -->
        <button class="more" :aria-expanded="open" @click="open = !open">
          <span class="more-label"
            >{{ open ? t('total.collapse') : t('total.details')
            }}<span class="chev" :class="open ? 'chev-down' : 'chev-up'" aria-hidden="true">{{
              open ? '⌄' : '⌃'
            }}</span></span
          >
        </button>
        <!-- «Сбросить» появляется только в раскрытом виде: действие редкое
             и разрушительное, на виду ему не место -->
        <button v-if="open" class="btn reset" @click="trip.reset()">{{ t('total.reset') }}</button>
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
        <span>{{ t(`art.${a.key}`) }}</span>
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

/* Пустое состояние: единственная строка панели стоит по центру.
   Класса .head здесь нет намеренно — его space-between прижимал бы
   единственного ребёнка влево. */
.empty-head {
  min-height: var(--tap-min);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px 0;
}

.empty-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-muted);
}

.head {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  text-align: left;
}

/* Колонка чисел. Ужимается первой, но крупное число всё равно не переносится */
.main {
  min-width: 0;
}

.group-label {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.3;
}

/* Главное число панели: платит группа */
.group-sum {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  /* Не переносится ни при какой сумме, включая 20 человек в рублях */
  white-space: nowrap;
}

/* Цена на человека — для сверки, поэтому мельче итога */
.per-person {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;
}

.per-person-label {
  font-size: 12px;
  font-weight: 400;
  color: var(--text-muted);
  margin-left: 4px;
}

/* Колонка действий: не сжимается, кнопки во всю её ширину */
.side {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
  flex-shrink: 0;
}

/* Кнопка раскрытия: без заливки, текст и стрелка тем же оранжевым,
   что процент и сумма экономии. Тач-зона не меньше 44 px. */
.more {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 8px;
  color: var(--accent-strong);
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.reset {
  min-height: 44px;
  font-size: 14px;
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

.btn {
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

/* Главное действие панели. Не сжимается: ширину задаёт её собственный текст,
   тач-зона 48 px по высоте. */
.pay {
  min-height: 48px;
  padding: 0 20px;
  font-size: 16px;
  white-space: nowrap;
}
</style>

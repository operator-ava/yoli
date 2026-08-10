<script setup lang="ts">
import { computed } from 'vue'
import {
  city,
  cityName,
  levelName,
  type CityId,
  type InclusionContext,
  type InclusionKey,
  type Level,
} from '@/data'
import { nightsBetween, short } from '@/composables/dates'
import { formatUnits } from '@/composables/format'
import { useTotals } from '@/composables/totals'
import { count, t } from '@/composables/useI18n'
import type { DateRange } from '@/stores/trip'
import TariffCarousel from '@/components/TariffCarousel.vue'
import { useIsWide } from '@/composables/useBreakpoint'

const props = defineProps<{
  cityId: CityId
  range?: DateRange
  level: Level | null
  ctx: InclusionContext
  collapsed: boolean
}>()

const emit = defineEmits<{
  pickDates: []
  choose: [Level]
  toggle: []
  openItem: [{ level: Level; key: InclusionKey }]
}>()

// На широком экране выбор делается кнопкой в каждой карточке — общая подсказка не нужна.
const isWide = useIsWide()

const info = computed(() => city(props.cityId))
const nights = computed(() => (props.range ? nightsBetween(props.range.from, props.range.to) : 0))
const dates = computed(() =>
  props.range ? `${short(props.range.from)} – ${short(props.range.to)}` : '',
)

// Сумма города берётся из общего расчёта — того же, что питает панель итога.
// Здесь ничего не пересчитывается, поэтому сумма всех городов сходится с итогом.
const totals = useTotals()
const citySum = computed(() => totals.value.cityUnits(props.cityId))
</script>

<template>
  <!-- Состояние А: даты не выбраны. Компактная строка, город в расчёт не входит.
       Сворачивать нечего — карточка и так одна строка. -->
  <button v-if="!range" class="card empty tap" @click="emit('pickDates')">
    <img class="thumb" :src="info?.photo" :alt="cityName(cityId)" loading="lazy" />
    <span class="col">
      <span class="name">{{ cityName(cityId) }}</span>
    </span>
    <!-- Контрастный призыв к действию вместо иконки -->
    <span class="cta">{{ t('calc.pickDates') }}</span>
  </button>

  <!-- Состояние Б: даты выбраны, карточка свёрнута в одну строку.
       Из строки видно и даты, и выбран ли тариф. -->
  <button v-else-if="collapsed" class="card folded tap" :aria-expanded="false" @click="emit('toggle')">
    <img class="thumb" :src="info?.photo" :alt="cityName(cityId)" loading="lazy" />
    <span class="col">
      <span class="name">{{ cityName(cityId) }}</span>
      <!-- Только ночи: дни сюда не влезают, а строка держит высоту 74 px -->
        <span class="muted sub">{{ dates }} · {{ count(nights, 'u.night') }}</span>
    </span>
    <!-- Тариф выбран — сумма за всю группу по городу, над ней название тарифа.
         Не выбран — призыв к действию. Стрелка идёт внутри нижней строки,
         поэтому садится на её базовую линию (общее правило .chev). -->
    <span class="meta">
      <span v-if="level && citySum !== null" class="level muted">{{ levelName(level) }}</span>
      <span class="bottom-line">
        <span v-if="level && citySum !== null" class="sum tnum">{{ formatUnits(citySum) }}</span>
        <span v-else class="cta-text">{{ t('calc.chooseTariff') }}</span>
        <span class="chev chev-down muted" aria-hidden="true">⌄</span>
      </span>
    </span>
  </button>

  <!-- Состояние В: даты выбраны, карточка раскрыта. -->
  <article v-else class="card open">
    <header class="head">
      <img class="thumb" :src="info?.photo" :alt="cityName(cityId)" loading="lazy" />
      <div class="col">
        <div class="name">{{ cityName(cityId) }}</div>
        <!-- Три отдельные группы, а не одна строка с точками: колонка в шапке
             узкая (107 px на 375), и перенос идёт МЕЖДУ группами. Точек-
             разделителей нет — иначе на конце строки повисал бы «·» -->
        <div class="muted sub">
          <span>{{ dates }}</span>
          <span>{{ count(nights, 'u.night') }}</span>
          <span>{{ count(nights + 1, 'u.day') }}</span>
        </div>
      </div>
      <button class="edit" @click="emit('pickDates')">{{ t('calc.change') }}</button>
      <button
        class="fold"
        :aria-expanded="true"
        :aria-label="t('calc.collapseCity')"
        @click="emit('toggle')"
      >
        <span class="chev chev-up chev-mid muted" aria-hidden="true">⌃</span>
      </button>
    </header>

    <TariffCarousel
      :city-id="cityId"
      :nights="nights"
      :selected="level"
      :ctx="ctx"
      @choose="emit('choose', $event)"
      @open-item="emit('openItem', $event)"
    />

    <p v-if="!level && !isWide" class="muted no-level">{{ t('calc.pickTariff') }}</p>
  </article>
</template>

<style scoped>
.card {
  display: block;
  width: 100%;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
}

/* Состояния А и Б — строки-блоки: одна высота со счётчиком людей
   и строкой «Перелёт», общий токен --row-height. */
.empty,
.folded {
  display: flex;
  align-items: center;
  min-height: var(--row-height);
  padding: 8px 12px 8px 8px;
  text-align: left;
}

/* Состояние А: приглушено, в расчёт не входит */
.empty {
  gap: 12px;
}

/* Состояние Б: одна строка, всё главное видно без разворота */
.folded {
  gap: 10px;
}

.open {
  padding: 10px;
}

.head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 10px;
}

.thumb {
  width: var(--row-thumb);
  height: var(--row-thumb);
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
  background: var(--border);
}

.col {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.name {
  font-size: 16px;
  font-weight: 600;
}

.sub {
  font-size: 13px;
}

/* Шапка раскрытой карточки: даты и длительность переносятся целиком */
.head .sub {
  display: flex;
  flex-wrap: wrap;
  column-gap: 8px;
}

/* Видно, что от человека требуется действие */
.cta {
  flex-shrink: 0;
  background: var(--brand-yellow);
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
  border-radius: 999px;
  padding: 10px 14px;
  white-space: nowrap;
}

/* Правая колонка свёрнутой строки: тариф над суммой, стрелка в строке суммы.
   Прижата вправо, поэтому стрелка стоит на одном месте при любой сумме. */
.meta {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  line-height: 1.25;
}

.level {
  font-size: 11px;
  font-weight: 600;
}

/* Кегль строки задан здесь, а не на каждом варианте: стрелка берёт его
   же и потому садится ровно на базовую линию — правило класса .chev. */
.bottom-line {
  white-space: nowrap;
  font-size: 15px;
}

/* Сумма за всю группу по этому городу, со скидкой */
.sum {
  font-weight: 700;
}

/* Тариф не выбран — призыв к действию, а не констатация */
.cta-text {
  font-weight: 600;
  color: var(--accent-strong);
}

.bottom-line .chev {
  margin-left: 6px;
}

.edit {
  min-height: 44px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  flex-shrink: 0;
}

/* Кнопка сворачивания в раскрытой карточке */
.fold {
  min-height: 44px;
  width: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Размер и выравнивание стрелки — в общем классе .chev (global.css).
   Здесь только кегль строки, от которого она считается. */
.fold .chev {
  font-size: 15px;
}

.no-level {
  font-size: 13px;
  margin: 8px 0 2px;
  text-align: center;
}

/* Очень узкий экран: длинная сумма рядом с длинным названием города
   не должна ломать строку */
@media (max-width: 359px) {
  .bottom-line {
    font-size: 14px;
  }
}
</style>

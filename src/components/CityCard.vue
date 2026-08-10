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
    <img class="thumb small" :src="info?.photo" :alt="cityName(cityId)" loading="lazy" />
    <span class="col">
      <span class="name">{{ cityName(cityId) }}</span>
      <span class="muted sub">{{ dates }}</span>
    </span>
    <!-- Тариф выбран — жёлтая плашка, не выбран — серая подпись. Разница видна сразу -->
    <span class="tariff-tag" :class="{ on: level }">
      {{ level ? levelName(level) : t('calc.noTariff') }}
    </span>
    <span class="chev chev-down chev-mid muted" aria-hidden="true">⌄</span>
  </button>

  <!-- Состояние В: даты выбраны, карточка раскрыта. -->
  <article v-else class="card open">
    <header class="head">
      <img class="thumb" :src="info?.photo" :alt="cityName(cityId)" loading="lazy" />
      <div class="col">
        <div class="name">{{ cityName(cityId) }}</div>
        <div class="muted sub">{{ dates }} · {{ count(nights, 'u.night') }}</div>
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

/* Состояние А: приглушено, в расчёт не входит */
.empty {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px 8px 8px;
  text-align: left;
}

/* Состояние Б: одна строка, всё главное видно без разворота */
.folded {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 8px 8px;
  text-align: left;
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
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
  background: var(--border);
}

/* В свёрнутой строке фото меньше: строка должна быть заметно ниже раскрытой */
.thumb.small {
  width: 44px;
  height: 44px;
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

/* Состояние тарифа в свёрнутой строке */
.tariff-tag {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
}

.tariff-tag.on {
  background: var(--brand-yellow);
  color: var(--text);
  border-radius: 999px;
  padding: 5px 10px;
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
.folded .chev,
.fold .chev {
  font-size: 15px;
}

.no-level {
  font-size: 13px;
  margin: 8px 0 2px;
  text-align: center;
}

/* Очень узкий экран: длинное «Тариф не выбран» рядом с длинным названием
   города не должно ломать строку */
@media (max-width: 359px) {
  .tariff-tag {
    font-size: 11px;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { city, cityName, type CityId, type InclusionKey, type Level } from '@/data'
import { nightsBetween, short } from '@/composables/dates'
import { count, t } from '@/composables/useI18n'
import type { DateRange } from '@/stores/trip'
import TariffCarousel from '@/components/TariffCarousel.vue'

const props = defineProps<{
  cityId: CityId
  range?: DateRange
  level: Level | null
  hotelId?: string
}>()

const emit = defineEmits<{
  pickDates: []
  choose: [Level]
  openItem: [{ level: Level; key: InclusionKey }]
}>()

const info = computed(() => city(props.cityId))
const nights = computed(() => (props.range ? nightsBetween(props.range.from, props.range.to) : 0))
</script>

<template>
  <!-- Состояние А: даты не выбраны. Компактная строка, город в расчёт не входит. -->
  <button v-if="!range" class="card empty tap" @click="emit('pickDates')">
    <img class="thumb" :src="info?.photo" :alt="cityName(cityId)" loading="lazy" />
    <span class="col">
      <span class="name">{{ cityName(cityId) }}</span>
      <span class="muted sub">{{ t('calc.pickDates') }}</span>
    </span>
    <span class="cal" aria-hidden="true">🗓</span>
  </button>

  <!-- Состояние Б: даты выбраны, карточка раскрыта. -->
  <article v-else class="card open">
    <header class="head">
      <img class="thumb" :src="info?.photo" :alt="cityName(cityId)" loading="lazy" />
      <div class="col">
        <div class="name">{{ cityName(cityId) }}</div>
        <div class="muted sub">
          {{ short(range.from) }} – {{ short(range.to) }} · {{ count(nights, 'u.night') }}
        </div>
      </div>
      <button class="edit" @click="emit('pickDates')">{{ t('calc.change') }}</button>
    </header>

    <TariffCarousel
      :city-id="cityId"
      :nights="nights"
      :selected="level"
      :hotel-id="hotelId"
      @choose="emit('choose', $event)"
      @open-item="emit('openItem', $event)"
    />

    <p v-if="!level" class="muted no-level">{{ t('calc.pickTariff') }}</p>
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
  opacity: 0.75;
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

.cal {
  font-size: 20px;
  flex-shrink: 0;
  padding-right: 4px;
}

.edit {
  min-height: 44px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  flex-shrink: 0;
}

.no-level {
  font-size: 13px;
  margin: 8px 0 2px;
  text-align: center;
}
</style>

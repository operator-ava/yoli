<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTripStore } from '@/stores/trip'
import { cityName, MAX_PEOPLE, MIN_PEOPLE, type CityId, type InclusionKey, type Level } from '@/data'
import { plural, rangeLabel } from '@/composables/dates'
import CityCard from '@/components/CityCard.vue'
import TotalPanel from '@/components/TotalPanel.vue'
import BottomSheet from '@/components/BottomSheet.vue'
import DateRangeSheet from '@/components/DateRangeSheet.vue'
import InclusionSheet from '@/components/InclusionSheet.vue'
import HotelSheet from '@/components/HotelSheet.vue'
import MealSheet from '@/components/MealSheet.vue'

const trip = useTripStore()

// Какой лист открыт: календарь города или подробности пункта состава.
const dateSheet = ref<CityId | null>(null)
const itemSheet = ref<{ cityId: CityId; level: Level; key: InclusionKey } | null>(null)

const busy = computed(() => (dateSheet.value ? trip.busyNights(dateSheet.value) : new Map()))

/** Выбор тарифа прямо из открытого листа. */
function chooseFromSheet(level: Level) {
  if (!itemSheet.value) return
  trip.setLevel(itemSheet.value.cityId, level)
  itemSheet.value = null
}

const summaryLine = computed(() => {
  const s = trip.summary
  if (!s) return ''
  return `Поездка ${rangeLabel(s.from, s.to)} · ${s.days} ${plural(s.days, 'день', 'дня', 'дней')} · ${s.cities} ${plural(s.cities, 'город', 'города', 'городов')}`
})
</script>

<template>
  <section class="app-content">
    <h2>Кто едет</h2>
    <div class="card block">
      <div class="counter">
        <button
          class="round"
          :disabled="trip.people <= MIN_PEOPLE"
          aria-label="Убрать человека"
          @click="trip.changePeople(-1)"
        >
          −
        </button>
        <div class="count">
          <span class="count-num tnum">{{ trip.people }}</span>
          <span class="count-label">{{
            plural(trip.people, 'человек', 'человека', 'человек')
          }}</span>
        </div>
        <button
          class="round"
          :disabled="trip.people >= MAX_PEOPLE"
          aria-label="Добавить человека"
          @click="trip.changePeople(1)"
        >
          +
        </button>
      </div>
    </div>

    <h2>Города</h2>
    <!-- Порядок вычисляется из дат заезда, стрелок нет -->
    <p v-if="summaryLine" class="summary">{{ summaryLine }}</p>

    <div class="cities">
      <CityCard
        v-for="id in trip.orderedCities"
        :key="id"
        :city-id="id"
        :range="trip.ranges[id]"
        :level="trip.levels[id] ?? null"
        @pick-dates="dateSheet = id"
        @choose="trip.setLevel(id, $event)"
        @open-item="itemSheet = { cityId: id, level: $event.level, key: $event.key }"
      />
    </div>
  </section>

  <!-- Итог виден всегда, на любом шаге ввода -->
  <TotalPanel />

  <BottomSheet v-if="dateSheet" @close="dateSheet = null">
    <DateRangeSheet
      :city-name="cityName(dateSheet)"
      :value="trip.ranges[dateSheet]"
      :busy="busy"
      @apply="
        (r) => {
          trip.setRange(dateSheet!, r)
          dateSheet = null
        }
      "
      @clear="
        () => {
          trip.clearRange(dateSheet!)
          dateSheet = null
        }
      "
      @close="dateSheet = null"
    />
  </BottomSheet>

  <!-- У гостиницы и питания свои листы, остальное — общий -->
  <BottomSheet v-if="itemSheet" @close="itemSheet = null">
    <HotelSheet
      v-if="itemSheet.key === 'hotel'"
      :city-id="itemSheet.cityId"
      :level="itemSheet.level"
      :selected-level="trip.levels[itemSheet.cityId] ?? null"
      @choose="chooseFromSheet"
      @close="itemSheet = null"
    />
    <MealSheet
      v-else-if="itemSheet.key === 'food' && trip.ranges[itemSheet.cityId]"
      :city-id="itemSheet.cityId"
      :level="itemSheet.level"
      :range="trip.ranges[itemSheet.cityId]!"
      :selected-level="trip.levels[itemSheet.cityId] ?? null"
      @choose="chooseFromSheet"
      @close="itemSheet = null"
    />
    <InclusionSheet
      v-else
      :city-id="itemSheet.cityId"
      :level="itemSheet.level"
      :item-key="itemSheet.key"
      :selected-level="trip.levels[itemSheet.cityId] ?? null"
      @choose="chooseFromSheet"
      @close="itemSheet = null"
    />
  </BottomSheet>
</template>

<style scoped>

h2 {
  margin-top: 18px;
}

.block {
  padding: 4px 12px;
}

.counter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
}

.round {
  width: var(--tap-min);
  height: var(--tap-min);
  border-radius: 50%;
  border: 1px solid var(--border);
  font-size: 24px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.round:disabled {
  color: var(--border);
}

.count {
  text-align: center;
  line-height: 1.1;
}

.count-num {
  display: block;
  font-size: 26px;
  font-weight: 700;
}

.count-label {
  font-size: 12px;
  color: var(--text-muted);
}




.summary {
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 10px;
}

.cities {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>

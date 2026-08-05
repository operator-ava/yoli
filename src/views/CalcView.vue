<script setup lang="ts">
import { computed } from 'vue'
import { useTripStore } from '@/stores/trip'
import {
  CITIES,
  LEVELS,
  MAX_NIGHTS,
  MAX_PEOPLE,
  MIN_NIGHTS,
  MIN_PEOPLE,
  PRICES_ARE_DRAFT,
  type CityId,
} from '@/data'
import { plural, tripPeriod } from '@/composables/format'
import TotalPanel from '@/components/TotalPanel.vue'

const trip = useTripStore()

// Города в порядке посещения; порядок общий для выбранных и невыбранных.
const cityList = computed(() =>
  trip.order.map((id) => CITIES.find((c) => c.id === id)).filter((c) => c !== undefined),
)

const period = computed(() => tripPeriod(trip.startDate, trip.result.nights))

function isSelected(id: CityId) {
  return trip.selected.has(id)
}
</script>

<template>
  <section class="app-content">
    <!-- Плашка держится, пока цены не утверждены заказчиком -->
    <p v-if="PRICES_ARE_DRAFT" class="draft">Предварительный расчёт</p>

    <h2>Уровень</h2>
    <div class="levels">
      <button
        v-for="l in LEVELS"
        :key="l.id"
        class="level card tap"
        :class="{ active: trip.level === l.id }"
        :aria-pressed="trip.level === l.id"
        @click="trip.setLevel(l.id)"
      >
        {{ l.name }}
      </button>
    </div>

    <h2>Людей</h2>
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
      <label class="switch-row tap">
        <span>Размещение по одному</span>
        <input v-model="trip.singleRooms" type="checkbox" class="switch" />
      </label>
    </div>

    <h2>Дата начала</h2>
    <div class="card block">
      <input v-model="trip.startDate" type="date" class="date tap" />
      <p v-if="period" class="period">{{ period }}</p>
    </div>

    <h2>Города и ночи</h2>
    <div class="card block cities">
      <div
        v-for="(c, i) in cityList"
        :key="c.id"
        class="city list-item"
        :class="{ on: isSelected(c.id) }"
      >
        <label class="city-main tap">
          <input
            type="checkbox"
            class="check"
            :checked="isSelected(c.id)"
            @change="trip.toggleCity(c.id)"
          />
          <span class="city-name">{{ c.name }}</span>
        </label>

        <div v-if="isSelected(c.id)" class="nights">
          <button
            class="round sm"
            :disabled="trip.nights[c.id] <= MIN_NIGHTS"
            :aria-label="`Убрать ночь, ${c.name}`"
            @click="trip.changeNights(c.id, -1)"
          >
            −
          </button>
          <span class="nights-num tnum">{{ trip.nights[c.id] }}</span>
          <button
            class="round sm"
            :disabled="trip.nights[c.id] >= MAX_NIGHTS"
            :aria-label="`Добавить ночь, ${c.name}`"
            @click="trip.changeNights(c.id, 1)"
          >
            +
          </button>
        </div>

        <div class="order">
          <button
            class="arrow"
            :disabled="i === 0"
            :aria-label="`Выше, ${c.name}`"
            @click="trip.move(c.id, -1)"
          >
            ↑
          </button>
          <button
            class="arrow"
            :disabled="i === cityList.length - 1"
            :aria-label="`Ниже, ${c.name}`"
            @click="trip.move(c.id, 1)"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Итог виден всегда, на любом шаге ввода -->
  <TotalPanel />
</template>

<style scoped>
.draft {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--brand-yellow-soft);
  border-radius: var(--radius-sm);
  padding: 7px 12px;
  margin: 12px auto 4px;
}

h2 {
  margin-top: 18px;
}

.levels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.level {
  min-height: 68px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.level.active {
  background: var(--brand-yellow);
  border-color: var(--brand-yellow);
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

.round.sm {
  width: 40px;
  height: 40px;
  min-height: 40px;
  font-size: 20px;
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

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid var(--border);
  font-size: 15px;
  cursor: pointer;
}

.switch {
  width: 51px;
  height: 31px;
  flex-shrink: 0;
  appearance: none;
  background: var(--border);
  border-radius: 999px;
  position: relative;
  transition: background 0.15s;
  cursor: pointer;
}

.switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s;
}

.switch:checked {
  background: var(--brand-yellow);
}

.switch:checked::after {
  transform: translateX(20px);
}

.date {
  width: 100%;
  min-height: var(--tap-min);
  border: none;
  background: none;
  font: inherit;
  font-size: 17px;
  color: inherit;
}

.period {
  border-top: 1px solid var(--border);
  margin: 0;
  padding: 12px 0;
  font-size: 14px;
  color: var(--text-muted);
}

.cities {
  padding: 0 12px;
}

.city {
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid var(--border);
}

.city:first-child {
  border-top: none;
}

.city-main {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: var(--tap-min);
  cursor: pointer;
}

.check {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  accent-color: var(--brand-yellow);
}

.city-name {
  font-size: 16px;
}

.city.on .city-name {
  font-weight: 600;
}

.nights {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nights-num {
  min-width: 22px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}

.order {
  display: flex;
  flex-direction: column;
}

.arrow {
  width: 32px;
  height: 28px;
  min-height: 28px;
  font-size: 14px;
  color: var(--text-muted);
}

.arrow:disabled {
  color: var(--border);
}
</style>

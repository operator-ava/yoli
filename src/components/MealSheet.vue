<script setup lang="ts">
import { computed } from 'vue'
import {
  cityName,
  cuisineForDay,
  dishesFor,
  LEVELS,
  MEAL_FORMAT,
  MEAL_LABEL,
  type CityId,
  type Level,
} from '@/data'
import { addDays, dayMonth, nightsBetween } from '@/composables/dates'
import type { DateRange } from '@/stores/trip'

// Лист «Питание». Кухню человек не выбирает — только смотрит.
const props = defineProps<{
  cityId: CityId
  level: Level
  range: DateRange
  selectedLevel: Level | null
}>()

const emit = defineEmits<{ choose: [Level]; close: [] }>()

const levelName = computed(() => LEVELS.find((l) => l.id === props.level)?.name ?? '')
const format = computed(() => MEAL_FORMAT[props.level])

/** Дни пребывания: раскладка кухонь детерминированная, рандома нет. */
const days = computed(() => {
  const total = nightsBetween(props.range.from, props.range.to)
  return Array.from({ length: total }, (_, i) => {
    const cuisine = cuisineForDay(i, total)
    return {
      n: i + 1,
      date: addDays(props.range.from, i),
      cuisine,
      meals: format.value.meals.map((m) => ({
        key: m,
        label: MEAL_LABEL[m],
        courses: dishesFor(cuisine.id, m),
      })),
    }
  })
})

const others = computed(() =>
  LEVELS.filter((l) => l.id !== props.level).map((l) => ({
    name: l.name,
    meals: MEAL_FORMAT[l.id].meals.length,
    venues: MEAL_FORMAT[l.id].venues,
  })),
)
</script>

<template>
  <div class="body">
    <header class="head">
      <div>
        <h2 class="title">Питание · {{ cityName(cityId) }}</h2>
        <p class="sub muted">Тариф «{{ levelName }}»</p>
      </div>
      <button class="close" aria-label="Закрыть" @click="emit('close')">✕</button>
    </header>

    <div class="scroll">
      <div class="format">
        <div class="format-meals">
          {{ format.meals.map((m) => MEAL_LABEL[m]).join(' · ') }}
        </div>
        <div class="muted format-venues">{{ format.venues }}</div>
      </div>

      <h3>По дням</h3>
      <section v-for="d in days" :key="d.n" class="day">
        <div class="day-head">
          <span class="day-n">День {{ d.n }} · {{ dayMonth(d.date) }}</span>
          <span class="cuisine">{{ d.cuisine.name }}</span>
        </div>
        <div v-for="m in d.meals" :key="m.key" class="meal">
          <div class="meal-label">{{ m.label }}</div>
          <!-- Состав раскрыт только там, где блюда подтверждены заказчиком -->
          <div v-if="m.courses.length" class="courses">
            <div v-for="c in m.courses" :key="c.label" class="course">
              <span class="course-label muted">{{ c.label }}</span>
              <span>{{ c.items.join(', ') }}</span>
            </div>
          </div>
        </div>
      </section>

      <h3>В других тарифах</h3>
      <div v-for="o in others" :key="o.name" class="other">
        <div class="other-name">{{ o.name }} · {{ o.meals }} приёма пищи</div>
        <p class="muted other-text">{{ o.venues }}</p>
      </div>
    </div>

    <footer v-if="selectedLevel !== level" class="foot">
      <button class="btn primary" @click="emit('choose', level)">Выбрать этот тариф</button>
    </footer>
  </div>
</template>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  text-transform: none;
  letter-spacing: 0;
  color: var(--text);
}

.sub {
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

.scroll {
  overflow-y: auto;
  overscroll-behavior: contain;
  flex: 1;
  min-height: 0;
}

.format {
  background: var(--bg);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
}

.format-meals {
  font-size: 15px;
  font-weight: 600;
}

.format-venues {
  font-size: 13px;
  margin-top: 2px;
}

h3 {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin: 20px 0 8px;
}

.day {
  border-top: 1px solid var(--border);
  padding: 10px 0;
}

.day-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.day-n {
  font-size: 14px;
  font-weight: 600;
}

.cuisine {
  font-size: 13px;
  color: var(--accent-strong);
  font-weight: 600;
  text-align: right;
}

.meal {
  padding-top: 6px;
}

.meal-label {
  font-size: 14px;
}

.courses {
  padding: 4px 0 2px 12px;
  border-left: 2px solid var(--brand-yellow);
  margin-top: 4px;
}

.course {
  display: flex;
  gap: 8px;
  font-size: 13px;
  padding: 1px 0;
}

.course-label {
  min-width: 56px;
  flex-shrink: 0;
}

.other {
  border-top: 1px solid var(--border);
  padding: 10px 0;
}

.other-name {
  font-size: 14px;
  font-weight: 600;
}

.other-text {
  font-size: 14px;
  margin: 2px 0 0;
}

.foot {
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.btn {
  width: 100%;
  min-height: var(--tap-min);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-size: 15px;
  font-weight: 600;
}

.btn.primary {
  background: var(--brand-yellow);
  border-color: var(--brand-yellow);
}
</style>

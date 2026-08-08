<script setup lang="ts">
import { computed } from 'vue'
import {
  cityName,
  cuisineForMeal,
  levelName,
  MEAL_FORMAT,
  MEAL_LABEL_KEY,
  type CityId,
  type Level,
} from '@/data'
import { addDays, dayMonth, nightsBetween } from '@/composables/dates'
import { t } from '@/composables/useI18n'
import type { DateRange } from '@/stores/trip'

// Лист «Питание»: приёмы пищи и кухня каждого. Кухню человек не выбирает —
// только смотрит. Конкретные блюда и заведения не обещаем.
const props = defineProps<{
  cityId: CityId
  level: Level
  range: DateRange
  selectedLevel: Level | null
}>()

const emit = defineEmits<{ choose: [Level]; close: [] }>()

const format = computed(() => MEAL_FORMAT[props.level])

/** Дни пребывания. Раскладка детерминированная: одни и те же даты и город
 *  всегда дают одну и ту же последовательность кухонь. */
const days = computed(() => {
  const total = nightsBetween(props.range.from, props.range.to)
  const meals = format.value.meals
  return Array.from({ length: total }, (_, dayIndex) => ({
    n: dayIndex + 1,
    date: addDays(props.range.from, dayIndex),
    meals: meals.map((m, mealIndex) => ({
      key: m,
      label: t(MEAL_LABEL_KEY[m]),
      cuisine: t(cuisineForMeal(m, dayIndex, mealIndex, meals.length).nameKey),
    })),
  }))
})
</script>

<template>
  <div class="body">
    <header class="head">
      <div>
        <h2 class="title">{{ t('meal.title', { city: cityName(cityId) }) }}</h2>
        <p class="sub muted">{{ t('sheet.tariff', { name: levelName(level) }) }}</p>
      </div>
      <button class="close" :aria-label="t('sheet.close')" @click="emit('close')">✕</button>
    </header>

    <div class="scroll">
      <div class="format">
        <div class="format-meals">
          {{ format.meals.map((m) => t(MEAL_LABEL_KEY[m])).join(' · ') }}
        </div>
        <div class="muted format-venues">{{ t(format.venuesKey) }}</div>
      </div>

      <section v-for="d in days" :key="d.n" class="day">
        <div class="day-head">{{ t('meal.day', { n: d.n, date: dayMonth(d.date) }) }}</div>
        <div v-for="m in d.meals" :key="m.key" class="meal">
          <span class="meal-label">{{ m.label }}</span>
          <span class="cuisine">{{ m.cuisine }}</span>
        </div>
      </section>

      <p class="note muted">{{ t('meal.note') }}</p>
    </div>

    <footer v-if="selectedLevel !== level" class="foot">
      <button class="btn primary" @click="emit('choose', level)">{{ t('sheet.choose') }}</button>
    </footer>
  </div>
</template>

<style scoped>
.body { display: flex; flex-direction: column; min-height: 0 }
.head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding-bottom: 10px }
.title { font-size: 18px; font-weight: 700; margin: 0; color: var(--text) }
.sub { font-size: 13px; margin: 2px 0 0 }
.close { width: 40px; height: 40px; min-height: 40px; font-size: 18px; color: var(--text-muted); flex-shrink: 0 }
.scroll { overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; flex: 1; min-height: 0 }

.format {
  background: var(--bg);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
}

.format-meals { font-size: 15px; font-weight: 600 }
.format-venues { font-size: 13px; margin-top: 2px }

.day {
  border-top: 1px solid var(--border);
  padding: 10px 0;
  margin-top: 6px;
}

.day-head {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

/* Приём пищи слева, кухня справа */
.meal {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
  padding: 4px 0;
}

.meal-label { color: var(--text-muted) }

.cuisine {
  font-weight: 600;
  text-align: right;
}

.note {
  font-size: 12px;
  line-height: 1.4;
  margin: 14px 0 0;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.foot { padding-top: 12px; border-top: 1px solid var(--border) }
.btn {
  width: 100%;
  min-height: var(--tap-min);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-size: 15px;
  font-weight: 600;
}
.btn.primary { background: var(--brand-yellow); border-color: var(--brand-yellow) }
</style>

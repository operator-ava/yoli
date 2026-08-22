<script setup lang="ts">
// Длительность тура — одна строка в двух состояниях.
//
// Не выбрана: «Выберите длительность тура ⌄».
// Выбрана: слева даты поездки, справа длительность — «25 августа – 1 сентября
// | 7 ночей · 8 дней ⌄». Отдельной строки с периодом под списком нет,
// период стоит в самой строке. Решение заказчика 22.08.2026.
//
// Даты вылета здесь НЕТ: она живёт в блоке «Перелёт». Пока она не выбрана,
// строка показывает только длительность — даты брать неоткуда.
import { computed } from 'vue'
import { PACKAGES, type PackageNights } from '@/data'
import { t } from '@/composables/useI18n'
import { addDays, dayMonth, nightsDays } from '@/composables/dates'

const props = defineProps<{
  /** Выбранная длительность. null — человек ещё не выбрал. */
  nights: PackageNights | null
  /** Дата вылета из блока «Перелёт». null — не выбрана. */
  startDate: string | null
}>()

const emit = defineEmits<{ pick: [PackageNights] }>()

/** Варианты списка: «7 ночей · 8 дней». Дни у пакета считаются просто —
 *  города идут подряд, пересечений дат не бывает. */
const options = computed(() =>
  PACKAGES.map((p) => ({ nights: p.nights, label: nightsDays(p.nights, p.nights + 1) })),
)

/** Подпись выбранной длительности. */
const durationLabel = computed(() =>
  props.nights ? nightsDays(props.nights, props.nights + 1) : '',
)

/** Период поездки. null — нет даты вылета или нет длительности. */
const period = computed(() => {
  if (!props.nights || !props.startDate) return null
  return t('calc.tourRange', {
    from: dayMonth(props.startDate),
    to: dayMonth(addDays(props.startDate, props.nights)),
  })
})

function onChange(e: Event) {
  const value = Number((e.target as HTMLSelectElement).value) as PackageNights
  emit('pick', value)
}
</script>

<template>
  <div class="card">
    <label class="row">
      <!-- Не выбрано — призыв к действию во всю строку.
           Выбрано — слева период, справа длительность. -->
      <span v-if="!nights" class="call">{{ t('calc.durationEmpty') }}</span>
      <!-- Даты вылета ещё нет: длительность встаёт слева, на место периода.
           Звать выбрать дату отсюда незачем — этим занят блок «Перелёт». -->
      <span v-else class="period">{{ period ?? durationLabel }}</span>

      <span class="control">
        <span v-if="nights && period" class="value">{{ durationLabel }}</span>
        <!-- Нативный список поверх строки: он открывается системным колесом
             на iPad и iPhone, работает офлайн и доступен с клавиатуры.
             Свою выпадашку здесь городить незачем. -->
        <select class="select" :value="nights ?? ''" @change="onChange">
          <option v-if="!nights" value="" disabled>{{ t('calc.durationEmpty') }}</option>
          <option v-for="o in options" :key="o.nights" :value="o.nights">{{ o.label }}</option>
        </select>
        <span class="chev chev-down muted" aria-hidden="true">⌄</span>
      </span>
    </label>
  </div>
</template>

<style scoped>
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
  padding: 0 12px;
}

/* Строка держит общий токен высоты — как счётчик людей и «Перелёт» */
.row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: var(--row-height);
  text-align: left;
}

/* Ничего не выбрано — строка зовёт к действию */
.call {
  font-size: 16px;
  font-weight: 600;
  color: var(--accent-strong);
}

/* Период поездки: главный ответ строки, поэтому обычным цветом */
.period {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  min-width: 0;
}

.control {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.value {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}

/* Сам список прозрачный и растянут на всю строку: тап в любое место
   строки открывает выбор, а видимый текст рисуют .value и .period. */
.select {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  appearance: none;
  -webkit-appearance: none;
  font: inherit;
}
</style>

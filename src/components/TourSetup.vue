<script setup lang="ts">
// Длительность тура: выпадающий список и период поездки под ним.
//
// Нативный список открывается системным колесом на iPad и iPhone, работает
// офлайн и доступен с клавиатуры. Своя реализация выпадашки не даёт здесь
// ничего, кроме риска.
//
// Даты вылета ЗДЕСЬ НЕТ: она живёт в блоке «Перелёт». Человек сначала решает,
// когда летит, и только потом — сколько живёт. Решение заказчика 22.08.2026.
import { computed } from 'vue'
import { PACKAGES, type PackageNights } from '@/data'
import { count, t } from '@/composables/useI18n'
import { addDays, dayMonth, nightsDays } from '@/composables/dates'

const props = defineProps<{
  nights: PackageNights
  /** Дата вылета — приходит из блока «Перелёт», здесь только читается. */
  startDate: string
}>()

const emit = defineEmits<{ pick: [PackageNights] }>()

/** Варианты списка: «7 ночей · 8 дней». Дни у пакета считаются просто —
 *  города идут подряд, пересечений дат не бывает. */
const options = computed(() =>
  PACKAGES.map((p) => ({ nights: p.nights, label: nightsDays(p.nights, p.nights + 1) })),
)

/** День возвращения: дата вылета плюс все ночи тура. */
const endDate = computed(() => addDays(props.startDate, props.nights))

function onChange(e: Event) {
  const value = Number((e.target as HTMLSelectElement).value) as PackageNights
  emit('pick', value)
}
</script>

<template>
  <div class="card">
    <label class="row">
      <span class="label">{{ t('calc.durationLabel') }}</span>
      <span class="control">
        <select class="select" :value="nights" @change="onChange">
          <option v-for="o in options" :key="o.nights" :value="o.nights">{{ o.label }}</option>
        </select>
        <span class="chev chev-down muted" aria-hidden="true">⌄</span>
      </span>
    </label>

    <!-- Итоговый период: считается от даты вылета плюс выбранная длительность.
         Человек видит обе границы сразу и сверяет их с отпуском. -->
    <p class="range">
      {{ t('calc.tourRange', { from: dayMonth(startDate), to: dayMonth(endDate) }) }} ·
      {{ count(nights, 'u.night') }} · {{ count(nights + 1, 'u.day') }}
    </p>
  </div>
</template>

<style scoped>
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
  padding: 0 12px 10px;
}

/* Строка держит общий токен высоты — как счётчик людей и «Перелёт» */
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: var(--row-height);
  text-align: left;
}

.label {
  font-size: 16px;
  font-weight: 600;
}

.control {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

/* Нативный список без системной рамки: рамку рисуем сами, стрелку тоже —
   иначе на iOS и в Chrome он выглядит по-разному. */
.select {
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  border: 0;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  padding: 0 2px 0 0;
  min-height: var(--tap-min);
  text-align: right;
  text-align-last: right;
}

/* Период — не подпись к списку, а результат: кегль тот же, что у строк,
   цвет обычный. Приглушать его нельзя, это главный ответ блока. */
.range {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  margin: 8px 0 0;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}
</style>

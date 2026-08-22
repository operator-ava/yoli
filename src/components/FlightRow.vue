<script setup lang="ts">
import { t } from '@/composables/useI18n'
import { dayMonth } from '@/composables/dates'

// Блок «Перелёт». Рейсов по-прежнему нет, но ЗДЕСЬ ЖЕ живёт дата вылета:
// человек сначала решает, когда летит, и только потом — сколько живёт.
// Сам перелёт на цену не влияет: в расчёте его нет.
defineProps<{
  /** Дата вылета, ISO. null — ещё не выбрана, строка зовёт выбрать. */
  date: string | null
}>()

const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <button class="card row tap" @click="emit('open')">
    <span class="icon" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 3.4c1.1 0 2 1.5 2.1 3.4v4.4l10.5 5.2v2.2l-10.5-2.6v5.2l3.4 2.2v1.9l-5.5-1.4-5.5 1.4v-1.9l3.4-2.2v-5.2L3.4 18.6v-2.2l10.5-5.2V6.8C14 4.9 14.9 3.4 16 3.4Z"
          stroke="var(--brand-graphite)"
          stroke-width="1.6"
          stroke-linejoin="round"
        />
      </svg>
    </span>

    <!-- Два состояния. Дата не выбрана — строка зовёт к действию.
         Выбрана — показывает результат, и это главное, что здесь решено. -->
    <span class="col">
      <template v-if="date">
        <span class="name">{{ t('flight.rowPicked') }}</span>
        <span class="date">{{ dayMonth(date) }}</span>
      </template>
      <span v-else class="name call">{{ t('flight.rowEmpty') }}</span>
    </span>

    <span class="meta muted">
      <span class="chev chev-next chev-mid" aria-hidden="true">›</span>
    </span>
  </button>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: var(--row-height);
  padding: 8px 12px 8px 8px;
  text-align: left;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
}

/* Тот же размер, что фото города в строке без дат */
.icon {
  width: var(--row-thumb);
  height: var(--row-thumb);
  border-radius: var(--radius-sm);
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon svg {
  width: 30px;
  height: 30px;
  display: block;
}

.col {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  column-gap: 8px;
}

.name {
  font-size: 16px;
  font-weight: 600;
}

/* Дата идёт следом за названием через точку-разделитель, а на узком экране
   переносится под него целиком: точка уезжает вместе с датой и не повисает
   на конце первой строки. */
.date {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}

/* Дата не выбрана — строка зовёт к действию, поэтому акцентный цвет.
   Разделителя здесь нет: показывать нечего. */
.call {
  color: var(--accent-strong);
}

/* Остался только шеврон: подпись «Скоро» убрана решением заказчика.
   Стрелка стоит одна против строки-блока — отсюда модификатор chev-mid. */
.meta {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  font-size: 14px;
}
</style>

<script setup lang="ts">
import { t } from '@/composables/useI18n'

// Заглушка «Перелёт». Оформлена как карточка города без дат, но на цену
// и на расчёт не влияет никак: в сторе её нет, в calc.ts тоже.
// Подпись «Скоро» обязательна — ожидание задаётся до нажатия, иначе человек
// нажмёт в расчёте на выбор рейсов и получит извинение.
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

    <span class="col">
      <span class="name">{{ t('flight.row') }}</span>
    </span>

    <!-- Подпись и шеврон в одной строке: стрелка садится на её базовую линию -->
    <span class="meta muted">
      {{ t('flight.soon') }}<span class="chev chev-next" aria-hidden="true">›</span>
    </span>
  </button>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 12px 8px 8px;
  text-align: left;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
}

/* Тот же размер, что фото города в строке без дат */
.icon {
  width: 56px;
  height: 56px;
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
}

.name {
  font-size: 16px;
  font-weight: 600;
}

/* Приглушено намеренно: это не призыв к действию, а обещание на будущее */
.meta {
  flex-shrink: 0;
  font-size: 14px;
  white-space: nowrap;
}

.meta .chev {
  margin-left: 6px;
}
</style>

<script setup lang="ts">
// Лист «Питание»: принцип, а не расписание.
//
// Раньше здесь по дням расписывались приёмы пищи и кухня каждого. На туре
// в 15 ночей это превращалось в простыню, а ужина в ней не было вовсе.
// Решение заказчика 22.08.2026: расписание убрано, вместо него три блока
// по приёмам пищи и общий блок про кухни.
//
// Приёмов пищи ТРИ на всех тарифах: завтрак, обед и ужин.
// Конкретные заведения по-прежнему не называются — это правило «категория
// вместо названия», раздел 5 РЕШЕНИЙ.
import { computed } from 'vue'
import { levelName, MEALS, type Level } from '@/data'
import { t } from '@/composables/useI18n'

const props = defineProps<{
  level: Level
  selectedLevel: Level | null
}>()

const emit = defineEmits<{ choose: [Level]; close: [] }>()

/** Три приёма пищи с описанием для выбранного тарифа.
 *  Именно computed, а не разовый map: иначе при смене языка на открытом
 *  листе тексты остались бы на прежнем. */
const meals = computed(() =>
  MEALS.map((m) => ({
    key: m.key,
    title: t(m.titleKey),
    text: t(m.textKey[props.level]),
  })),
)
</script>

<template>
  <div class="body">
    <header class="head">
      <div>
        <h2 class="title">{{ t('meal.title2') }}</h2>
        <p class="sub muted">{{ t('sheet.tariff', { name: levelName(level) }) }}</p>
      </div>
      <button class="close" :aria-label="t('sheet.close')" @click="emit('close')">✕</button>
    </header>

    <div class="scroll">
      <!-- Сколько приёмов пищи в день. Одинаково на всех тарифах, различается
           только уровень заведений — про него говорит каждый блок ниже. -->
      <div class="format">
        <div class="format-count">{{ t('meal.threeADay') }}</div>
      </div>

      <!-- Три блока: завтрак, обед, ужин -->
      <section v-for="m in meals" :key="m.key" class="meal">
        <h3 class="meal-title">{{ m.title }}</h3>
        <p class="meal-text">{{ m.text }}</p>
      </section>

      <!-- Кухни — общий блок, один для всех тарифов -->
      <section class="cuisines">
        <h3 class="meal-title">{{ t('meal.cuisines.title') }}</h3>
        <p class="meal-text">{{ t('meal.cuisines.text') }}</p>
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

.format-count { font-size: 15px; font-weight: 600 }

/* Приёмы пищи идут блоками с воздухом: заголовок и абзац, без разлиновки */
.meal {
  margin-top: 18px;
}

.meal-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 6px;
}

.meal-text {
  font-size: 14px;
  line-height: 1.55;
  margin: 0;
}

/* Кухни — общий блок, отделён линией: он не про уровень, а про поездку */
.cuisines {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.note {
  font-size: 12px;
  line-height: 1.4;
  margin: 16px 0 0;
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

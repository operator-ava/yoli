<script setup lang="ts">
import { ref } from 'vue'
import { t } from '@/composables/useI18n'
import { dayMonth } from '@/composables/dates'
import BottomSheet from '@/components/BottomSheet.vue'
import StartDateSheet from '@/components/StartDateSheet.vue'

// Экран «Перелёт». Сверху — ДАТА ВЫЛЕТА, ниже прежний текст «скоро»:
// рейсов нет, сроков не обещаем. Дата живёт здесь, потому что человек
// сначала решает, когда летит, и только потом — сколько живёт.
//
// Расчёт при закрытии не трогается — экран только накрывает его сверху.
const props = defineProps<{
  /** Дата вылета, ISO. null — ещё не выбрана. */
  date: string | null
  /** Длительность тура: календарь показывает, когда человек вернётся.
   *  null — длительность тоже ещё не выбрана. */
  nights: number | null
}>()

const emit = defineEmits<{ close: []; pick: [string] }>()

// Календарь поверх экрана. Лист лежит выше полноэкранных экранов — см.
// z-index в BottomSheet.
const calendar = ref(false)

function apply(iso: string) {
  emit('pick', iso)
  calendar.value = false
}

const PARAGRAPHS = ['flight.p1', 'flight.p2', 'flight.p3']
</script>

<template>
  <div class="screen" role="dialog" aria-modal="true" :aria-label="t('flight.title')">
    <!-- Крестик в углу: выход виден сразу, до чтения текста -->
    <button class="close" :aria-label="t('sheet.close')" @click="emit('close')">✕</button>

    <div class="scroll">
      <div class="inner">
        <!-- Дата вылета — первое, что человек решает на этом экране -->
        <section class="when">
          <h2 class="when-title">{{ t('flight.when') }}</h2>
          <!-- Дата не выбрана — на её месте кнопка выбора: показывать
               нечего, и звать надо прямо. -->
          <div v-if="props.date" class="when-row">
            <span class="when-date">{{ dayMonth(props.date) }}</span>
            <button class="change" @click="calendar = true">{{ t('calc.change') }}</button>
          </div>
          <button v-else class="pick" @click="calendar = true">
            {{ t('flight.pickDate') }}
          </button>
          <p class="when-note muted">{{ t('flight.whenNote') }}</p>
        </section>

        <hr class="sep" />

        <!-- Контурный самолёт: графитовый контур, жёлтые акценты.
             Ширина ограничена, поэтому рисунок не растягивается на планшете. -->
        <svg class="plane" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <!-- След за законцовками крыла -->
          <path
            d="M28 166v34M292 166v34"
            stroke="var(--brand-yellow)"
            stroke-width="4"
            stroke-linecap="round"
            stroke-dasharray="2 10"
          />
          <!-- Силуэт: вид сверху, нос вверх, симметрично относительно x=160 -->
          <path
            d="M160 14c6.6 0 11 10 12 28v34l120 54v18l-120-28v38l34 20v12l-34-10-4 16q-8 4-16 0l-4-16-34 10v-12l34-20v-38L28 148v-18l120-54V42c1-18 5.4-28 12-28Z"
            stroke="var(--brand-graphite)"
            stroke-width="3"
            stroke-linejoin="round"
          />
          <!-- Двигатели и полоса иллюминаторов — жёлтым -->
          <circle cx="80" cy="121" r="7" fill="var(--brand-yellow)" />
          <circle cx="240" cy="121" r="7" fill="var(--brand-yellow)" />
          <path
            d="M160 50v22"
            stroke="var(--brand-yellow)"
            stroke-width="5"
            stroke-linecap="round"
          />
        </svg>

        <h1 class="title">{{ t('flight.title') }}</h1>

        <p v-for="key in PARAGRAPHS" :key="key" class="line">{{ t(key) }}</p>

        <p class="sign">{{ t('flight.footer') }}</p>
      </div>
    </div>

    <footer class="foot">
      <button class="btn" @click="emit('close')">{{ t('flight.back') }}</button>
    </footer>

    <!-- Тот же календарь, что выбирал дату начала тура: одна дата, прошедшие
         дни погашены. Лежит поверх этого экрана. -->
    <BottomSheet v-if="calendar" @close="calendar = false">
      <StartDateSheet
        :value="props.date"
        :nights="props.nights"
        @apply="apply"
        @close="calendar = false"
      />
    </BottomSheet>
  </div>
</template>

<style scoped>
.screen {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  padding-top: var(--safe-top);
}

.close {
  position: absolute;
  top: calc(8px + var(--safe-top));
  right: calc(12px + var(--safe-right));
  width: 44px;
  height: 44px;
  min-height: 44px;
  border-radius: 50%;
  background: var(--card);
  border: 1px solid var(--border);
  font-size: 17px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0 calc(20px + var(--safe-right)) 24px calc(20px + var(--safe-left));
}

.inner {
  max-width: 640px;
  margin-inline: auto;
  /* Отступ сверху держит крестик: он стоит в углу и не должен накрывать
     заголовок «Дата вылета». */
  padding-top: 60px;
}

/* Блок даты вылета: первое решение на экране, поэтому стоит выше рисунка */
.when-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 10px;
}

.when-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: var(--tap-min);
}

/* Дата крупно: это ответ, а не подпись */
.when-date {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.change {
  flex-shrink: 0;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  background: var(--brand-yellow);
  font-size: 15px;
  font-weight: 600;
}

/* Кнопка выбора вместо даты: то же место, тот же вес, но зовёт к действию */
.pick {
  width: 100%;
  min-height: var(--tap-min);
  border-radius: var(--radius-sm);
  background: var(--brand-yellow);
  font-size: 16px;
  font-weight: 600;
}

.when-note {
  font-size: 13px;
  line-height: 1.45;
  margin: 6px 0 0;
}

.sep {
  border: 0;
  border-top: 1px solid var(--border);
  margin: 22px 0;
}

/* Рисунок лёгкий и без подложки: занимает верх экрана, но не давит */
.plane {
  display: block;
  width: 100%;
  max-width: 300px;
  height: auto;
  margin: 0 auto 20px;
}

.title {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin: 0 0 20px;
}

.line {
  font-size: 15px;
  line-height: 1.55;
  margin: 0 0 14px;
}

/* Завершающая строка — тем же оранжевым, что другие акценты интерфейса */
.sign {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.45;
  color: var(--accent-strong);
  border-top: 1px solid var(--border);
  padding-top: 18px;
  margin: 24px 0 0;
}

.foot {
  flex-shrink: 0;
  background: var(--card);
  border-top: 1px solid var(--border);
  padding: 12px calc(20px + var(--safe-right)) calc(12px + var(--safe-bottom))
    calc(20px + var(--safe-left));
}

.btn {
  display: block;
  width: 100%;
  max-width: 640px;
  margin-inline: auto;
  min-height: var(--tap-min);
  border-radius: var(--radius-sm);
  border: 1px solid var(--brand-yellow);
  background: var(--brand-yellow);
  font-size: 16px;
  font-weight: 600;
}

@media (min-width: 700px) {
  .inner {
    padding-top: 64px;
  }

  .plane {
    max-width: 360px;
  }

  .title {
    font-size: 30px;
  }
}
</style>

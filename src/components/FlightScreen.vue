<script setup lang="ts">
import { t } from '@/composables/useI18n'

// Экран «Перелёт — скоро». Рейсов нет, сроков не обещаем: только «скоро».
// Расчёт при закрытии не трогается — экран только накрывает его сверху.
const emit = defineEmits<{ close: [] }>()

const PARAGRAPHS = ['flight.p1', 'flight.p2', 'flight.p3']
</script>

<template>
  <div class="screen" role="dialog" aria-modal="true" :aria-label="t('flight.title')">
    <!-- Крестик в углу: выход виден сразу, до чтения текста -->
    <button class="close" :aria-label="t('sheet.close')" @click="emit('close')">✕</button>

    <div class="scroll">
      <div class="inner">
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
  padding-top: 44px;
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

<script setup lang="ts">
import { t } from '@/composables/useI18n'

// Экран после нажатия «Оплатить». Реальной оплаты нет — это макет.
// Расчёт при закрытии не сбрасывается: экран только накрывает его сверху.
const emit = defineEmits<{ close: [] }>()

const PARAGRAPHS = ['paid.p1', 'paid.p2', 'paid.p3']
</script>

<template>
  <div class="screen" role="dialog" aria-modal="true" :aria-label="t('paid.title')">
    <!-- Крестик в углу: выход виден сразу, до чтения текста -->
    <button class="close" :aria-label="t('sheet.close')" @click="emit('close')">✕</button>

    <div class="scroll">
      <div class="inner">
        <div class="mark" aria-hidden="true">✓</div>
        <h1 class="title">{{ t('paid.title') }}</h1>

        <p v-for="key in PARAGRAPHS" :key="key" class="line">{{ t(key) }}</p>

        <p class="sign">{{ t('paid.footer') }}</p>
      </div>
    </div>

    <footer class="foot">
      <button class="btn" @click="emit('close')">{{ t('paid.back') }}</button>
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

/* Крестик поверх текста, в правом верхнем углу */
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
  padding-top: 56px;
}

/* Фирменный знак согласия: жёлтый круг с галочкой */
.mark {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--brand-yellow);
  color: var(--text);
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
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

/* Завершающая строка: спокойно, без восклицаний, тем же оранжевым,
   что и другие акценты интерфейса */
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

/* На широком экране текст не растягивается на всю ширину */
@media (min-width: 700px) {
  .inner {
    padding-top: 72px;
  }

  .title {
    font-size: 30px;
  }
}
</style>

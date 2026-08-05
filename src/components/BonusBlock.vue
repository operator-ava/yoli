<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { BONUSES, type Level } from '@/data'
import { t } from '@/composables/useI18n'

// Блок «В подарок». Без иконок и эмодзи — только название и объём.
const props = defineProps<{ level: Level }>()

const box = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)
const height = ref<string>('auto')

// При смене тарифа список меняется на месте с короткой анимацией высоты —
// видно, что именно прибавилось.
watch(
  () => props.level,
  async () => {
    if (!box.value || !inner.value) return
    height.value = box.value.offsetHeight + 'px'
    await nextTick()
    const target = inner.value.offsetHeight
    requestAnimationFrame(() => {
      height.value = target + 'px'
      setTimeout(() => (height.value = 'auto'), 240)
    })
  },
)
</script>

<template>
  <div class="gift">
    <div class="cap">{{ t('bonus.title') }}</div>
    <div ref="box" class="box" :style="{ height }">
      <div ref="inner">
        <div v-for="b in BONUSES[level]" :key="b.nameKey" class="row">
          <span>{{ t(b.nameKey) }}</span>
          <span class="amount">{{ t(b.amountKey) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gift {
  background: var(--brand-yellow-soft);
  border-radius: var(--radius-sm);
  padding: 10px 12px 12px;
  margin-top: 12px;
}

.cap {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.box {
  overflow: hidden;
  transition: height 0.22s ease;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 13px;
  padding: 3px 0;
}

.amount {
  font-weight: 600;
  white-space: nowrap;
}
</style>

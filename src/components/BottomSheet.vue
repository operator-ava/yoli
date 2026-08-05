<script setup lang="ts">
import { ref } from 'vue'

// Нижний лист: закрывается тапом по фону и свайпом вниз.
const emit = defineEmits<{ close: [] }>()

const dragY = ref(0)
const startY = ref<number | null>(null)

function onStart(e: TouchEvent) {
  startY.value = e.touches[0].clientY
}

function onMove(e: TouchEvent) {
  if (startY.value === null) return
  const dy = e.touches[0].clientY - startY.value
  // Тянем только вниз.
  dragY.value = Math.max(0, dy)
}

function onEnd() {
  // Утянули больше чем на 90 px — закрываем.
  if (dragY.value > 90) emit('close')
  dragY.value = 0
  startY.value = null
}
</script>

<template>
  <div class="backdrop" @click.self="emit('close')">
    <div
      class="sheet"
      :style="{ transform: `translateY(${dragY}px)` }"
      @touchstart.passive="onStart"
      @touchmove.passive="onMove"
      @touchend="onEnd"
    >
      <div class="grabber" aria-hidden="true" />
      <slot />
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(24, 24, 24, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.sheet {
  background: var(--card);
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-width: 720px;
  max-height: 88dvh;
  display: flex;
  flex-direction: column;
  padding: 6px calc(16px + var(--safe-left)) calc(12px + var(--safe-bottom))
    calc(16px + var(--safe-right));
  overscroll-behavior: contain;
  transition: transform 0.12s ease-out;
}

.grabber {
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  margin: 4px auto 8px;
  flex-shrink: 0;
}
</style>

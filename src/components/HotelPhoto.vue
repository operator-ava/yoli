<script setup lang="ts">
// Фирменная заглушка вместо фото размещения.
// Реальных фотографий отелей у нас нет, чужие снимки отелей не берём.
// Знак берётся из фирменного файла, а не рисуется заново.
defineProps<{ stars: number }>()
</script>

<template>
  <svg class="ph" viewBox="0 0 320 180" role="img" :aria-label="`${stars} звёзд`">
    <rect width="320" height="180" fill="#F0F0F0" />
    <image href="/brand/mark.webp" x="130" y="42" width="60" height="60" />
    <text
      x="160"
      y="130"
      text-anchor="middle"
      font-family="Inter, sans-serif"
      font-size="18"
      font-weight="700"
      fill="#1A1A1A"
    >
      {{ stars }}★
    </text>
  </svg>
</template>

<style scoped>
.ph {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-sm);
}
</style>

<script setup lang="ts">
import BottomNav from '@/components/BottomNav.vue'
</script>

<template>
  <!-- Каркас: прокручиваемый экран сверху, постоянный бар снизу -->
  <RouterView />
  <BottomNav />
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
</script>

<template>
  <!-- Каркас: шапка, прокручиваемый экран, постоянный нижний бар -->
  <AppHeader />
  <RouterView />
  <BottomNav />
</template>

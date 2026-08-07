<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import UpdateBanner from '@/components/UpdateBanner.vue'
</script>

<template>
  <!-- Каркас: шапка, прокручиваемый экран, постоянный нижний бар -->
  <AppHeader />
  <RouterView />
  <!-- Плашка обновления стоит в потоке: ничего не перекрывает -->
  <UpdateBanner />
  <BottomNav />
</template>

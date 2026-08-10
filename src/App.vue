<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import CalcView from '@/views/CalcView.vue'
</script>

<template>
  <!-- Каркас: шапка и единственный экран — расчёт.
       Витрины и нижний бар убраны решением заказчика, данные витрин
       оставлены в /src/data/showcase.ts до их возвращения. -->
  <AppHeader />
  <CalcView />
</template>

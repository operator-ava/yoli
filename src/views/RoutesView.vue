<script setup lang="ts">
import ShowcaseList from '@/components/ShowcaseList.vue'
import { ROUTE_CARDS } from '@/data'
</script>

<template>
  <ShowcaseList
    title="Маршруты"
    note="Точки из программы. Полные описания готовятся."
    :cards="ROUTE_CARDS"
  />
</template>

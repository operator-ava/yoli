<script setup lang="ts">
import ShowcaseList from '@/components/ShowcaseList.vue'
import { FOOD_CARDS } from '@/data'
</script>

<template>
  <ShowcaseList
    title="Питание"
    note="Питание по городам маршрута. Меню — после согласования."
    :cards="FOOD_CARDS"
  />
</template>

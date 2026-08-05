<script setup lang="ts">
import ShowcaseList from '@/components/ShowcaseList.vue'
import { FOOD_CARDS } from '@/data'
</script>

<template>
  <ShowcaseList title-key="showcase.food.title" note-key="showcase.food.note" :cards="FOOD_CARDS" />
</template>

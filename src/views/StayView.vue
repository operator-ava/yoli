<script setup lang="ts">
import ShowcaseList from '@/components/ShowcaseList.vue'
import { STAY_CARDS } from '@/data'
</script>

<template>
  <ShowcaseList
    title="Проживание"
    note="Категории размещения по городам. Отели — после согласования."
    :cards="STAY_CARDS"
  />
</template>

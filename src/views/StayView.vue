<script setup lang="ts">
import ShowcaseList from '@/components/ShowcaseList.vue'
import { STAY_CARDS } from '@/data'
</script>

<template>
  <ShowcaseList title-key="showcase.stay.title" note-key="showcase.stay.note" :cards="STAY_CARDS" />
</template>

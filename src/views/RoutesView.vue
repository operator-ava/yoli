<script setup lang="ts">
import ShowcaseList from '@/components/ShowcaseList.vue'
import { ROUTE_CARDS } from '@/data'
</script>

<template>
  <ShowcaseList title-key="showcase.routes.title" note-key="showcase.routes.note" :cards="ROUTE_CARDS" />
</template>

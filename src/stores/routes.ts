import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { routes as routesData, type Poi, type Route } from '@/data'

/** Хранилище маршрутов и текущего прохождения. */
export const useRoutesStore = defineStore('routes', () => {
  // Контент читаем из /src/data, в хранилище только состояние.
  const routes = ref<Route[]>(routesData)
  const activeRouteId = ref<string | null>(null)
  const activePoiId = ref<string | null>(null)

  const activeRoute = computed<Route | null>(
    () => routes.value.find((r) => r.id === activeRouteId.value) ?? null,
  )

  const activePoi = computed<Poi | null>(
    () => activeRoute.value?.pois.find((p) => p.id === activePoiId.value) ?? null,
  )

  function startRoute(routeId: string) {
    const route = routes.value.find((r) => r.id === routeId)
    if (!route) return
    activeRouteId.value = route.id
    // Ведём с первой точки по порядку.
    activePoiId.value = [...route.pois].sort((a, b) => a.order - b.order)[0]?.id ?? null
  }

  function stopRoute() {
    activeRouteId.value = null
    activePoiId.value = null
  }

  return { routes, activeRouteId, activePoiId, activeRoute, activePoi, startRoute, stopRoute }
})

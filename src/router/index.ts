import { createRouter, createWebHistory } from 'vue-router'
import RoutesView from '@/views/RoutesView.vue'

// history mode — офлайн-фолбэк на index.html настроен в vite.config.ts
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'routes', component: RoutesView, meta: { title: 'Маршруты' } },
    {
      path: '/map',
      name: 'map',
      component: () => import('@/views/MapView.vue'),
      meta: { title: 'Карта' },
    },
    {
      path: '/guide',
      name: 'guide',
      component: () => import('@/views/GuideView.vue'),
      meta: { title: 'Гид' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { title: 'Профиль' },
    },
    // Неизвестный адрес возвращаем на список маршрутов.
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router

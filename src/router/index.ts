import { createRouter, createWebHistory } from 'vue-router'
import CalcView from '@/views/CalcView.vue'

// history mode — офлайн-фолбэк на index.html настроен в vite.config.ts
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Главная — расчёт, ядро продукта.
    { path: '/', name: 'calc', component: CalcView, meta: { title: 'Расчёт' } },
    {
      path: '/routes',
      name: 'routes',
      component: () => import('@/views/RoutesView.vue'),
      meta: { title: 'Маршруты' },
    },
    {
      path: '/stay',
      name: 'stay',
      component: () => import('@/views/StayView.vue'),
      meta: { title: 'Проживание' },
    },
    {
      path: '/food',
      name: 'food',
      component: () => import('@/views/FoodView.vue'),
      meta: { title: 'Питание' },
    },
    // Неизвестный адрес возвращаем на расчёт.
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router

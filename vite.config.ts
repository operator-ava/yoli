import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    vue(),
    VitePWA({
      // Сервис-воркер обновляется сам, без запроса подтверждения у пользователя.
      registerType: 'autoUpdate',
      // Иконки лежат в public/ — добавляем их в precache явно.
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'brand/*.webp', 'photos/cities/*.webp'],
      manifest: {
        name: 'YOLI',
        short_name: 'YOLI',
        description: 'Расчёт стоимости путешествия по Узбекистану',
        lang: 'ru',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        theme_color: '#FFE52A',
        background_color: '#F5F5F7',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache всей собранной статики.
        globPatterns: ['**/*.{js,css,html,png,ico,woff,woff2}'],
        // Фотобанк точек тяжёлый — в precache не кладём, кешируем по факту показа.
        globIgnores: ['**/photos/poi/**'],
        // Офлайн-фолбэк: любой навигационный запрос отдаёт index.html из кеша.
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})

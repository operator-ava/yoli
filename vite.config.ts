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
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Живой гид',
        short_name: 'Гид',
        description: 'Живой гид-сопровождающий по маршрутам',
        lang: 'ru',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        theme_color: '#14171C',
        background_color: '#14171C',
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
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
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

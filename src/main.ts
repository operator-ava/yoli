import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Inter локально: без Google CDN, иначе шрифт отвалится офлайн
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './styles/global.css'
import App from './App.vue'

// Экран один — роутер не нужен. Офлайн-фолбэк на index.html остаётся
// в vite.config.ts: любой адрес отдаёт то же приложение.
createApp(App).use(createPinia()).mount('#app')

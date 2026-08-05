import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Inter локально: без Google CDN, иначе шрифт отвалится офлайн
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './styles/global.css'
import App from './App.vue'
import router from './router'

createApp(App).use(createPinia()).use(router).mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import 'virtual:uno.css'
import App from './App.vue'
import router from './router'
import { installI18n } from './i18n'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
installI18n(app)
app.mount('#app')

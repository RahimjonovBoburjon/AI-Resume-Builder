import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { initAuth } from './utils/auth'

const app = createApp(App)

initAuth().then(() => {
  app.use(router)
  app.mount('#app')
})

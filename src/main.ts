import { createApp } from 'vue'
import App from './App.vue'
import 'vant/es/toast/style'
import './style/index.scss'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import 'vant/es/toast/style'
import router from './router'
import { Button } from 'vant';

const app = createApp(App)
app.use(Button)
app.use(router)
app.mount('#app')

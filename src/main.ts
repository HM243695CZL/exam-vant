import { createApp } from 'vue'
import App from './App.vue'
import 'vant/es/toast/style'
import './style/index.scss'
import router from './router'

import NoData from './components/NoData/index.vue';

const app = createApp(App)
app.use(router).component('NoData', NoData)
app.mount('#app')

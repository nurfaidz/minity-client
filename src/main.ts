import { createApp } from 'vue'
import './index.css'
import App from './App.vue'

import { VueQueryPlugin } from '@tanstack/vue-query'
import router from './routes'

const app = createApp(App)
app.use(VueQueryPlugin)

// register route
app.use(router);

app.mount('#app')
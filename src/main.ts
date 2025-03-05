import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { storePlugin } from 'pinia-plugin-store';

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
const plugin = storePlugin({
    stores: ['calendar', 'actionVersions', 'runnerImages'], // 需要持久化的 store 名称
    storage: localStorage, // 使用 localStorage 进行持久化
});
pinia.use(plugin)


app.use(pinia)
app.use(router)

app.mount('#app')

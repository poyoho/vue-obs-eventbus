import { createApp } from 'vue'
import App from './App.vue'
import { EventBusDevToolsVue3Plugin } from "vue-obs-eventbus"

createApp(App).use(EventBusDevToolsVue3Plugin).mount('#app')

createApp(App).use(EventBusDevToolsVue3Plugin).mount('#app2')

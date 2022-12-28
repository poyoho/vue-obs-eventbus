import { createApp } from 'vue'
import App from './App.vue'
import { createEventBusDevToolsPlugin } from "vue-obs-eventbus"

const eventbus = createEventBusDevToolsPlugin()

createApp(App).use(eventbus).mount('#app')

createApp(App).use(eventbus).mount('#app2')

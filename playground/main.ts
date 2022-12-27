import { createApp } from 'vue'
import App from './App.vue'
import { createEventBus } from "vue-obs-eventbus"

const eventbus = createEventBus()

createApp(App).use(eventbus).mount('#app')

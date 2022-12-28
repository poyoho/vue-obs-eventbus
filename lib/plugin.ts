import type { Plugin, App } from 'vue-demi'
import { eventBus } from "./eventbus"
import { createDevToolsReporter, setupEventBusDevTools } from "./devtools"
import { IS_CLIENT } from "./utils"

export function createEventBusDevToolsPlugin(): Plugin {
  return {
    async install(app: App) {
      if (__DEV__ && IS_CLIENT) {
        eventBus._reporter = await createDevToolsReporter({
          id: 'vue-obs-eventbus',
          label: 'EventBus 🚗',
          app
        })
        console.log(eventBus)
        setupEventBusDevTools(eventBus._reporter)
      }
    }
  }
}

export const EventBusDevToolsVue2Plugin: Plugin = (_Vue) => {
  _Vue.mixin({
    async beforeCreate () {
      // is root components
      if (__DEV__ && IS_CLIENT && this.$options.eventbus) {
        eventBus._reporter = await createDevToolsReporter({
          id: 'vue-obs-eventbus',
          label: 'EventBus 🚗',
          app: this
        })
        setupEventBusDevTools(eventBus._reporter)
      }
    }
  })
}

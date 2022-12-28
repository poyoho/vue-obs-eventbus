import type { Plugin, App } from 'vue-demi'
import { eventBus } from "./eventbus"
import { registerEventBusDevtools } from "./devtools"
import { IS_CLIENT } from "./utils"

export function createEventBusDevToolsPlugin(): Plugin {
  return {
    install(app: App) {
      if (__DEV__ && IS_CLIENT) {
        registerEventBusDevtools(app, eventBus)
      }
    }
  }
}

export const EventBusDevToolsVue2Plugin: Plugin = (_Vue) => {
  _Vue.mixin({
    beforeCreate() {
      // is root components
      if (__DEV__ && IS_CLIENT && this.$options.eventbus) {
        registerEventBusDevtools(this, eventBus)
      }
    }
  })
}

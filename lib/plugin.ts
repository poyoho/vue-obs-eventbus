import type { Plugin } from 'vue-demi'
import { eventBus } from "./eventbus"
import { registerEventBusDevtools } from "./devtools"
import { IS_CLIENT } from "./utils"

export const EventBusDevToolsVue3Plugin: Plugin = (app) => {
  if (__DEV__ && IS_CLIENT) {
    registerEventBusDevtools(app, eventBus)
  }
}

export const EventBusDevToolsVue2Plugin: Plugin = (_Vue) => {
  let isRegistered = false
  _Vue.mixin({
    beforeCreate() {
      if (__DEV__ && IS_CLIENT && !isRegistered) {
        registerEventBusDevtools(this, eventBus)
        isRegistered = true
      }
    }
  })
}

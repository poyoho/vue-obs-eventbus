import { isVue2, Plugin } from 'vue-demi'
import { eventBus } from "./eventbus"
import { registerEventBusDevtools } from "./devtools"
import { IS_CLIENT } from "./utils"

export function createEventBusDevToolsPlugin(): Plugin {
  return {
    install(app) {
      if (!isVue2) {
        if (__DEV__ && IS_CLIENT) {
          registerEventBusDevtools(app, eventBus)
        }
      }
    },
  }
}
import type { Plugin } from 'vue-demi'
import { EventBus, eventbusSymbol } from "./eventbus"
import { registerEventBusDevtools } from "./devtools"
import { IS_CLIENT } from "./utils"

export const EventBusVuePlugin: Plugin = function(_Vue) {
  _Vue.mixin({
    beforeCreate() {
      const options = this.$options
      if (options.eventbus) {
        const root = options.eventbus as EventBus
        if (!(this as any)._provided) {
          const provideCache = {}
          Object.defineProperty(this, '_provided', {
            get: () => provideCache,
            set: (v) => Object.assign(provideCache, v),
          })
        }
        ;(this as any)._provided[eventbusSymbol as any] = root

        root._app = this as any
        if (__DEV__ && IS_CLIENT) {
          registerEventBusDevtools(root._app, root)
        }
      }
    }
  })
}

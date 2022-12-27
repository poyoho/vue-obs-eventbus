import type { Plugin } from 'vue-demi'
import { EventBus, eventbusSymbol } from "./eventbus"
import { registerEventBusDevtools } from "./devtools"
import { IS_CLIENT } from "./utils"

export const EventBusVuePlugin: Plugin = function(_Vue) {
  _Vue.mixin({
    beforeCreate() {
      const options = this.$options
      if (options.eventbus) {
        const eventbus = options.eventbus as EventBus
        if (!(this as any)._provided) {
          const provideCache = {}
          Object.defineProperty(this, '_provided', {
            get: () => provideCache,
            set: (v) => Object.assign(provideCache, v),
          })
        }
        ;(this as any)._provided[eventbusSymbol as any] = eventbus

        if (!this.$eventbus) {
          this.$eventbus = eventbus
        }

        eventbus._app = this as any
        if (IS_CLIENT) {
          if (__DEV__) {
            registerEventBusDevtools(eventbus._app, eventbus)
          }
        }
      } else if (!this.$eventbus && options.parent && options.parent.$eventbus) {
        this.$eventbus = options.parent.$eventbus
      }
    }
  })
}

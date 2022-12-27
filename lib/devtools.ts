import { EventBus } from './eventbus'
import {
  setupDevtoolsPlugin,
  App as DevtoolsApp
} from "@vue/devtools-api"
import { toastMessage } from "./utils"

const EVENTBUS_LAYER_ID = 'eventbus:mutations'

export function registerEventBusDevtools(app: DevtoolsApp, eventbus: EventBus) {
  setupDevtoolsPlugin({
    id: "vue-obs-eventbus",
    label: "Vue.Obs.EventBus 🚗",
    app,
  }, (api) => {
    if (typeof api.now !== 'function') {
      toastMessage(
        'You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.'
      )
    }

    api.addTimelineLayer({
      id: EVENTBUS_LAYER_ID,
      label: `EventBus 🚗`,
      color: 0x0088ff,
    })
  })
}

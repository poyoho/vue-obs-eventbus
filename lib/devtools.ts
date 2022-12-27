import { EventBus } from './eventbus'
import {
  setupDevtoolsPlugin,
  App as DevtoolsApp
} from "@vue/devtools-api"
import { toastMessage } from "./utils"

const EVENTBUS_LAYER_ID = 'eventbus:mutations'
const INSPECTOR_ID = 'eventbus'

let runningActionId = 0

export function registerEventBusDevtools(app: DevtoolsApp, eventbus: EventBus) {
  setupDevtoolsPlugin({
    id: "vue-obs-eventbus",
    label: "EventBus 🚗",
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

    api.addInspector({
      id: INSPECTOR_ID,
      label: 'EventBus 🚗',
      icon: 'storage',
      treeFilterPlaceholder: 'Search event',
      actions: [],
    })

    api.on.getInspectorState((payload) => {
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        const inspectedStore = eventbus._map

        if (!inspectedStore) {
          // this could be the selected store restored for a different project
          // so it's better not to say anything here
          return
        }

        // if (inspectedStore) {
        //   payload.state = formatStoreForInspectorState(inspectedStore)
        // }
      }
    })

    eventbus.$onActions(({ args, type, onError }) => {
      const now = typeof api.now === 'function' ? api.now.bind(api) : Date.now
      const groupId = runningActionId++

      api.addTimelineEvent({
        layerId: EVENTBUS_LAYER_ID,
        event: {
          time: now(),
          title: '🦍 ' + type.toString(),
          subtitle: 'start',
          data: {
            action: type,
            args,
          },
          groupId,
        },
      })

      onError((err) => {
        api.addTimelineEvent({
          layerId: EVENTBUS_LAYER_ID,
          event: {
            time: now(),
            title: '🦧 ' + type.toString(),
            subtitle: 'error',
            data: {
              action: type,
              args,
              err
            },
            groupId,
          },
        })
      })
    })
  })
}

import { EventBus } from './eventbus'
import type { App as DevtoolsApp } from "@vue/devtools-api"
import { toastMessage } from "./utils"

const EVENTBUS_LAYER_ID = 'eventbus:mutations'
const INSPECTOR_ID = 'eventbus'

let runningActionId = 0

export async function registerEventBusDevtools(app: DevtoolsApp, eventbus: EventBus) {
  const { setupDevtoolsPlugin } = await import('@vue/devtools-api')
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

    // api.on.getInspectorTree((payload) => {
    //   if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
    //     let stores = Array.from(eventbus._map.keys()).map(v => ({
    //       id: v,
    //       label: v
    //     }))

    //     payload.rootNodes = stores
    //   }
    // })

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
            logType: 'error',
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

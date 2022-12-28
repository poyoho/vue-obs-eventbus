import type { App as DevtoolsApp, DevtoolsPluginApi, ExtractSettingsTypes, PluginSettingsItem } from "@vue/devtools-api"
import { EVENTBUS_LAYER_ID } from "./const"
import { toastMessage } from "./utils"

interface DevtoolsPluginOptions {
  id: string
  label: string
  app: DevtoolsApp
}

export interface ResolvedDevToolsReporter {
  now: () => number
  api: DevtoolsPluginApi<ExtractSettingsTypes<Record<string, PluginSettingsItem>>>
}

export function createDevToolsReporter(opts: DevtoolsPluginOptions): Promise<ResolvedDevToolsReporter> {
  return import('@vue/devtools-api').then(({ setupDevtoolsPlugin }) => new Promise((resolve) => {
    const { id, label, app } = opts
    setupDevtoolsPlugin({ id, label, app }, (api) => {
      if (typeof api.now !== 'function') {
        toastMessage(
          'You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.'
        )
      }
      const now = typeof api.now === 'function' ? api.now.bind(api) : Date.now
      resolve({
        api,
        now
      })
    })
  }))
}

export function setupEventBusDevTools(reporter: ResolvedDevToolsReporter) {
  reporter.api.addTimelineLayer({
    id: EVENTBUS_LAYER_ID,
    label: 'EventBus 🚗',
    color: 0x0088ff,
  })
}

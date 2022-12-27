import type { Emitter, EventType } from "./eventbus"

type Events = Record<EventType, unknown>

// @ts-ignore
declare module 'vue/types/vue' {
  interface Vue {
    $eventbus: Emitter<Events>
  }
}

// @ts-ignore
declare module 'vue/types/options' {
  interface ComponentOptions {
    eventbus?: Emitter<Events>
  }
}

// @ts-ignore
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $eventbus: Emitter<Events>
  }
}

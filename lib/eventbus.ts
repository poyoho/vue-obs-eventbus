import { App, getCurrentInstance, InjectionKey, isVue2 } from 'vue-demi'
import { registerEventBusDevtools } from './devtools';
import { IS_CLIENT } from './utils';

export type EventType = string | symbol;

export type Handler<T = unknown> = (event: T) => void;
export type WildcardHandler<T = Record<string, unknown>> = (
  type: keyof T,
  event: T[keyof T]
) => void;

export type EventHandlerList<T = unknown> = Array<Handler<T>>;
export type WildCardEventHandlerList<T = Record<string, unknown>> = Array<WildcardHandler<T>>;

export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
  keyof Events,
  EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>;

export interface Emitter<Events extends Record<EventType, unknown>> {
  on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
  off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void;
  emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
  emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void;
}

export interface EventBus<Events extends Record<EventType, unknown> = any> extends Emitter<Events> {
  install: (app: App) => void
  /**
   * App linked to this eventbus instance
   *
   * @internal
   */
  _app: App

  /**
   * Registry of eventbus used by this eventbus.
   *
   * @internal
   */
  _map: Map<string, EventHandlerMap<any>>
}

export const eventbusSymbol = (
  __DEV__ ? Symbol('eventbus') : Symbol()
) as InjectionKey<EventBus>

/**
 * for declare typescript
*/
export function defineEventBus<Events extends Record<EventType, unknown>>(): () => Emitter<Events> {
  function useEventBus() {
    const instance = getCurrentInstance()

    if (__DEV__ && !instance) {
      throw new Error(
        `[🚗]: defineEventBus was called with no active EventBus. Did you forget to install EventBus?\n` +
          `\tconst eventbus = createEventBus()\n` +
          `\tapp.use(eventbus)\n` +
          `This will fail in production.`
      )
    }

    return (instance as any).$eventbus
  }

  return useEventBus
}

export function createEventBus<Events extends Record<EventType, unknown>>(): Emitter<Events> {
  type GenericEventHandler =
    | Handler<Events[keyof Events]>
    | WildcardHandler<Events>;

  let all: EventHandlerMap<Events> = new Map()

  const eventbus: EventBus<Events> = {
    on<Key extends keyof Events>(type: Key, handler: GenericEventHandler) {
      const handlers: Array<GenericEventHandler> | undefined = all.get(type);
      if (handlers) {
        handlers.push(handler)
      } else {
        all.set(type, [handler] as EventHandlerList<Events[keyof Events]>)
      }
    },

    off<Key extends keyof Events>(type: Key, handler?: GenericEventHandler) {
      const handlers: Array<GenericEventHandler> | undefined = all.get(type);
      if (handlers) {
        if (handler) {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        }
        else {
          all.set(type, []);
        }
      }
    },

    emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
      let handlers = all.get(type);
      if (handlers) {
        (handlers as EventHandlerList<Events[keyof Events]>)
          .slice()
          .map((handler) => {
            handler(evt!);
          });
      }
    },

    install(app) {
      if (!isVue2) {
        eventbus._app = app
        app.provide(eventbusSymbol, eventbus)
        app.config.globalProperties.$eventbus = eventbus

        if (__DEV__ && IS_CLIENT) {
          registerEventBusDevtools(app, eventbus)
        }
      }
    },

    // @ts-ignore
    _app: null,

    _map: new Map(),
  }

  return eventbus
}

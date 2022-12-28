import type { ResolvedDevToolsReporter } from "./devtools"
import { EVENTBUS_LAYER_ID } from "./const"

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
  /* @internal */
  name: string
  /* @internal */
  all: EventHandlerMap<any>
  on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
  off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void;
  emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
  emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void;

  $on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
  $off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void;
  $emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
  $emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void;
}

export interface EventBus {
  /**
   * Registry of bus used by this eventbus.
   *
   * @internal
   */
  _map: Map<string, Emitter<any>>

  /**
   * devtools reporter
   *
   * @internal
   */
  _reporter: ResolvedDevToolsReporter
}

/**
 * global eventbus instance
*/
export const eventBus: EventBus = {
  _map: new Map(),

  _reporter: null
}

let runningActionId = 0

export function createEmitter<Events extends Record<EventType, unknown>>(name: string): Emitter<Events> {
  type GenericEventHandler =
    | Handler<Events[keyof Events]>
    | WildcardHandler<Events>

  const all = new Map()

  function on<Key extends keyof Events>(type: Key, handler: GenericEventHandler) {
    const handlers: Array<GenericEventHandler> | undefined = all.get(type);
    if (handlers) {
      handlers.push(handler)
    } else {
      all.set(type, [handler] as EventHandlerList<Events[keyof Events]>)
    }
  }

  function off<Key extends keyof Events>(type: Key, handler?: GenericEventHandler) {
    const handlers: Array<GenericEventHandler> | undefined = all.get(type);
    if (handlers) {
      if (handler) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1);
      }
      else {
        all.set(type, []);
      }
    }
  }

  function emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
    let handlers = all.get(type);
    if (handlers) {
      const groupId = runningActionId++
      console.log(eventBus._reporter.api)
      eventBus._reporter.api.addTimelineEvent({
        layerId: EVENTBUS_LAYER_ID,
        event: {
          time: eventBus._reporter.now(),
          title: '🦍 ' + type.toString(),
          subtitle: 'start',
          data: {
            action: type,
            args: evt,
          },
          groupId,
        },
      })
      try {
        (handlers as EventHandlerList<Events[keyof Events]>)
          .slice()
          .map((handler) => {
            handler(evt!)
          })
      } catch (err: any) {
        eventBus._reporter.api.addTimelineEvent({
          layerId: EVENTBUS_LAYER_ID,
          event: {
            time: eventBus._reporter.now(),
            logType: 'error',
            title: '🦧 ' + type.toString(),
            subtitle: 'error',
            data: {
              action: type,
              args: evt,
              err
            },
            groupId,
          },
        })
        throw err
      }
    }
  }

  const target = {
    name,
    all,

    on,
    off,
    emit,

    $on: on,
    $off: off,
    $emit: emit,
  }

  return target
}

/**
 * for declare typescript
*/
export function createEventBus<Events extends Record<EventType, unknown>>(name: string): Emitter<Events> {
  if (!eventBus._map.has(name)) {
    const emitter = createEmitter(name)
    eventBus._map.set(name, emitter)
  }

  return eventBus._map.get(name)
}

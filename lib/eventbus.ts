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

export type EventBusActionsHandler = (event: {
  type: EventType,
  args: any,
  onError: (err: any) => void
}) => void;

export interface EventBus {
  /**
   * Registry of bus used by this eventbus.
   *
   * @internal
   */
  _map: Map<string, Emitter<any>>

  /**
   * Register a event to listen all the events of the eventbus
  */
  $onActions(handler?: EventBusActionsHandler)

  /**
   * actions
   * @internal
  */
 _actions: EventBusActionsHandler[]
}

/**
 * global eventbus instance
*/
export const eventBus: EventBus = {
  _map: new Map(),
  _actions: [],

  $onActions(handler) {
    this._actions.push(handler)
  },
}

/**
 * for declare typescript
*/
export function defineBus<Events extends Record<EventType, unknown>>(name: string): () => Emitter<Events> {

  function createEmitter<Events extends Record<EventType, unknown>>(): Emitter<Events> {
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
        let collectErrFn = []
        const onActionArgs = {
          type,
          args: evt,
          onError: (fn) => {
            collectErrFn.push(fn)
          }
        }
        eventBus._actions.forEach(onAction => {
          onAction(onActionArgs as any)
        })
        try {
          (handlers as EventHandlerList<Events[keyof Events]>)
            .slice()
            .map((handler) => {
              handler(evt!)
            })
        } catch (err: any) {
          collectErrFn.forEach(fn => fn(err))
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

  function useBus() {
    if (!eventBus._map.has(name)) {
      const emitter = createEmitter()
      eventBus._map.set(name, emitter)
    }

    return eventBus._map.get(name)
  }

  return useBus
}

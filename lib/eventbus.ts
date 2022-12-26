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

export const _map = new Map<string, EventHandlerMap<any>>()

export function createEventBus<Events extends Record<EventType, unknown>>(name: string): Emitter<Events> {
  type GenericEventHandler =
    | Handler<Events[keyof Events]>
    | WildcardHandler<Events>;

  let all!: EventHandlerMap<Events>
  if (_map.has(name)) {
    all = _map.get(name) as EventHandlerMap<Events>
  } else {
    all = new Map()
    _map.set(name, all)
  }

  const target: Emitter<Events> = {
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
    }
  }

  return target
}

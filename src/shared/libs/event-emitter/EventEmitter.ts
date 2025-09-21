import type {EventRecords, Listener} from "./types"

export class EventEmitter<Events extends EventRecords> {
  private listeners: {[K in keyof Events]?: Set<Listener<Events[K]>>} = {}

  on<E extends keyof Events>(event: E, listener: Listener<Events[E]>) {
    const set = this.listeners[event] ?? new Set<Listener<Events[E]>>()
    set.add(listener)
    this.listeners[event] = set

    return () => {
      this.off(event, listener)
    }
  }

  once<E extends keyof Events>(event: E, listener: Listener<Events[E]>) {
    const wrapper = (payload: Events[E]) => {
      listener(payload)
      this.off(event, wrapper)
    }

    this.on(event, wrapper)
  }

  off<E extends keyof Events>(event: E, listener: Listener<Events[E]>) {
    this.listeners[event]?.delete(listener)
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    this.listeners[event]?.forEach((listener) => listener(payload))
  }
}

export type Listener<T = unknown> = (payload: T) => void

export type EventRecords = Record<string, unknown>

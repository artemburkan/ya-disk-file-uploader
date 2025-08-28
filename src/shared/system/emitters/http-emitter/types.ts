import { HttpError } from '@shared/libs/http'
import { EventEmitter } from '@shared/libs/event-emitter'

export type HttpEvents = {
  error: HttpError
}

export type HttpEmitter = EventEmitter<HttpEvents>

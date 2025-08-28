import { EventEmitter } from '@shared/libs/event-emitter'
import type { HttpEvents } from './types'

export const httpEmitter = new EventEmitter<HttpEvents>()

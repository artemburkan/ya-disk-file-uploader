import type { AxiosRequestConfig, Method, AxiosProgressEvent } from 'axios'
import { HttpError } from './HttpError'

export type HttpConfig = AxiosRequestConfig

export type HttpMethod = Method

export type HttpProgressEvent = AxiosProgressEvent

type Response<T> = { data: T; error: null } | { data: null; error: HttpError }

export type HttpResponse<T> = Promise<Response<T>>

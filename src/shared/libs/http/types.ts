import type {
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  AxiosProgressEvent,
} from 'axios'

export type HttpConfig = AxiosRequestConfig
export type HttpMethod = Method
export type HttpResponse<T = unknown, D = unknown> = AxiosResponse<T, D>
export type HttpProgressEvent = AxiosProgressEvent

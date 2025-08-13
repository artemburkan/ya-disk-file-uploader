import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  AxiosProgressEvent,
} from 'axios'

export type HttpClientConfig = AxiosRequestConfig
export type HttpMethod = Method
export type HttpResponse<T = unknown, D = unknown> = AxiosResponse<T, D>
export type HttpUploadProgressEvent = AxiosProgressEvent

export class HttpClient {
  private instance: AxiosInstance

  constructor(config?: HttpClientConfig) {
    this.instance = axios.create(config)
  }

  get<T = unknown>(
    url: string,
    config?: HttpClientConfig
  ): Promise<HttpResponse<T>> {
    return this.instance.get<T>(url, config)
  }

  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpClientConfig
  ): Promise<HttpResponse<T>> {
    return this.instance.post<T>(url, data, config)
  }

  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpClientConfig
  ): Promise<HttpResponse<T>> {
    return this.instance.put<T>(url, data, config)
  }

  delete<T = unknown>(
    url: string,
    config?: HttpClientConfig
  ): Promise<HttpResponse<T>> {
    return this.instance.delete<T>(url, config)
  }
}

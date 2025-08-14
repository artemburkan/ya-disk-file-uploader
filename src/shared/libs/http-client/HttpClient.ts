import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  AxiosProgressEvent,
} from 'axios'
import { HttpClientError } from './HttpClientError'

export type HttpClientConfig = AxiosRequestConfig
export type HttpMethod = Method
export type HttpResponse<T = unknown, D = unknown> = AxiosResponse<T, D>
export type HttpUploadProgressEvent = AxiosProgressEvent

export class HttpClient {
  private instance: AxiosInstance

  constructor(config?: HttpClientConfig) {
    this.instance = axios.create(config)
  }

  private throwError(error: unknown): never {
    const httpClientError = new HttpClientError()

    if (axios.isAxiosError(error)) {
      httpClientError.code = error.code ?? ''
      httpClientError.name = error.response?.data?.error
      httpClientError.message = error.response?.data?.message
      httpClientError.description = error.response?.data?.description
    } else {
      httpClientError.code = 'UNKNOWN_ERROR'
      httpClientError.name = 'UnknownError'
      httpClientError.message = 'Неизвестная ошибка'
      httpClientError.description = 'Unknown error'
    }

    throw httpClientError
  }

  async get<T = unknown>(url: string, config?: HttpClientConfig): Promise<T> {
    try {
      const response = await this.instance.get<T>(url, config)
      return response.data
    } catch (error) {
      this.throwError(error)
    }
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpClientConfig
  ): Promise<T> {
    try {
      const response = await this.instance.post<T>(url, data, config)
      return response.data
    } catch (error) {
      this.throwError(error)
    }
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpClientConfig
  ): Promise<T> {
    try {
      const response = await this.instance.put<T>(url, data, config)
      return response.data
    } catch (error) {
      this.throwError(error)
    }
  }

  async delete<T = unknown>(
    url: string,
    config?: HttpClientConfig
  ): Promise<T> {
    try {
      const response = await this.instance.delete<T>(url, config)
      return response.data
    } catch (error) {
      this.throwError(error)
    }
  }
}

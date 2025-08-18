import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { HttpConfig } from './types'
import { HttpError } from './HttpError'

export class HttpClient {
  private _request: AxiosInstance

  constructor(config?: HttpConfig) {
    this._request = axios.create(config)
  }

  get request() {
    return this._request
  }

  get config() {
    return this.request.defaults
  }

  private throwError(error: unknown): never {
    const httpError = new HttpError()

    if (axios.isAxiosError(error)) {
      httpError.code = error.code ?? ''
      httpError.name = error.response?.data?.error
      httpError.message = error.response?.data?.message
      httpError.description = error.response?.data?.description
    } else {
      httpError.code = 'UNKNOWN_ERROR'
      httpError.name = 'UnknownError'
      httpError.message = 'Неизвестная ошибка'
      httpError.description = 'Unknown error'
    }

    throw httpError
  }

  async get<T = unknown>(url: string, config?: HttpConfig): Promise<T> {
    try {
      const response = await this.request.get<T>(url, config)
      return response.data
    } catch (error) {
      this.throwError(error)
    }
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpConfig
  ): Promise<T> {
    try {
      const response = await this.request.post<T>(url, data, config)
      return response.data
    } catch (error) {
      this.throwError(error)
    }
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpConfig
  ): Promise<T> {
    try {
      const response = await this.request.put<T>(url, data, config)
      return response.data
    } catch (error) {
      this.throwError(error)
    }
  }

  async delete<T = unknown>(url: string, config?: HttpConfig): Promise<T> {
    try {
      const response = await this.request.delete<T>(url, config)
      return response.data
    } catch (error) {
      this.throwError(error)
    }
  }
}

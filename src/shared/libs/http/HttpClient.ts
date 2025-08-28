import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { shouldHttpErrorEmit, type HttpEmitter } from '@shared/system/emitters'
import type { HttpConfig, HttpResponse } from './types'
import { HttpError } from './HttpError'

export class HttpClient {
  private readonly agent: AxiosInstance
  private readonly emitter: HttpEmitter

  constructor(emitter: HttpEmitter, config?: HttpConfig) {
    this.emitter = emitter
    this.agent = axios.create(config)
  }

  get config() {
    return this.agent.defaults
  }

  private createError(error: unknown) {
    let status: number | undefined
    let statusText: string | undefined
    let name = 'UnknownError'
    let message = 'Неизвестная ошибка'
    let description = 'Unknown error'

    if (axios.isAxiosError(error)) {
      status = error.response?.status
      statusText = error.response?.statusText
      name = error.response?.data?.error ?? error.code ?? ''
      message = error.response?.data?.message ?? error.message
      description = error.response?.data?.description ?? ''
    }

    let httpError = new HttpError({
      status,
      statusText,
      name,
      message,
      description,
    })

    httpError.log()

    if (!httpError.status || shouldHttpErrorEmit(httpError.status)) {
      this.emitter.emit('error', httpError)
      httpError = new HttpError({ status, statusText })
      return httpError
    }

    return httpError
  }

  async get<T = unknown>(url: string, config?: HttpConfig): HttpResponse<T> {
    try {
      const response = await this.agent.get<T>(url, config)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error: this.createError(error) }
    }
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpConfig
  ): HttpResponse<T> {
    try {
      const response = await this.agent.post<T>(url, data, config)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error: this.createError(error) }
    }
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpConfig
  ): HttpResponse<T> {
    try {
      const response = await this.agent.put<T>(url, data, config)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error: this.createError(error) }
    }
  }

  async delete<T = unknown>(url: string, config?: HttpConfig): HttpResponse<T> {
    try {
      const response = await this.agent.delete<T>(url, config)
      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error: this.createError(error) }
    }
  }
}

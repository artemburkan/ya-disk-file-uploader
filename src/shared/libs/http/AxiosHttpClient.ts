import axios from "axios"
import type {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios"
import type {HttpEmitter} from "@shared/system/emitters"
import type {HttpResponse} from "./types"
import {HttpError} from "./HttpError"

type AxiosHttpResponse = AxiosResponse & {error: null}

export class AxiosHttpClient {
  static readonly UNKNOWN_ERROR = "ENKNOWN_ERR"
  static readonly CLIENT_ERRORS = new Set([401, 403, 405, 410, 423, 429])
  static readonly SERVER_ERRORS = new Set([500, 503])

  static init(config?: AxiosRequestConfig) {
    return new AxiosHttpClient(config)
  }

  private readonly agent: AxiosInstance
  emitter?: HttpEmitter

  private constructor(config?: AxiosRequestConfig) {
    this.agent = axios.create(config)
    this.agent.interceptors.response.use(this.onFulfilledInterceptor, this.onRejectedInterceptor)
  }

  get config() {
    return this.agent.defaults
  }

  get interceptors() {
    return this.agent.interceptors
  }

  readonly onFulfilledInterceptor = (response: AxiosResponse): AxiosHttpResponse => {
    return {...response, error: null}
  }

  readonly onRejectedInterceptor = (error: unknown) => {
    const httpError = this.createError(error)
    httpError.log()

    if (
      !httpError.status ||
      AxiosHttpClient.CLIENT_ERRORS.has(httpError.status) ||
      AxiosHttpClient.SERVER_ERRORS.has(httpError.status)
    ) {
      this.emitter?.emit("error", httpError)
      httpError.data = [{name: "", message: "", description: ""}]
    }

    return {data: null, error: httpError}
  }

  private createError(error: unknown) {
    let status: number | undefined
    let statusText: string | undefined
    let name = AxiosHttpClient.UNKNOWN_ERROR
    let message = "Unknown error"
    let description = "Unknown error"

    if (axios.isAxiosError(error)) {
      status = error.response?.status
      statusText = error.response?.statusText
      name = error.response?.data?.error ?? error.code ?? ""
      message = error.response?.data?.message ?? error.message
      description = error.response?.data?.description ?? ""
    }

    const httpError = new HttpError({
      status,
      statusText,
      name,
      message,
      description,
    })

    return httpError
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): HttpResponse<T> {
    const {data, error} = await this.agent.get<T, AxiosHttpResponse>(url, config)
    return {data, error}
  }

  async post<T = unknown>(
    url: string,
    payload?: unknown,
    config?: AxiosRequestConfig,
  ): HttpResponse<T> {
    const {data, error} = await this.agent.post<T, AxiosHttpResponse>(url, payload, config)
    return {data, error}
  }

  async put<T = unknown>(
    url: string,
    payload?: unknown,
    config?: AxiosRequestConfig,
  ): HttpResponse<T> {
    const {data, error} = await this.agent.put<T, AxiosHttpResponse>(url, payload, config)
    return {data, error}
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): HttpResponse<T> {
    const {data, error} = await this.agent.delete<T, AxiosHttpResponse>(url, config)
    return {data, error}
  }
}

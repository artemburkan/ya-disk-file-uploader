import type {AxiosResponse, AxiosProgressEvent, Method} from "axios"
import {HttpError} from "./HttpError"

export type {AxiosResponse, AxiosProgressEvent, Method}

export interface AxiosHttpResponse extends AxiosResponse {
  error: HttpError
}

export type Response<T = unknown> = {data: T; error: null} | {data: null; error: HttpError}

export type HttpResponse<T> = Promise<Response<T>>

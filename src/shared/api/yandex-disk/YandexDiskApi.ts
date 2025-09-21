import {AxiosHttpClient} from "@shared/libs/http"
import type {AxiosProgressEvent, HttpResponse} from "@shared/libs/http"
import {SystemEmitter} from "@shared/system/emitters"
import type {UrlUploadResponse} from "./types"

export class YandexDiskApi {
  static config = {
    baseURL: process.env.VITE_YANDEX_DISK_API,
    timeout: 300000,
    headers: {
      "Content-Type": "application/json",
    },
  }

  static CONFLICT_STATUS = 409

  private readonly http: AxiosHttpClient

  constructor() {
    this.http = AxiosHttpClient.init(YandexDiskApi.config)
    this.http.emitter = SystemEmitter.http
  }

  async getUploadUrl(
    path: string,
    options: {authToken: string; overwrite?: boolean; fields?: string},
  ): HttpResponse<UrlUploadResponse> {
    const headers = {Authorization: `OAuth ${options.authToken}`}
    const params = {path, ...options}

    return await this.http.get<UrlUploadResponse>("/resources/upload", {
      headers,
      params,
    })
  }

  async uploadFile(
    url: string,
    file: File,
    onUploadProgress?: (event: AxiosProgressEvent) => void,
  ) {
    return await this.http.put(url, file, {onUploadProgress})
  }
}

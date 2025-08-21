import { HttpClient } from '@shared/libs/http'
import type { HttpProgressEvent } from '@shared/libs/http'
import type { UrlUploadResponse } from './types'

export class YandexDiskService {
  private _http: HttpClient

  constructor(http: HttpClient) {
    this._http = http
  }

  get http() {
    return this._http
  }

  async getUploadUrl(
    path: string,
    authToken: string
  ): Promise<UrlUploadResponse> {
    const config = {
      headers: { Authorization: `OAuth ${authToken}` },
      params: { path, overwrite: true },
    }

    return await this.http.get<UrlUploadResponse>('/resources/upload', config)
  }

  async uploadFile(
    url: string,
    file: File,
    onUploadProgress?: (event: HttpProgressEvent) => void
  ) {
    return await this.http.put(url, file, { onUploadProgress })
  }
}

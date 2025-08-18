import { HttpClient } from '@shared/libs/http'
import type { HttpProgressEvent } from '@shared/libs/http'
import type { UrlUploadResponse } from './types'

export class YandexDiskService {
  private _http: HttpClient
  private _authToken: string

  constructor(http: HttpClient, authToken: string) {
    this._http = http
    this._authToken = authToken
  }

  get http() {
    return this._http
  }

  private get authToken() {
    return this._authToken
  }

  async getUploadUrl(path: string): Promise<UrlUploadResponse> {
    const config = {
      headers: { Authorization: `OAuth ${this.authToken}` },
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

import { HttpClient } from '@shared/libs/http'
import type { HttpProgressEvent, HttpResponse } from '@shared/libs/http'
import type { UrlUploadResponse } from './types'

export class YandexDiskService {
  static CONFLICT_STATUS = 409

  private readonly http: HttpClient

  constructor(http: HttpClient) {
    this.http = http
  }

  async getUploadUrl(
    path: string,
    options: { authToken: string; overwrite?: boolean; fields?: string }
  ): HttpResponse<UrlUploadResponse> {
    const headers = { Authorization: `OAuth ${options.authToken}` }
    const params = { path, ...options }

    return await this.http.get<UrlUploadResponse>('/resources/upload', {
      headers,
      params,
    })
  }

  async uploadFile(
    url: string,
    file: File,
    onUploadProgress?: (event: HttpProgressEvent) => void
  ) {
    return await this.http.put(url, file, { onUploadProgress })
  }
}

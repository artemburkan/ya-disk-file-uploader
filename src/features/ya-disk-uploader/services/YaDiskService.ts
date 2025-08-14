import { HttpClient, HttpClientError } from '@shared/libs'
import type { HttpUploadProgressEvent } from '@shared/libs'
import type { UploadingResponse } from './types'
import type { FileInfo, UploadFileProcess } from '@shared/ui/file-uploader'

export class YaDiskService {
  baseDiskPath = 'disk:/'

  httpClient = new HttpClient({
    baseURL: 'https://cloud-api.yandex.net/v1/disk',
    timeout: 300000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // 1. Получить URL для загрузки файла
  private async getUploadUrl(path: string): Promise<UploadingResponse> {
    const url = '/resources/upload'
    const token = localStorage.getItem('token')
    const config = {
      params: { path, overwrite: true },
      headers: { Authorization: `OAuth ${token}` },
    }

    return await this.httpClient.get<UploadingResponse>(url, config)
  }

  // 2. Загрузить файл по полученному URL
  async uploadFile(file: FileInfo, process?: UploadFileProcess): Promise<void> {
    let httpClientError: HttpClientError | undefined

    try {
      const path = `${this.baseDiskPath}${file.name}`
      const { href } = await this.getUploadUrl(path)

      await this.httpClient.put(href, file.value, {
        onUploadProgress: (event: HttpUploadProgressEvent) => {
          process?.progress(
            Math.floor((event.loaded / (event.total ?? 1)) * 100)
          )
        },
      })
    } catch (error) {
      httpClientError = error as HttpClientError
    }

    process?.finish(httpClientError)
  }

  // 3. Загрузить файл по полученному URL
  async downloadFile(): Promise<void> {}
}

export const yaDiskService = new YaDiskService()

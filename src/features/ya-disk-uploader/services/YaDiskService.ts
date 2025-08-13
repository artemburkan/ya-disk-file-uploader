import { HttpClient } from '@shared/libs'
import type { HttpUploadProgressEvent } from '@shared/libs'
import type { UploadingResponse } from './types'
import type { FileInfo, UploadFileProcess } from '@shared/ui/file-uploader'

export class YaDiskService {
  httpClient = new HttpClient({
    timeout: 300000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // 1. Получить URL для загрузки файла
  private async getUploadUrl(path: string): Promise<string> {
    const token = localStorage.getItem('token')
    const response = await this.httpClient.get<UploadingResponse>(
      'https://cloud-api.yandex.net/v1/disk/resources/upload',
      {
        params: { path, overwrite: true },
        headers: {
          Authorization: `OAuth ${token}`,
        },
      }
    )

    return response.data.href
  }

  // 2. Загрузить файл по полученному URL
  async uploadFile(file: FileInfo, process?: UploadFileProcess): Promise<void> {
    const path = `disk:/${file.name}${file.extension}`
    const uploadUrl = await this.getUploadUrl(path)

    await this.httpClient.put(uploadUrl, file.value, {
      onUploadProgress: (event: HttpUploadProgressEvent) => {
        let loadedPercent: number = 0

        if (event.total) {
          loadedPercent = Math.floor((event.loaded / event.total) * 100)
        }

        process?.uploading(loadedPercent)
      },
    })

    process?.uploaded()
  }

  // 3. Загрузить файл по полученному URL
  async downloadFile(): Promise<void> {}
}

export const yaDiskService = new YaDiskService()

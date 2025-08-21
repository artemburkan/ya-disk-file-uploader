import { HttpError } from '@shared/libs/http'
import type { FileInfo, UploadFileProcess } from '@shared/ui/file-uploader'
import type { HttpProgressEvent } from '@shared/libs/http'
import { YandexDiskService } from '@shared/services/yandex-disk'
import { calcLoadProgress } from '@/shared/utils/calcLoadProgress'
import { http } from './http'

class YaDiskUploadService {
  yaDiskService: YandexDiskService

  constructor() {
    this.yaDiskService = new YandexDiskService(http)
  }

  async uploadFile(file: FileInfo, process?: UploadFileProcess) {
    let httpError: HttpError | undefined
    const authToken = localStorage.getItem('token') ?? ''

    try {
      const { href } = await this.yaDiskService.getUploadUrl(
        file.name,
        authToken
      )

      const progress = (event: HttpProgressEvent) => {
        const progress = calcLoadProgress(event.loaded, event.total ?? 1)
        process?.progress(progress)
      }

      await this.yaDiskService.uploadFile(href, file.value, progress)
    } catch (error) {
      httpError = error as HttpError
    }

    process?.finish(httpError)
  }
}

export const yaDiskUploadService = new YaDiskUploadService()

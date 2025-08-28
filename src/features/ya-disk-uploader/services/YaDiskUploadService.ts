import type { FileInfo, UploadFileProcess } from '@shared/ui/file-uploader'
import type { HttpProgressEvent } from '@shared/libs/http'
import { YandexDiskService } from '@shared/services/yandex-disk'
import { calcLoadProgress } from '@/shared/utils/calcLoadProgress'
import { http } from './http'

const MESSAGE =
  'Файл с этим именем уже существует. Повторная загрузка перезапишет его.'

class YaDiskUploadService {
  yaDisk: YandexDiskService
  updateFiles = new Map<string, FileInfo>()

  constructor() {
    this.yaDisk = new YandexDiskService(http)
  }

  async uploadFile(file: FileInfo, process?: UploadFileProcess) {
    const authToken = localStorage.getItem('token') ?? ''
    const overwrite = this.updateFiles.has(file.id)

    const response = await this.yaDisk.getUploadUrl(file.name, {
      authToken,
      overwrite,
    })

    if (response.error) {
      const [error] = response.error.data
      let message = error?.message ?? ''

      if (response.error.status === YandexDiskService.CONFLICT_STATUS) {
        this.updateFiles.set(file.id, file)
        message = MESSAGE
      }

      process?.finish({ status: 'failed', message })

      return
    }

    if (overwrite) {
      this.updateFiles.delete(file.id)
    }

    const progress = (event: HttpProgressEvent) => {
      if (event.progress !== 1) {
        const percentages = calcLoadProgress(event.loaded, event.total ?? 1)
        process?.progress(percentages)
      }
    }

    const { error } = await this.yaDisk.uploadFile(
      response.data.href,
      file.value,
      progress
    )

    if (error) {
      const [data] = error.data
      process?.finish({ status: 'failed', message: data?.message })
      return
    }

    process?.finish({ status: 'success' })
  }
}

export const yaDiskUploadService = new YaDiskUploadService()

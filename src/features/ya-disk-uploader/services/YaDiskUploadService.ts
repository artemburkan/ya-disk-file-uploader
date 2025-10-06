import type {FileInfo, UploadFileProcess} from "@shared/ui/dropzone"
import type {AxiosProgressEvent} from "@shared/libs/http"
import {YandexDiskApi} from "@shared/api"
import {calcLoadProgress} from "@/shared/utils/calcLoadProgress"

const MESSAGE = "Файл с этим именем уже существует. Повторная загрузка перезапишет его."

export class YaDiskUploadService {
  yaDisk = new YandexDiskApi()
  updatedFiles = new Map<string, FileInfo>()

  async uploadFile(file: FileInfo, process: UploadFileProcess) {
    const authToken = localStorage.getItem("token") ?? ""
    const overwrite = this.updatedFiles.has(file.id)

    const response = await this.yaDisk.getUploadUrl(file.name, {
      authToken,
      overwrite,
    })

    if (response.error) {
      const [error] = response.error.data
      let message = error?.message ?? ""

      if (response.error.status === YandexDiskApi.CONFLICT_STATUS) {
        this.updatedFiles.set(file.id, file)
        message = MESSAGE
      }

      process.finish({status: "failed", message})

      return
    }

    if (overwrite) {
      this.updatedFiles.delete(file.id)
    }

    const progress = (event: AxiosProgressEvent) => {
      if (event.progress !== 1) {
        const percentages = calcLoadProgress(event.loaded, event.total ?? 1)
        process.progress(percentages)
      }
    }

    const {error} = await this.yaDisk.uploadFile(response.data.href, file.data, progress)

    if (error) {
      const [data] = error.data
      process?.finish({status: "failed", message: data?.message})
      return
    }

    process.finish({status: "success"})
  }
}

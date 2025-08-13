import { useCallback, memo } from 'react'
import { FileUploader } from '@shared/ui/file-uploader'
import type { FileInfo, UploadFileProcess } from '@shared/ui/file-uploader'
import { yaDiskService } from './services/YaDiskService'

const description = 'Выберите для загрузки на Яндекс.Диск'

const FileUploaderWithMemo = memo(FileUploader)

export const YaDiskUploader = () => {
  const upload = useCallback((file: FileInfo, process?: UploadFileProcess) => {
    yaDiskService.uploadFile(file, process)
  }, [])

  const download = useCallback(() => {
    // yaDiskService.downloadFile()
  }, [])

  return (
    <FileUploaderWithMemo
      description={description}
      onUpload={upload}
      onDownload={download}
    />
  )
}

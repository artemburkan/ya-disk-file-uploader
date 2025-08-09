import { useCallback } from 'react'
import { FileUploader } from '@shared/ui/file-uploader'

const MESSAGE = 'Выберите для загрузки на Яндекс.Диск'

export const YaDiskUploader = () => {
  const upload = useCallback(() => {}, [])

  return <FileUploader message={MESSAGE} onUpload={upload} />
}

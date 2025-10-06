import {useCallback, useRef, memo} from "react"
import {Dropzone} from "@shared/ui/dropzone"
import type {FileInfo, UploadFileProcess} from "@shared/ui/dropzone"
import {YaDiskUploadService} from "./services/YaDiskUploadService"

const DropzoneWithMemo = memo(Dropzone)

export const YaDiskUploader = () => {
  const yaDiskUploderRef = useRef(new YaDiskUploadService())
  const descriptionRef = useRef({
    initial: "Выберите для отображения списка загрузки файлов на Яндекс.Диск",
    over: "Отпустите для отображения списка файлов",
  })

  const upload = useCallback((file: FileInfo, process: UploadFileProcess) => {
    yaDiskUploderRef.current.uploadFile(file, process)
  }, [])

  return <DropzoneWithMemo description={descriptionRef.current} onUpload={upload} />
}

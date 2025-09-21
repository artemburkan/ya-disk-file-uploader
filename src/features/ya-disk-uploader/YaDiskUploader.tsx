import {useCallback, useRef, memo} from "react"
import {FileUploader} from "@shared/ui/file-uploader"
import type {FileInfo, UploadFileProcess} from "@shared/ui/file-uploader"
import {YaDiskUploadService} from "./services/YaDiskUploadService"

const description = "Выберите для загрузки на Яндекс.Диск"

const FileUploaderWithMemo = memo(FileUploader)

export const YaDiskUploader = () => {
  const yaDiskUploderRef = useRef(new YaDiskUploadService())

  const upload = useCallback((file: FileInfo, process?: UploadFileProcess) => {
    yaDiskUploderRef.current.uploadFile(file, process)
  }, [])

  return <FileUploaderWithMemo description={description} onUpload={upload} />
}

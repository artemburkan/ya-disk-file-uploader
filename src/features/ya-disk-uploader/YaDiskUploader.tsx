import {useCallback, memo} from "react"
import {FileUploader} from "@shared/ui/file-uploader"
import type {FileInfo, UploadFileProcess} from "@shared/ui/file-uploader"

import {yaDiskUploadService} from "./services/YaDiskUploadService"

const description = "Выберите для загрузки на Яндекс.Диск"

const FileUploaderWithMemo = memo(FileUploader)

export const YaDiskUploader = () => {
  const upload = useCallback((file: FileInfo, process?: UploadFileProcess) => {
    yaDiskUploadService.uploadFile(file, process)
  }, [])

  return <FileUploaderWithMemo description={description} onUpload={upload} />
}

// example.js
const foo = "bar" // должно быть const и с точкой с запятой
console.log(foo) // лишние пробелы вокруг переменной

// const obj = {
//   name: "test",
// }

// const { name } = obj

const fn = (test: string) => {
  console.log("test: ", test)
}

fn(10)

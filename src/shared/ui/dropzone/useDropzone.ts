import {useCallback, useState} from "react"
import {nanoid} from "nanoid"
import type {FileInfo, UploadFileStatus} from "./types"

export const useDropzone = () => {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [isOverArea, setIsOverArea] = useState(false)

  const addFiles = useCallback((files: File[]) => {
    const addedFiles = files.map((file) => ({
      id: nanoid(),
      data: file,
      uploadStatus: "failed" as UploadFileStatus,
      progress: 0,
      name: file.name,
      message: "",
      isEdit: false,
    }))
    setFiles((files) => [...files, ...addedFiles])
  }, [])

  const updateFile = useCallback((file: FileInfo, update?: (file: FileInfo) => FileInfo) => {
    setFiles((files) =>
      files.map((item) => {
        if (update) {
          return item.id !== file.id ? item : {...file, ...update(item)}
        } else {
          return item.id !== file.id ? item : {...file}
        }
      }),
    )
  }, [])

  const deleteFile = useCallback((file: FileInfo) => {
    setFiles((files) => files.filter((item) => item.id !== file.id))
  }, [])

  return {
    files,
    isOverArea,
    setFiles,
    setIsOverArea,
    addFiles,
    updateFile,
    deleteFile,
  }
}

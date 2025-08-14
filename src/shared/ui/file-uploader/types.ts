export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error'

export interface FileInfo {
  id: number
  value: File
  name: string
  message: string
  isEdit: boolean
  uploadStatus: UploadFileStatus
  progress: number
}

export interface FileError {
  message: string
}

export interface UploadFileProcess {
  progress: (process: number) => void
  finish: (error?: FileError) => void
}

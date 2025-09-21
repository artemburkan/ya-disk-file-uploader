export type UploadFileStatus = "ready" | "uploading" | "success" | "failed"

export interface FileInfo {
  id: string
  data: File
  name: string
  message: string
  isEdit: boolean
  uploadStatus: UploadFileStatus
  progress: number
}

export interface ProcessInfo {
  status?: UploadFileStatus
  message?: string
  progress?: number
}

export interface UploadFileProcess {
  progress: (process: number) => void
  finish: (process?: ProcessInfo) => void
}

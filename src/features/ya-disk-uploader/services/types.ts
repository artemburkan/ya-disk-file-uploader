import type {Method} from "@shared/libs"

export interface UploadingResponse {
  operation_id: string
  href: string
  method: Method
  templated: boolean
}

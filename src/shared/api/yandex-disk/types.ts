import type {Method} from "@shared/libs/http"

export interface UrlUploadResponse {
  operation_id: string
  href: string
  method: Method
  templated: boolean
}

import type { HttpMethod } from '@shared/libs/http'

export interface UrlUploadResponse {
  operation_id: string
  href: string
  method: HttpMethod
  templated: boolean
}

import type { HttpMethod } from '@shared/libs'

export interface UploadingResponse {
  operation_id: string
  href: string
  method: HttpMethod
  templated: boolean
}

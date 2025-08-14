export class HttpClientError {
  code: string
  message: string
  description: string
  name: string

  constructor(
    code: string = '',
    name: string = '',
    message: string = '',
    description: string = ''
  ) {
    this.code = code
    this.name = name
    this.message = message
    this.description = description
  }
}

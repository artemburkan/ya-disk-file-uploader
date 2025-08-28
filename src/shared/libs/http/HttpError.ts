interface Options {
  status?: number
  statusText?: string
  message?: string
  description?: string
  name?: string
}

interface ErrorData {
  message: string
  description: string
  name: string
}

export class HttpError {
  status?: number
  statusText?: string
  data: ErrorData[] = []

  constructor(options: Options = {}) {
    const {
      status,
      statusText,
      name = '',
      message = '',
      description = '',
    } = options
    this.status = status
    this.statusText = statusText
    this.data.push({ name, message, description })
  }

  log(message = '') {
    console.error(`Error: ${this.statusText ?? message} \n`, this.data)
  }
}

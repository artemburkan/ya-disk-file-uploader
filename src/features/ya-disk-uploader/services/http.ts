import { HttpClient } from '@shared/libs'

const config = {
  baseURL: 'https://cloud-api.yandex.net/v1/disk',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export const http = new HttpClient(config)

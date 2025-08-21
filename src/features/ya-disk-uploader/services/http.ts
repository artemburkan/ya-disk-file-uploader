import { HttpClient } from '@shared/libs'

const config = {
  baseURL: process.env.VITE_YANDEX_DISK_API,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export const http = new HttpClient(config)

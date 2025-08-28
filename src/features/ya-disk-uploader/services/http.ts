import { HttpClient } from '@shared/libs'
import { SystemEmitter } from '@shared/system/emitters'

const config = {
  baseURL: process.env.VITE_YANDEX_DISK_API,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export const http = new HttpClient(SystemEmitter.http, config)

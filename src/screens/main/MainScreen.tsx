import { useRef, useEffect, useState } from 'react'
import { ScreenLayout } from '@shared/ui/screen-layout'
import { Link } from '@shared/ui/link'
import { SystemEmitter } from '@shared/system/emitters'
import { YaDiskUploader } from '@features/ya-disk-uploader'
import style from './MainScreen.module.css'

const href = process.env.VITE_YANDEX_DISK_AUTH_API

export const MainScreen = () => {
  const tokenEl = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    localStorage.setItem('token', event.target.value)
  }

  useEffect(() => {
    if (!tokenEl.current) return

    const token = localStorage.getItem('token')
    tokenEl.current.value = token ?? ''
  }, [])

  useEffect(() => {
    const unsubscribe = SystemEmitter.http.on('error', (error) => {
      setError(() => {
        const [data] = error.data
        return data?.message
      })

      setTimeout(() => setError(''), 5000)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <ScreenLayout>
      <div className={style['main-screen']}>
        <p className={style['main-screen__message']}>
          Авторизируйтесь{' '}
          <Link href={href} hasDecorator={true}>
            здесь
          </Link>
        </p>
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        <form>
          <label className={style['main-screen__label-oauth']}>
            OAuth токен:
            <input
              ref={tokenEl}
              type="text"
              name="oauth"
              onChange={change}
              className={style['main-screen__oauth']}
            />
          </label>
        </form>
        <YaDiskUploader />
      </div>
    </ScreenLayout>
  )
}

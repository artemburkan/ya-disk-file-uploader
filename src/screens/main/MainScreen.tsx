import { useRef, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ScreenLayout } from '@shared/ui/screen-layout'
import { Link } from '@shared/ui/link'
import { YaDiskUploader } from '@features/ya-disk-uploader'
import style from './MainScreen.module.css'

const href =
  'https://oauth.yandex.ru/authorize?response_type=token&client_id=6cea54eb5e4b4f7ea4f774051418155c'

export const MainScreen = () => {
  const tokenEl = useRef<HTMLInputElement>(null)

  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem('token', event.target.value)
  }

  useEffect(() => {
    if (!tokenEl.current) return

    const token = localStorage.getItem('token')
    tokenEl.current.value = token ?? ''
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
        <ErrorBoundary fallback={<YaDiskUploader />}>
          <YaDiskUploader />
        </ErrorBoundary>
      </div>
    </ScreenLayout>
  )
}

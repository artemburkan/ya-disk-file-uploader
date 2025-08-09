import { ScreenLayout } from '@shared/ui/screen-layout'
import { YaDiskUploader } from '@features/ya-disk-uploader'

export const MainScreen = () => {
  return (
    <ScreenLayout>
      <YaDiskUploader />
    </ScreenLayout>
  )
}

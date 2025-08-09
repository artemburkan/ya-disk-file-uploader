import { useRef, useState } from 'react'
import { IoCloudUpload } from 'react-icons/io5'
// import { Item } from './item'
import { File } from './file'
import style from './FileUploader.module.css'

interface Props {
  message?: string
  onUpload?: () => void
}

type FileStatus = 'unuploaded' | 'uploading' | 'uploaded'

interface FileValue {
  name: string
  size: string
  value: File
  status: FileStatus
}

type Files = FileValue[]

export const FileUploader = (props: Props) => {
  const { message, onUpload } = props

  const [files, setFiles] = useState<Files>([])
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const click = () => {
    inputRef.current?.click()
  }

  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files

    if (!fileList) return

    const addedFiles = Array.from(fileList).map((file) => {
      const name =
        file.name.length > 32
          ? file.name.slice(0, 12) + '...' + file.name.slice(-12)
          : file.name
      const size = `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      const status: FileStatus = 'unuploaded'

      return {
        name,
        size,
        value: file,
        status,
      }
    })

    setFiles([...files, ...addedFiles])
  }

  const deleteFile = (index: number) => {
    files.splice(index, 1)
    const newFiles = [...files]
    setFiles(newFiles)
  }

  return (
    <form ref={formRef} className={style['file-uploader']}>
      <div className={style['file-uploader__drop-area']} onClick={click}>
        <input ref={inputRef} type="file" multiple hidden onChange={change} />
        <IoCloudUpload size={64} className={style['file-uploader__icon']} />
        {message}
      </div>
      {files &&
        files.map((file, index) => (
          <File
            key={index}
            name={file.name}
            size={file.size}
            value={file.value}
            onDelete={() => deleteFile(index)}
          />
        ))}
    </form>
  )
}

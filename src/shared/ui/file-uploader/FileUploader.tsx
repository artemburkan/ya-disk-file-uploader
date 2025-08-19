import { useRef, useState } from 'react'
import { IoCloudUpload } from 'react-icons/io5'
import { File } from './file'
import type {
  FileInfo,
  FileError,
  UploadFileStatus,
  UploadFileProcess,
} from './types'
import { generateId } from '@shared/utils/generateId'
import style from './FileUploader.module.css'

interface Props {
  description?: string
  onUpload?: (fileInfo: FileInfo, process?: UploadFileProcess) => void
  onDownload?: () => void
}

export const FileUploader = (props: Props) => {
  const { description, onUpload = () => {}, onDownload = () => {} } = props

  const [files, setFiles] = useState<FileInfo[]>([])
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const click = () => {
    inputRef.current?.click()
  }

  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files

    if (!newFiles) return

    const addedFiles = Array.from(newFiles).map((file) => ({
      id: generateId(),
      value: file,
      uploadStatus: 'ready' as UploadFileStatus,
      progress: 0,
      name: file.name,
      message: '',
      isEdit: false,
    }))

    formRef.current?.reset()
    setFiles([...files, ...addedFiles])
  }

  const uploadFile = (file: FileInfo) => {
    setFiles((files) => {
      const index = files.findIndex((_) => _.id === file.id)
      files[index].uploadStatus = 'uploading'
      files[index].message = ''
      return [...files]
    })

    onUpload(file, {
      progress: (progress: number) => {
        setFiles((files) => {
          const index = files.findIndex((_) => _.id === file.id)
          files[index].progress = progress
          return [...files]
        })
      },
      finish: (error?: FileError) => {
        setFiles((files) => {
          const index = files.findIndex((_) => _.id === file.id)
          files[index].uploadStatus = error ? 'failed' : 'success'
          files[index].message = error?.message ?? ''
          return [...files]
        })
      },
    })
  }

  const editFile = (file: FileInfo) => {
    const index = files.findIndex((_) => _.id === file.id)
    files[index].isEdit = !file.isEdit
    files[index].name = `${file.name}`
    setFiles([...files])
  }

  const deleteFile = (file: FileInfo) => {
    setFiles(files.filter((_) => _.id !== file.id))
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form ref={formRef} className={style['file-uploader']} onSubmit={submit}>
      <div className={style['file-uploader__drop-area']} onClick={click}>
        <input
          ref={inputRef}
          name="uploadFile"
          type="file"
          multiple
          hidden
          onChange={change}
        />
        <IoCloudUpload size={64} className={style['file-uploader__icon']} />
        {description}
      </div>
      {Boolean(files.length) &&
        files.map((file) => (
          <File
            key={file.id}
            value={file.value}
            name={file.name}
            uploadStatus={file.uploadStatus}
            progress={file.progress}
            message={file.message}
            isEdit={file.isEdit}
            onEdit={(name: string) => editFile({ ...file, name })}
            onDelete={() => deleteFile(file)}
            onUpload={() => uploadFile(file)}
            onDownload={() => onDownload()}
          />
        ))}
    </form>
  )
}

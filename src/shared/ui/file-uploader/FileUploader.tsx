import { useRef, useState } from 'react'
import { IoCloudUpload } from 'react-icons/io5'
import { generateId } from '@shared/utils/generateId'
import { File } from './file'
import type {
  FileInfo,
  ProcessInfo,
  UploadFileStatus,
  UploadFileProcess,
} from './types'
import style from './FileUploader.module.css'

interface Props {
  description?: string
  onUpload?: (fileInfo: FileInfo, process?: UploadFileProcess) => void
}

export const FileUploader = (props: Props) => {
  const { description, onUpload = () => {} } = props

  const [files, setFiles] = useState<FileInfo[]>([])
  const formEl = useRef<HTMLFormElement>(null)
  const inputEl = useRef<HTMLInputElement>(null)

  const click = () => {
    inputEl.current?.click()
  }

  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    const addedFiles = Array.from(event.target.files).map((file) => ({
      id: generateId(),
      value: file,
      uploadStatus: 'failed' as UploadFileStatus,
      progress: 0,
      name: file.name,
      message: '',
      isEdit: false,
    }))

    formEl.current?.reset()
    setFiles([...files, ...addedFiles])
  }

  const uploadFile = (file: FileInfo) => {
    setFiles((files) => {
      const index = files.findIndex((_) => _.id === file.id)
      files[index].uploadStatus = 'uploading'
      files[index].message = ''
      files[index].progress = 0
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
      finish: (process?: ProcessInfo) => {
        setFiles((files) => {
          const index = files.findIndex((_) => _.id === file.id)
          files[index].uploadStatus = process?.status ?? 'ready'
          files[index].message = process?.message ?? ''
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
    <form ref={formEl} className={style['file-uploader']} onSubmit={submit}>
      <div className={style['file-uploader__drop-area']} onClick={click}>
        <input
          ref={inputEl}
          name="uploadFile"
          type="file"
          multiple
          hidden
          onChange={change}
        />
        <IoCloudUpload size={64} className={style['file-uploader__icon']} />
        {description}
      </div>
      {files.map((file) => (
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
        />
      ))}
    </form>
  )
}

import { useRef, useState } from 'react'
import { IoCloudUpload } from 'react-icons/io5'
import { File } from './file'
import type { UploadStatus } from './file'
import type { FileInfo } from './file'
import style from './FileUploader.module.css'

export interface UploadFileProcess {
  uploading: (process: number) => void
  uploaded: () => void
}

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

    const addedFiles = Array.from(newFiles).map((file, index) => ({
      id: files.length + index,
      value: file,
      uploadStatus: 'unuploaded' as UploadStatus,
      progress: 0,
      name: `${file.name.split('.')[0]}`,
      extension: `.${file.name.split('.')[1]}`,
      isEdit: false,
    }))

    formRef.current?.reset()
    setFiles([...files, ...addedFiles])
  }

  const uploadFile = (file: FileInfo) => {
    const index = files.findIndex((_) => _.id === file.id)
    files[index].uploadStatus = 'uploading'
    setFiles([...files])

    onUpload(file, {
      uploading: (progress: number) => {
        files[index].progress = progress
        setFiles([...files])
      },
      uploaded: () => {
        files[index].uploadStatus = 'uploaded'
        setFiles([...files])
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
    const restFiles = files.filter((_) => _.id !== file.id)
    setFiles(restFiles)
  }

  return (
    <form ref={formRef} className={style['file-uploader']}>
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
            extension={file.extension}
            uploadStatus={file.uploadStatus}
            progress={file.progress}
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

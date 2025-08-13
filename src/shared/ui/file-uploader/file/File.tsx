import { useState } from 'react'
import {
  MdFileUpload,
  MdFileDownload,
  MdCheckCircle,
  MdEdit,
  MdCheck,
} from 'react-icons/md'
import { MdDelete } from 'react-icons/md'
import style from './File.module.css'

export type UploadStatus = 'unuploaded' | 'uploading' | 'uploaded'
export interface FileInfo {
  id: number
  value: File
  name: string
  extension: string
  isEdit: boolean
  uploadStatus: UploadStatus
  progress: number
}

interface Props {
  value: File
  name?: string
  extension?: string
  uploadStatus?: string
  isEdit?: boolean
  progress?: number
  onEdit?: (name: string) => void
  onDelete?: () => void
  onUpload?: (file: File) => void
  onDownload?: () => void
}

export const File = (props: Props) => {
  const {
    value: file,
    name = '',
    extension = '',
    uploadStatus,
    isEdit,
    progress,
    onEdit = () => {},
    onDelete = () => {},
    onUpload = () => {},
    onDownload = () => {},
  } = props

  const [editedName, setEditedName] = useState('')

  const formatedName =
    name.length > 32
      ? `${name.slice(0, 32)}...${name.slice(-8)}${extension}`
      : `${name}${extension}`
  const size = `${(file.size / (1024 * 1024)).toFixed(2)} MB`

  const editFile = () => {
    if (editedName) {
      onEdit(editedName)
    } else {
      onEdit(name)
    }
  }

  const renameFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(event.target.value)
  }

  const uploadFile = () => {
    if (!file) return

    onUpload(file)
  }

  const downloadFile = () => {
    onDownload()
  }

  const deleteFile = () => onDelete()

  return (
    <div className={style['file']}>
      <div className={style['file__load']}>
        {uploadStatus === 'unuploaded' && (
          <MdFileUpload
            size={32}
            className={style['file__control']}
            onClick={uploadFile}
          />
        )}
        {uploadStatus === 'uploading' && `${progress ?? 0}%`}
        {uploadStatus === 'uploaded' && (
          <MdCheckCircle size={32} className={style['file__uploaded']} />
        )}
      </div>
      <div className={style['file__description']}>
        {isEdit && (
          <input
            type="text"
            name="fileName"
            defaultValue={name}
            onChange={renameFile}
            className={style['file__input']}
          />
        )}
        {!isEdit && (
          <>
            <div>{formatedName}</div>
            <div>{size}</div>
          </>
        )}
      </div>
      {uploadStatus !== 'uploading' && (
        <div className={style['file__controls']}>
          {uploadStatus === 'unuploaded' && (
            <>
              {!isEdit && (
                <MdEdit
                  size={22}
                  className={style['file__control']}
                  onClick={editFile}
                />
              )}
              {isEdit && (
                <MdCheck
                  size={22}
                  className={style['file__control']}
                  onClick={editFile}
                />
              )}
              <MdDelete
                size={24}
                className={style['file__control']}
                onClick={deleteFile}
              />
            </>
          )}
          {uploadStatus === 'uploaded' && (
            <MdFileDownload
              size={26}
              className={style['file__control']}
              onClick={downloadFile}
            />
          )}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import {
  MdFileUpload,
  MdFileDownload,
  MdCheckCircle,
  MdEdit,
  MdCheck,
} from 'react-icons/md'
import { MdDelete } from 'react-icons/md'
import cx from 'clsx'
import type { UploadFileStatus } from '../types'
import style from './File.module.css'

interface Props {
  value: File
  name?: string
  uploadStatus?: UploadFileStatus
  progress?: number
  message?: string
  isEdit?: boolean
  onEdit?: (name: string) => void
  onDelete?: () => void
  onUpload?: (file: File) => void
  onDownload?: () => void
}

export const File = (props: Props) => {
  const {
    value: file,
    name = '',
    uploadStatus,
    message = '',
    progress,
    isEdit,
    onEdit = () => {},
    onDelete = () => {},
    onUpload = () => {},
    onDownload = () => {},
  } = props

  const [editedName, setEditedName] = useState('')

  const formatedName =
    name.length > 32 ? `${name.slice(0, 32)}...${name.slice(-8)}` : `${name}`
  const size = `${(file.size / (1024 * 1024)).toFixed(2)} MB`

  const editFile = () => {
    if (editedName) {
      setEditedName('')
      onEdit(`${editedName}.${file.name.split('.')[1]}`)
    } else {
      const nameChunks = name.split('.')
      nameChunks.pop()
      const editedName = nameChunks.join('.')

      setEditedName(editedName)
      onEdit(editedName)
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
    <div>
      <div
        className={cx(style['file'], {
          [style['file_message']]: Boolean(message),
        })}
      >
        <div className={style['file__load']}>
          {(uploadStatus === 'ready' || uploadStatus === 'failed') && (
            <MdFileUpload
              size={32}
              className={style['file__control']}
              onClick={uploadFile}
            />
          )}
          {uploadStatus === 'uploading' && `${progress ?? 0}%`}
          {uploadStatus === 'success' && (
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
            {(uploadStatus === 'ready' || uploadStatus === 'failed') && (
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
            {uploadStatus === 'success' && (
              <MdFileDownload
                size={26}
                className={style['file__control']}
                onClick={downloadFile}
              />
            )}
          </div>
        )}
      </div>
      {Boolean(message) && (
        <div
          className={cx(style['file-message'], {
            [style['file-message_error']]: uploadStatus === 'failed',
          })}
        >
          {message}
        </div>
      )}
    </div>
  )
}

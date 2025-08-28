import { useRef, useState, useEffect } from 'react'
import {
  MdFileUpload,
  MdFileDownload,
  MdCheckCircle,
  MdEdit,
  MdCheck,
  MdDelete,
} from 'react-icons/md'
import cx from 'clsx'
import { formatFileSize } from '@shared/utils/formatFileSize'
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
}

export const File = (props: Props) => {
  const {
    value: file,
    name = '',
    uploadStatus = 'ready',
    message = '',
    progress,
    isEdit,
    onEdit = () => {},
    onDelete = () => {},
    onUpload = () => {},
  } = props

  const fileNameEl = useRef<HTMLInputElement>(null)
  const [editedName, setEditedName] = useState('')

  const formatedName =
    name.length > 32 ? `${name.slice(0, 32)}...${name.slice(-8)}` : `${name}`

  const size = formatFileSize(file.size)

  const editFile = () => {
    if (!isEdit) {
      onEdit(name)

      const nameChunks = name.split('.').slice(0)
      const editedName = nameChunks.slice(0, nameChunks.length - 1).join('.')
      setEditedName(editedName)
    } else if (!editedName) {
      onEdit(name)
    } else {
      onEdit(`${editedName}.${file.name.split('.')[1]}`)
    }
  }

  const renameFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(event.target.value)
  }

  const uploadFile = () => {
    if (!file) return

    if (isEdit) {
      fileNameEl.current?.focus()
      return
    }

    onUpload(file)
  }

  const downloadFile = () => {
    const url = URL.createObjectURL(file)

    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()

    URL.revokeObjectURL(url)
  }

  const deleteFile = () => {
    onDelete()
  }

  useEffect(() => {
    if (isEdit) {
      fileNameEl.current?.focus()
    }
  }, [isEdit])

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
              ref={fileNameEl}
              type="text"
              name="fileName"
              defaultValue={editedName}
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
              <>
                <MdFileDownload
                  size={26}
                  className={style['file__control']}
                  onClick={downloadFile}
                />
                <MdDelete
                  size={24}
                  className={style['file__control']}
                  onClick={deleteFile}
                />
              </>
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

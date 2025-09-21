import {useRef, useEffect} from "react"
import {
  MdFileUpload,
  MdFileDownload,
  MdCheckCircle,
  MdEdit,
  MdCheck,
  MdDelete,
} from "react-icons/md"
import cx from "clsx"
import {formatFileSize} from "@shared/utils/formatFileSize"
import type {FileInfo} from "../types"
import style from "./File.module.css"

interface Props {
  value: FileInfo
  onUpdate?: (file: FileInfo) => void
  onDelete?: (file: FileInfo) => void
  onUpload?: (file: FileInfo) => void
}

export const File = (props: Props) => {
  const {value: file, onUpdate = () => {}, onDelete = () => {}, onUpload = () => {}} = props
  const editedFileRef = useRef<FileInfo>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const formatedName =
    file.name.length > 32 ? `${file.name.slice(0, 32)}...${file.name.slice(-8)}` : `${file.name}`

  const size = formatFileSize(file.data.size)

  const updateFile = () => {
    if (!file.isEdit) {
      file.isEdit = true
      editedFileRef.current = {...file}

      const nameChunks = file.name.split(".").slice(0)
      file.name = nameChunks.slice(0, nameChunks.length - 1).join(".")

      onUpdate(file)
    } else if (!inputRef.current!.value) {
      file.name = editedFileRef.current!.name
      file.isEdit = false
      editedFileRef.current = null
      onUpdate(file)
    } else {
      file.name = `${inputRef.current!.value}.${file.data.name.split(".")[1]}`
      file.isEdit = false

      if (file.name !== editedFileRef.current?.name) {
        file.message = ""
        file.uploadStatus = "ready"
      }

      editedFileRef.current = null
      onUpdate(file)
    }
  }

  const uploadFile = () => {
    if (!file) return

    if (file.isEdit) {
      inputRef.current?.focus()
      return
    }

    onUpload(file)
  }

  const downloadFile = () => {
    const url = URL.createObjectURL(file.data)

    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    a.click()

    URL.revokeObjectURL(url)
  }

  const deleteFile = () => {
    onDelete(file)
  }

  useEffect(() => {
    if (file.isEdit) {
      inputRef.current?.focus()
    }
  }, [file.isEdit])

  return (
    <div>
      <div
        className={cx(style["file"], {
          [style["file_message"]]: Boolean(file.message),
        })}
      >
        <div className={style["file__load"]}>
          {(file.uploadStatus === "ready" || file.uploadStatus === "failed") && (
            <MdFileUpload size={32} className={style["file__control"]} onClick={uploadFile} />
          )}
          {file.uploadStatus === "uploading" && `${file.progress ?? 0}%`}
          {file.uploadStatus === "success" && (
            <MdCheckCircle size={32} className={style["file__uploaded"]} />
          )}
        </div>
        <div className={style["file__description"]}>
          {file.isEdit && (
            <input
              ref={inputRef}
              type="text"
              name="fileName"
              defaultValue={file.name}
              className={style["file__input"]}
            />
          )}
          {!file.isEdit && (
            <>
              <div>{formatedName}</div>
              <div>{size}</div>
            </>
          )}
        </div>
        {file.uploadStatus !== "uploading" && (
          <div className={style["file__controls"]}>
            {(file.uploadStatus === "ready" || file.uploadStatus === "failed") && (
              <>
                {!file.isEdit && (
                  <MdEdit size={22} className={style["file__control"]} onClick={updateFile} />
                )}
                {file.isEdit && (
                  <MdCheck size={22} className={style["file__control"]} onClick={updateFile} />
                )}
                <MdDelete size={24} className={style["file__control"]} onClick={deleteFile} />
              </>
            )}
            {file.uploadStatus === "success" && (
              <>
                <MdFileDownload
                  size={26}
                  className={style["file__control"]}
                  onClick={downloadFile}
                />
                <MdDelete size={24} className={style["file__control"]} onClick={deleteFile} />
              </>
            )}
          </div>
        )}
      </div>
      {Boolean(file.message) && (
        <div
          className={cx(style["file-message"], {
            [style["file-message_error"]]: file.uploadStatus === "failed",
          })}
        >
          {file.message}
        </div>
      )}
    </div>
  )
}

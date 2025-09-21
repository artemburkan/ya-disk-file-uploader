import {useRef, useCallback} from "react"
import {IoCloudUpload} from "react-icons/io5"
import {File} from "./file"
import type {FileInfo, UploadFileProcess} from "./types"
import {useFileUploader} from "./useFileUploader"
import style from "./FileUploader.module.css"

interface Props {
  description?: string
  onUpload?: (fileInfo: FileInfo, process?: UploadFileProcess) => void
}

export const FileUploader = (props: Props) => {
  const {description, onUpload = () => {}} = props

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const {files, addFiles, updateFile, deleteFile} = useFileUploader()

  const click = () => {
    inputRef.current?.click()
  }

  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    const addedFiles = Array.from(event.target.files)

    formRef.current?.reset()
    addFiles(addedFiles)
  }

  const uploadFile = useCallback(
    (file: FileInfo) => {
      updateFile({...file, uploadStatus: "uploading", progress: 0, message: ""})

      onUpload(file, {
        progress: (progress) => {
          updateFile(file, (file) => ({...file, progress}))
        },
        finish: (process = {}) => {
          const {status = "ready", message = ""} = process
          updateFile(file, (file) => ({...file, uploadStatus: status, message}))
        },
      })
    },
    [onUpload, updateFile],
  )

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form ref={formRef} className={style["file-uploader"]} onSubmit={submit}>
      <div className={style["file-uploader__drop-area"]} onClick={click}>
        <input ref={inputRef} name="uploadFile" type="file" multiple hidden onChange={change} />
        <IoCloudUpload size={64} className={style["file-uploader__icon"]} />
        {description}
      </div>
      {files.map((file) => (
        <File
          key={file.id}
          value={file}
          onUpdate={updateFile}
          onDelete={deleteFile}
          onUpload={uploadFile}
        />
      ))}
    </form>
  )
}

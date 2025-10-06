import {useRef, useCallback} from "react"
import cx from "clsx"
import {IoCloudUpload} from "react-icons/io5"
import {File} from "./file"
import type {FileInfo, UploadFileProcess} from "./types"
import {useDropzone} from "./useDropzone"
import style from "./Dropzone.module.css"

interface Description {
  initial: string
  over: string
}

interface Props {
  description?: Description
  onUpload?: (fileInfo: FileInfo, process: UploadFileProcess) => void
}

export const Dropzone = (props: Props) => {
  const {description = {initial: "", over: ""}, onUpload = () => {}} = props

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const {files, isOverArea, setIsOverArea, addFiles, updateFile, deleteFile} = useDropzone()

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

  const dragEnter = () => {
    setIsOverArea(true)
  }

  const dragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const dragLeave = () => {
    setIsOverArea(false)
  }

  const drop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (!event.dataTransfer.files) return
    const addedFiles = Array.from(event.dataTransfer.files)
    addFiles(addedFiles)
    setIsOverArea(false)
  }

  return (
    <form ref={formRef} className={style["dropzone"]} onSubmit={submit}>
      <div
        className={cx(style["dropzone__area"], {
          [style["dropzone__area_bordered"]]: isOverArea,
        })}
        onClick={click}
        onDragEnter={dragEnter}
        onDragOver={dragOver}
        onDragLeave={dragLeave}
        onDrop={drop}
      >
        <input ref={inputRef} name="uploadFile" type="file" multiple hidden onChange={change} />
        <IoCloudUpload size={64} className={style["dropzone__icon"]} />
        {!isOverArea ? description.initial : description.over}
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

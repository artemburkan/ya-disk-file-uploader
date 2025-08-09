import { FaFile } from 'react-icons/fa'
// import { ImBin } from 'react-icons/im'
// import { TiDeleteOutline } from 'react-icons/ti'
// import { IoCloseOutline } from 'react-icons/io5'
import { MdEdit } from 'react-icons/md'
import { MdFileUpload } from 'react-icons/md'
import { MdDelete } from 'react-icons/md'
import style from './File.module.css'

interface Props {
  name: string
  size: string
  value: File
  onDelete?: () => void
  onUpload?: (file: File) => void
}

export const File = (props: Props) => {
  const {
    name,
    size,
    value: file,
    onUpload = () => {},
    onDelete = () => {},
  } = props

  const editFile = () => {}

  const uploadFile = () => {
    if (!file) return

    onUpload(file)
  }

  const deleteFile = () => {
    if (!file) return

    onDelete()
  }

  return (
    <div className={style['file']}>
      <div className={style['file__icon']}>
        <FaFile size={36} />
      </div>
      <div className={style['file__description']}>
        <div>{name}</div>
        <div>{size}</div>
      </div>
      <div className={style['file__controls']}>
        <MdEdit
          size={22}
          className={style['file__control']}
          onClick={editFile}
        />
        <MdFileUpload
          size={24}
          className={style['file__control']}
          onClick={uploadFile}
        />
        <MdDelete
          size={24}
          className={style['file__control']}
          onClick={deleteFile}
        />
      </div>
    </div>
  )
}

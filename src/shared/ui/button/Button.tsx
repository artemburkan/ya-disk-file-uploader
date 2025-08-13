import cx from 'clsx'
import styles from './Button.module.css'

export const Button = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return (
    <button className={cx(styles.button, props.className)}>
      {props.children}
    </button>
  )
}

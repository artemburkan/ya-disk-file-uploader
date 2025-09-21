import styles from "./ScreenLayout.module.css"

interface Props {
  children: React.ReactNode
}

export const ScreenLayout = ({children}: Props) => {
  return <div className={styles.screenLayout}>{children}</div>
}

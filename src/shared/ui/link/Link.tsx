import cx from "clsx"
import styles from "./Link.module.css"

interface Props {
  hasDecorator?: boolean
}

type LinkProps = React.PropsWithChildren<Props & React.AnchorHTMLAttributes<HTMLAnchorElement>>

export const Link = ({hasDecorator, className, children, href}: LinkProps) => {
  const decorator = {[styles["link__decorator"]]: hasDecorator ?? false}

  return (
    <a
      className={cx(decorator, styles["link"], className)}
      target="_blank"
      rel="noreferrer"
      href={href}
    >
      {children}
    </a>
  )
}

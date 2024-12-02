import { FC, ReactNode } from "react"
import styles from "./ContentContainer.module.css"

interface Props {
  children: React.ReactNode
}

export const ContentContainer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className={`container mx-auto flex-1 ${styles.container}`}>
      <div className="flex w-full flex-col justify-center">{children}</div>
    </div>
  )
}

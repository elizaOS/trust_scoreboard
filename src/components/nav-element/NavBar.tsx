import { FC } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import styles from "./NavBar.module.css"
import { useState } from "react"
import { RiBarChart2Fill } from "react-icons/ri"

interface NavBarProps {
  // Add any props if needed
  children?: React.ReactNode
}

const NavBar: FC<NavBarProps> = ({ children }) => {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Add search functionality
  }

  return (
    <nav className="sticky top-0 z-[100] h-[66px] w-full bg-black/25 px-6 py-3.5 backdrop-blur-[69px]">
      <div className="flex h-full items-center justify-end">
        {children}
      </div>
    </nav>
  )
}

export default NavBar

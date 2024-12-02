import { FC } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import styles from "./NavBar.module.css"
import { useState } from "react"
import { RiBarChart2Fill } from "react-icons/ri"

interface NavBarProps {
  // Add any props if needed
}

const NavBar: FC<NavBarProps> = () => {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Add search functionality
  }

  return (
    <nav className="sticky top-0 z-[100] h-[66px] w-full px-6 py-3.5">
      <div className="flex h-full items-center justify-between">
        {/* Centered Logo */}
        <Link href="https://elizaos.ai/ai16z" className="">
          <Image src="/logo.svg" alt="Logo" width={50} height={29} priority />
        </Link>

        <Link
          href="https://discord.com/invite/ai16z"
          className="inline-flex items-center rounded-full bg-white/20 px-3.5 py-2 transition-all duration-300 hover:bg-white/30"
        >
          <span className="text-base font-semibold text-white">
            Join Discord
          </span>
        </Link>
        {/* Search Bar */}
        {/* <div className={`${styles.searchContainer} hidden`}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </form>
        </div> */}
      </div>
    </nav>
  )
}

export default NavBar

import { FC } from 'react';
import Link from "next/link";
import React, { useState } from "react";
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSession } from "next-auth/react";
import styles from './NavBar.module.css';

interface NavBarProps {
  // Add any props if needed
}

const NavBar: FC<NavBarProps> = () => {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const { publicKey } = useWallet();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Add search functionality
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/logo.svg"
            alt="Logo"
            width={24}
            height={24}
            priority
          />
        </Link>
      </div>

      <div className={styles.searchContainer}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </form>
      </div>

      <div className={styles.navLinks}>
        <Link href="/explorer" className={styles.navLink}>
          Explorer
        </Link>
        {session && (
          <Link href="/profile" className={styles.navLink}>
            Profile
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

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
            width={60}
            height={60}
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

      <div className={styles.actionsContainer}>
        <Link href="/explorer" className={styles.actionButton}>
          Explorer
        </Link>
        <a 
          href="https://www.daos.fun/HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.actionButton}
        >
          Become Partner
        </a>
        {session ? (
          <Link href="/profile" className={styles.profileContainer}>
            <Image
              src={session.user?.image || '/default-avatar.png'}
              alt="Profile"
              width={32}
              height={32}
              className={styles.profileImage}
            />
            {publicKey && (
              <span className={styles.profileText}>
                {`${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`}
              </span>
            )}
          </Link>
        ) : (
          <Link href="/api/auth/signin" className={styles.actionButton}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

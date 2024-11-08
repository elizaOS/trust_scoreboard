import { FC } from 'react';
import Link from "next/link";
import React, { useState } from "react";
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSession } from "next-auth/react";
import styles from './NavBar.module.css';

const truncateAddress = (address: string, length: number = 4): string => {
  if (!address) return '';
  if (window.innerWidth <= 768) {
    return `${address.slice(0, 3)}..${address.slice(-2)}`;
  }
  return `${address.slice(0, length)}..${address.slice(-length)}`;
};

export const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const { publicKey } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search query:', searchQuery);
  };

  const ProfileElement = () => (
    <div className={styles.profileContainer}>
      <Link href="/profile" className={styles.profileLink}>
        {session?.user?.image ? (
          <>
            <Image
              src={session.user.image}
              alt="Profile"
              width={32}
              height={32}
              className={styles.profileImage}
              onError={(e) => {
                e.currentTarget.src = "/default-avatar.png"
              }}
            />
            {publicKey && (
              <span className={styles.walletAddress}>
                {truncateAddress(publicKey.toString())}
              </span>
            )}
          </>
        ) : (
          <span className={styles.profileText}>Profile</span>
        )}
      </Link>
    </div>
  );

  return (
    <div className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link href="/" passHref className={styles.logoLink}>
          <Image
            src="/logo.svg"
            alt="Site Logo"
            width={24}
            height={24}
            priority
            className={styles.logo}
          />
        </Link>
      </div>

      <form onSubmit={handleSearch} className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by wallet address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          <Image
            src="/search-icon.svg"
            alt="Search"
            width={20}
            height={20}
          />
        </button>
      </form>

      <div className={styles.actionsContainer}>
        {session?.user && (
          <>
            <a 
              href="https://www.daos.fun/HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionButton}
            >
              Become Partner
            </a>
            <a 
              href="/explorer"
              className={styles.actionButton}
            >
              Explorer
            </a>
          </>
        )}
        <ProfileElement />
      </div>
    </div>
  );
};

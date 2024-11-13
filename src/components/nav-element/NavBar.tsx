// import { FC } from 'react';
// import Link from "next/link";
// import React, { useState } from "react";
// import Image from 'next/image';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { useSession } from "next-auth/react";

// import ApiSection from 'components/profile/ApiSection';

// interface NavBarProps {
//   // Add any props if needed
// }

// const NavBar: FC<NavBarProps> = () => {


//   return (
//     <nav className={styles.navbar}>
//       <div className={styles.logoContainer}>
//         <Link href="/" className={styles.logoLink}>
//           <Image
//             src="/logo.svg"
//             alt="Logo"
//             width={60}
//             height={60}
//             priority
//           />
//         </Link>
//       </div>


//       <div className={styles.actionsContainer}>

//         {session ? (
//           <>
//             <Link href="/" className={styles.iconButton}>
//               <Image
//                 src="/menu_medal.svg"
//                 alt="Medal"
//                 width={24}
//                 height={24}
//               />
//             </Link>
//             <Link href="/profile" className={styles.profileContainer}>
//               <Image
//                 src={session.user?.image || '/default-avatar.png'}
//                 alt="Profile"
//                 width={32}
//                 height={32}
//                 className={styles.profileImage}
//               />
//             </Link>
//           </>
//         ) : (
//           <Link href="/api/auth/signin" className={styles.actionButton}>
//             Sign In
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default NavBar;

import { FC } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { useSession } from "next-auth/react";
import styles from './NavBar.module.css';
import { useState } from 'react';

interface NavBarProps {
  // Add any props if needed
}

const NavBar: FC<NavBarProps> = () => {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      // Add search functionality
    };

  return (
    <nav className="w-full h-16 bg-[#202120] px-4">
      <div className="h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={60}
            height={32}
            priority
          />
        </Link>

        {/*Search Bar */}


        <div className={`${styles.searchContainer} hidden`}>
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

        {/* Right-side items */}
        <div className="flex items-center gap-4">
          <Link href="/explorer" className={`hidden ${styles.actionButton}`}>
            Explorer
          </Link>
          <Link href="/saas" className={`hidden ${styles.actionButton}`}>
            Get API Access
          </Link>
          <Link href="/eliza" className={`hidden ${styles.actionButton} ${styles.elizaButton}`}>
            Get an Eliza
          </Link>
          <Link href="/" className="p-2 hover:bg-white/10  rounded-full">
            <Image
              src="/menu_medal.svg"
              alt="Medal"
              width={24}
              height={24}
            />
          </Link>
          {session ? (
            <Link href="/profile" className="p-1 hover:bg-white/10 rounded-full">
              <Image
                src={session.user?.image || '/default-avatar.png'}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            </Link>
          ) : (
            <Link href="/api/auth/signin" className="p-1 hover:bg-white/10 rounded-full">
              <Image
                src="/default-avatar.png"
                alt="Sign In"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

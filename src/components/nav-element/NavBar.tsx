import { FC } from 'react';
import Link from "next/link";
import React, { useState } from "react";
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import NavElement from '.';
import { useSession } from "next-auth/react";

const truncateAddress = (address: string, length: number = 4): string => {
  if (!address) return '';
  return `${address.slice(0, length)}..${address.slice(-length)}`;
};

export const AppBar: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { data: session } = useSession();
  const { publicKey } = useWallet();

  return (
    <div>
      <div className="navbar flex h-20 flex-row md:mb-2 text-black bg-[#E8E3D5] text-neutral-content">
        <div className="navbar-start align-items-center">
          <div className="hidden sm:inline w-22 h-22 md:p-2 ml-10">
            <Link href="/" passHref className="text-secondary hover:text-white">
              <Image 
                src="/logo.svg"
                alt="Site Logo"
                width={24}
                height={24}
                priority
                className="h-6 w-auto"
              />
            </Link>
          </div>
        </div>

        <div className="navbar-end">
          <div className="hidden md:inline-flex align-items-center text-black justify-items gap-6">
            {session?.user?.image ? (
              <div className="flex items-center gap-2 bg-[#e8e3d6] px-4 py-2 rounded-full">
                <Link href="/profile" className="flex items-center gap-2">
                  <Image 
                    src={session.user.image} 
                    alt="Profile" 
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80"
                    onError={(e) => {
                      e.currentTarget.src = "/default-avatar.png"
                    }}
                  />
                  {publicKey && (
                    <span className="text-[#9a8c7c] font-medium">
                      {truncateAddress(publicKey.toString())}
                    </span>
                  )}
                </Link>
              </div>
            ) : (
              <NavElement 
                label="Profile" 
                href="/profile" 
                navigationStarts={() => setIsNavOpen(false)} 
              />
            )}
          </div>
          <label htmlFor="my-drawer" className="btn-gh items-center justify-between md:hidden mr-6" onClick={() => setIsNavOpen(!isNavOpen)}>
            <div className="HAMBURGER-ICON space-y-2.5 ml-5">
              <div className={`h-0.5 w-8 bg-purple-600 ${isNavOpen ? 'hidden' : ''}`} />
              <div className={`h-0.5 w-8 bg-purple-600 ${isNavOpen ? 'hidden' : ''}`} />
              <div className={`h-0.5 w-8 bg-purple-600 ${isNavOpen ? 'hidden' : ''}`} />
            </div>
            <div className={`absolute block h-0.5 w-8 animate-pulse bg-purple-600 ${isNavOpen ? "" : "hidden"}`} style={{ transform: "rotate(45deg)" }} />
            <div className={`absolute block h-0.5 w-8 animate-pulse bg-purple-600 ${isNavOpen ? "" : "hidden"}`} style={{ transform: "rotate(135deg)" }} />
          </label>
        </div>
      </div>
    </div>
  );
};

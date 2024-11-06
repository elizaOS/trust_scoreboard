import { FC } from 'react';
import Link from "next/link";
import React, { useState } from "react";
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import NavElement from '.';
import { useSession } from "next-auth/react";

const truncateAddress = (address: string, length: number = 4): string => {
  if (!address) return '';
  if (window.innerWidth <= 768) {
    return `${address.slice(0, 3)}..${address.slice(-2)}`;
  }
  return `${address.slice(0, length)}..${address.slice(-length)}`;
};

export const AppBar: React.FC = () => {
  const { data: session } = useSession();
  const { publicKey } = useWallet();

  const ProfileElement = () => (
    <div className="flex items-center gap-2 bg-[#EDE9DE] px-4 py-2 rounded-full">
      <Link href="/profile" className="flex items-center gap-2">
        {session?.user?.image ? (
          <>
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
              <span className="text-[#9a8c7c] font-medium text-sm md:text-base">
                {truncateAddress(publicKey.toString())}
              </span>
            )}
          </>
        ) : (
          <span className="text-[#9a8c7c] font-medium">
            Profile
          </span>
        )}
      </Link>
    </div>
  );

  return (
    <div>
      <div className="navbar flex h-20 flex-row md:mb-2 text-black bg-[#E8E3D5] text-neutral-content">
        <div className="navbar-start align-items-center">
          <div className="w-22 h-22 md:p-2 ml-4 md:ml-10">
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
          <button className='py-2 px-4 bg-[#F98C13] rounded-xl'>
            Become Partner
          </button>
          <div className="flex items-center justify-end gap-6 px-4">
            <ProfileElement />
          </div>
        </div>
      </div>
    </div>
  );
};

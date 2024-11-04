import { FC, useState } from "react";
import { SignMessage } from '../../components/SignMessage';
import { SendTransaction } from '../../components/SendTransaction';
import { SendVersionedTransaction } from '../../components/SendVersionedTransaction';
import ProfileTotals from '../../components/ProfileTotals';
import Socials from '../../components/Socials';
import ProfileWallets from '../../components/ProfileWallets';
import ProfileHoldings from '../../components/ProfileHoldings';
import styles from './index.module.css';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

type View = 'profile' | 'holdings';

const ProfileView: FC = () => {
  const { data: session, status } = useSession();
  const [currentView, setCurrentView] = useState<View>('profile');

  const handleViewChange = (view: View) => {
    console.log('View changed to:', view); // Debug log
    setCurrentView(view);
  };

  return (
    <div className={`${styles.container} text-left`}>
      <div className="flex flex-col items-center mb-8">
      <h1 className="font-display text-2xl mt-4 mx-4 text-black">Profile</h1>
        {status === 'loading' ? (
          <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
        ) : session?.user?.image ? (
          <Image
            src={session.user.image}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full"
            priority
          />
        ) : (
          <Image
            src="/default-avatar.png"
            alt="Default Profile"
            width={80}
            height={80}
            className="rounded-full"
            priority
          />
        )}
        
      </div>
      
      <div className="flex justify-center w-full mb-8">
        <ProfileTotals onViewChange={handleViewChange} />
      </div>

      <div className={`${styles.content} text-left`}>
        {currentView === 'profile' ? (
          <>
           
            <Socials />
            
            <ProfileWallets />
          </>
        ) : (
          <ProfileHoldings />
        )}
      </div>
    </div>
  );
};

export default ProfileView;

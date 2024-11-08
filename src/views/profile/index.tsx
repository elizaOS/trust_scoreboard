import { FC, useState } from "react";
import ProfileTotals from '../../components/Profile/ProfileTotals';
import Socials from '../../components/Socials';
import ProfileWallets from '../../components/Profile/ProfileWallets';
import ProfileHoldings from '../../components/Profile/ProfileHoldings';
import styles from './index.module.css';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { PiUserCircleDashedThin } from "react-icons/pi";

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
      <div className="flex flex-col items-center">
        <h1 className={`${styles.title} font-display font-bold text-2xl mt-4 mx-6 text-black`}>Profile</h1>
        {status === 'loading' ? (
          <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
        ) : session?.user?.image ? (
          <Image
            src={session.user.image}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full"
            priority
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-[#ded8c7] flex justify-center items-center">
            <PiUserCircleDashedThin className="w-20 h-20" />
          </div>

        )}
      </div>

      <div className="flex justify-center w-full" style={{ padding: '0 16px', maxWidth: '600px' }}>
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

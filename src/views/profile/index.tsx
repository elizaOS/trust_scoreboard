import { FC, useState } from "react";
import { SignMessage } from '../../components/SignMessage';
import { SendTransaction } from '../../components/SendTransaction';
import { SendVersionedTransaction } from '../../components/SendVersionedTransaction';
import ProfileTotals from '../../components/ProfileTotals';
import Socials from '../../components/Socials';
import ProfileWallets from '../../components/ProfileWallets';
import ProfileHoldings from '../../components/ProfileHoldings';
import styles from './index.module.css';

type View = 'profile' | 'holdings';

const ProfileView: FC = () => {
  const [currentView, setCurrentView] = useState<View>('profile');

  const handleViewChange = (view: View) => {
    console.log('View changed to:', view); // Debug log
    setCurrentView(view);
  };

  return (
    <div className={`${styles.container} text-left`}>
      <ProfileTotals onViewChange={handleViewChange} />
      <div className={`${styles.content} text-left`}>
        {currentView === 'profile' ? (
          <>
            <h1 className="text-left font-display text-2xl mb-4">Socials</h1>
            <Socials />
            <h1 className="text-left font-display text-2xl mb-4 mt-8">Wallets</h1>
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

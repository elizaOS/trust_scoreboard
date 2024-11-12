import { FC, useState } from "react";
import ProfileData from '../../components/profile/ProfileData';
import ProfileTotals from '../../components/profile/ProfileTotals';
import Socials from '../../components/profile/Socials';
import ProfileWallets from '../../components/profile/ProfileWallets';
import ProfileHoldings from '../../components/profile/ProfileHoldings';
import ApiSection from '../../components/profile/ApiSection';
import styles from './index.module.css';

type View = 'profile' | 'holdings';

const ProfileView: FC = () => {
  const [currentView, setCurrentView] = useState<View>('profile');

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  return (
    <div className={`${styles.container} text-left`}>
      <ProfileData />
      
      <div className="flex justify-center w-full" style={{ padding: '0 16px', maxWidth: '600px' }}>
        <ProfileTotals onViewChange={handleViewChange} />
      </div>

      <div className={`${styles.content} text-left`}>
        {currentView === 'profile' ? (
          <>
            <div className={styles.rowContainer}>
              <div className={styles.column}>
                <Socials />
              </div>
              <div className={styles.column}>
                <ProfileWallets />
              </div>
            </div>
          </>
        ) : (
          <ProfileHoldings />
        )}
      </div>
    </div>
  );
};

export default ProfileView;

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
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.profileDataWrapper}>
          <ProfileData />
        </div>
        <div className={styles.profileTotalsWrapper}>
          <ProfileTotals onViewChange={handleViewChange} />
        </div>
        <div className={styles.contentArea}>
          {currentView === 'profile' ? (
            <div className={styles.profileContent}>
              <div className={styles.rowContainer}>
                <div className={`px-10 ${styles.column}`}>
                  <Socials />
                </div>
                <div className={styles.column}>
                  <ProfileWallets />
                </div>
              </div>
            </div>
          ) : (
            <ProfileHoldings />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;




import { FC } from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { truncateAddress } from '../../utils/helpers';
import { useDashboard } from '../../hooks/useDashboard';
import type { Partner } from '../../types/dashboard';
import styles from './LeaderboardMedals.module.css';

const LeaderboardMedals: FC = () => {
  const { data: dashboardData, isLoading } = useDashboard();
  
  if (isLoading || !dashboardData) {
    return <div className={styles.container}>Loading...</div>;
  }

  // Get top 3 wallets sorted by trust score
  const topThree = dashboardData.partners
    .sort((a, b) => b.trustScore - a.trustScore)
    .slice(0, 3)
    .map((partner, index) => ({
      ...partner,
      position: index + 1
    }));

  // Reorder array to show 2nd, 1st, 3rd
  const reorderedTopThree = [
    topThree[1], // 2nd place
    topThree[0], // 1st place
    topThree[2]  // 3rd place
  ];

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return styles.gold;
      case 2:
        return styles.silver;
      case 3:
        return styles.bronze;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      {reorderedTopThree.map((user) => (
        <div 
          key={user.wallet} 
          className={`${styles.medalHolder} ${user.position === 1 ? styles.firstPlace : ''}`}
        >
          <div className={styles.imageWrapper}>
            <div className={`${styles.medal} ${getMedalColor(user.position)}`}>
              {user.position}
            </div>
            {user.image ? (
              <Image
                src={user.image}
                alt={truncateAddress(user.wallet)}
                width={user.position === 1 ? 80 : 64}
                height={user.position === 1 ? 80 : 64}
                className={styles.userImage}
              />
            ) : (
              <div className={`${styles.placeholderImage} ${getMedalColor(user.position)}`} />
            )}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.name}>{truncateAddress(user.wallet)}</span>
            <div className={`${styles.scoreWrapper} ${getMedalColor(user.position)}`}>
              <span className={styles.score}>
                {user.trustScore.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardMedals;

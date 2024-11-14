import { FC } from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { truncateAddress } from '../../utils/helpers';
import { useDashboard } from '../../hooks/useDashboard';
import type { Partner } from '../../types/dashboard';
import styles from './LeaderboardMedals.module.css';

const LeaderboardMedals: FC = () => {
  const { data: dashboardData, isLoading } = useDashboard();
  const positions = [2, 1, 3];
  const medalStyles = [styles.silver, styles.gold, styles.bronze];



  if (isLoading || !dashboardData) {
    return <div className={styles.container}>Loading...</div>;
  }

  // Ensure partners array exists and handle potential null/undefined values
  const topThree = (dashboardData?.partners || [])
    .filter(partner =>
      partner &&
      typeof partner.trustScore === 'number' &&
      !isNaN(partner.trustScore)
    )
    .sort((a, b) => {
      // Ensure we're comparing valid numbers
      const scoreA = typeof a.trustScore === 'number' ? a.trustScore : 0;
      const scoreB = typeof b.trustScore === 'number' ? b.trustScore : 0;
      return scoreB - scoreA;
    })
    .slice(0, 3);

  // Ensure we always have exactly 3 elements even if there's insufficient data
  const paddedTopThree = [...topThree];
  while (paddedTopThree.length < 3) {
    paddedTopThree.push(null);
  }

  // Reorder array to show 2nd, 1st, 3rd
  const reorderedTopThree = [
    paddedTopThree[1], // 2nd place
    paddedTopThree[0], // 1st place
    paddedTopThree[2]  // 3rd place
  ];

  return (
    <div className={styles.container}>
      {reorderedTopThree.map((user, index) => {
        return (
          <div
            key={user?.wallet || index}
            className={`${styles.medalHolder} ${index === 1 ? styles.firstPlace : ''}`}
          >
            <div className={styles.imageWrapper}>
              <div className={`${styles.medal} ${medalStyles[index]}`}>
                {positions[index]}
              </div>
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.wallet ? truncateAddress(user.wallet) : `Position ${positions[index]}`}
                  width={index === 1 ? 80 : 64}
                  height={index === 1 ? 80 : 64}
                  className={`${styles.userImage} ${medalStyles[index]}`}
                />
              ) : (
                <div
                  className={`${styles.placeholderImage} ${medalStyles[index]}`}
                  style={{ width: index === 1 ? '80px' : '64px', height: index === 1 ? '80px' : '64px' }}
                />
              )}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.name}>
                {user?.displayAddress || user?.wallet ? truncateAddress(user.displayAddress || user.wallet) : `Position ${positions[index]}`}
              </span>
              <div className={`${styles.scoreWrapper} ${medalStyles[index]}`}>
                <span className={styles.score}>
                  {user?.trustScore ? user.trustScore.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default LeaderboardMedals;




import { FC } from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { truncateAddress } from '../../utils/helpers';
import { useDashboard } from '../../hooks/useDashboard';
import type { Partner } from '../../types/dashboard';
import styles from './LeaderboardMedals.module.css';



const SkeletonMedal: FC<{ position: number }> = ({ position }) => {
  const isFirstPlace = position === 1;
  const size = isFirstPlace ? '120px' : '80px';

  return (
    <div className={`${styles.medalHolder} ${isFirstPlace ? styles.firstPlace : ''}`}>
      <div className={`${styles.imageWrapper} ${isFirstPlace ? styles.firstPlaceImage : ''}`}>
        <div className={`${styles.skeletonCircle} animate-pulse`}
          style={{
            width: size,
            height: size,
          }}
        />
      </div>
    </div>
  );
};

const LeaderboardMedals: FC = () => {
  const { data: dashboardData, isLoading } = useDashboard();
  const positions = [2, 1, 3];

  if (isLoading || !dashboardData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const topThree = (dashboardData?.partners || [])
    .filter(partner =>
      partner &&
      typeof partner.trustScore === 'number' &&
      !isNaN(partner.trustScore)
    )
    .sort((a, b) => {
      const scoreA = typeof a.trustScore === 'number' ? a.trustScore : 0;
      const scoreB = typeof b.trustScore === 'number' ? b.trustScore : 0;
      return scoreB - scoreA;
    })
    .slice(0, 3);

  const paddedTopThree = [...topThree];
  while (paddedTopThree.length < 3) {
    paddedTopThree.push(null);
  }

  const reorderedTopThree = [
    paddedTopThree[1], // 2nd place
    paddedTopThree[0], // 1st place
    paddedTopThree[2]  // 3rd place
  ];

  const getMedalClass = (index: number) => {
    switch (index) {
      case 1: return styles.gold;
      case 0: return styles.silver;
      default: return styles.bronze;
    }
  };

  return (
    <div className={styles.container}>
      {isLoading || !dashboardData ? (
        positions.map((position) => (
          <SkeletonMedal key={position} position={position} />
        ))
      ) : (

        reorderedTopThree.map((user, index) => {
          const isFirstPlace = index === 1;
          const medalClass = getMedalClass(index);

          return (
            <div
              key={user?.wallet || index}
              className={`${styles.medalHolder} ${isFirstPlace ? styles.firstPlace : ''}`}
            >
              <div className={`${styles.imageWrapper} ${isFirstPlace ? styles.firstPlaceImage : ''}`}>
                <div className={`${styles.medal} ${medalClass}`}>
                  {positions[index]}
                </div>
                <div className={`${styles.imageBorder} ${medalClass}`}>
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user && user.wallet ? truncateAddress(user.wallet) : `Position ${positions[index]}`}
                      width={isFirstPlace ? 120 : 80}
                      height={isFirstPlace ? 120 : 80}
                      className={styles.userImage}
                    />) : (
                    <div
                      className={`${styles.placeholderImage}`}
                      style={{ width: index === 1 ? '80px' : '64px', height: index === 1 ? '80px' : '64px' }}
                    />
                  )}
                </div>
              </div>
              <div className={styles.userInfo}>
                <span className={styles.name}>
                  {user?.displayAddress || user?.wallet ? truncateAddress(user.displayAddress || user.wallet) : `Position ${positions[index]}`}
                </span>
                <div className={`${styles.scoreWrapper} ${medalClass}`}>
                  <span className={`${styles.score} ${isFirstPlace ? styles.firstPlaceScore : ''}`}>
                    {user?.trustScore ? user.trustScore.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          );
        })

      )}

    </div>
  );
};

export default LeaderboardMedals;


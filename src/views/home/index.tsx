import { FC } from 'react';
import styles from './index.module.css';
import LeaderboardTotals from '../../components/Leaderboard/LeaderboardTotals';
import LeaderboardPartners from '../../components/Leaderboard/LeaderboardPartners';

export const HomeView: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          Leaderboard
        </h2>

        <div className={styles.section}>
          <LeaderboardTotals />
        </div>

        <div className={styles.leaderboardWrapper}>
          <LeaderboardPartners />
        </div>
      </div>
    </div>
  );
};
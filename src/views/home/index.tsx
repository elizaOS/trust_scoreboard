// FILE: src/views/HomeView.tsx
import { FC, useState } from 'react';
import styles from './index.module.css';
import LeaderboardTotals from '../../components/LeaderboardTotals';
import LeaderboardPartners from '../../components/LeaderboardPartners';

export const HomeView: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className="flex flex-col w-full">
          <h2 className={styles.title}>
            Leaderboard
          </h2>
          <LeaderboardTotals />
          <div className="relative group w-full">
            <LeaderboardPartners />
          </div>
        </div>
      </div>
    </div>
  );
};
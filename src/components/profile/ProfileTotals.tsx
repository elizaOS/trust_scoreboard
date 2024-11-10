import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from './ProfileTotals.module.css';

type View = 'profile' | 'holdings';

interface ProfileTotalsProps {
  onViewChange?: (view: View) => void;
}

interface MetricsData {
  trustScore: number;
  successRate: number;
  transparency: number;
  shillingScore: number;
  recommendations: number;
  rank: number;
  totalPartners: number;
}

const ProfileTotals: NextPage<ProfileTotalsProps> = ({ onViewChange = () => {} }) => {
  const { publicKey } = useWallet();
  const [activeView, setActiveView] = useState<View>('profile');
  const [metrics, setMetrics] = useState<MetricsData>({
    trustScore: 69.5,
    successRate: 83,
    transparency: 89,
    shillingScore: 25,
    recommendations: 428,
    rank: 41,
    totalPartners: 7283
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleViewChange = useCallback((view: View) => {
    setActiveView(view);
    onViewChange(view);
  }, [onViewChange]);

  const dateRange = "Sept 1 - Oct 1, 2024";

  return (
    <div className={styles.container}>
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard + ' ' + styles.trustScore}>
          <div className={styles.metricHeader}>
            <h3>Trust Score</h3>
            <div className={styles.scoreCircle}>{metrics.trustScore.toFixed(1)}/100</div>
          </div>
          <span className={styles.dateRange}>{dateRange}</span>
        </div>

        <div className={styles.metricCard + ' ' + styles.rank}>
          <div className={styles.metricHeader}>
            <h3>Rank</h3>
            <div className={styles.rankText}>#{metrics.rank}</div>
          </div>
          <span className={styles.subText}>of {metrics.totalPartners} partners</span>
        </div>

        <div className={styles.metricCard}>
          <h3>Success Rate</h3>
          <div className={styles.percentageValue + ' ' + styles.success}>
            {metrics.successRate}%
          </div>
          <span className={styles.dateRange}>{dateRange}</span>
        </div>

        <div className={styles.metricCard}>
          <h3>Transparency</h3>
          <div className={styles.percentageValue + ' ' + styles.transparency}>
            {metrics.transparency}%
          </div>
          <span className={styles.dateRange}>{dateRange}</span>
        </div>

        <div className={styles.metricCard}>
          <h3>Shilling Score</h3>
          <div className={styles.percentageValue + ' ' + styles.shilling}>
            {metrics.shillingScore}%
          </div>
          <span className={styles.subText}>Low risk shilling behavior detected</span>
        </div>

        <div className={styles.metricCard}>
          <h3>Recommendations</h3>
          <div className={styles.numberValue}>{metrics.recommendations}</div>
          <span className={styles.dateRange}>{dateRange}</span>
        </div>
      </div>

      <div className={styles.buttonParent}>
        <button
          className={activeView === 'profile' ? styles.button1 : styles.button}
          onClick={() => handleViewChange('profile')}
        >
          Profile
        </button>
        <button
          className={activeView === 'holdings' ? styles.button1 : styles.button}
          onClick={() => handleViewChange('holdings')}
        >
          Holdings
        </button>
      </div>
    </div>
  );
};

export default ProfileTotals;

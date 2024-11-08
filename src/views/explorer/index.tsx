import { FC } from 'react';
import Image from 'next/image';
import styles from './index.module.css';
import ScoreCard from '../../components/Trust/ScoreCard';

// Mock user data
const mockUserProfile = {
  address: "GxkXGe3YcqBdEgBrBh19X3wkLkgJXK2jA4k4nioW2Yg",
  discordUsername: "degenai",
  discordImage: "/profile_default.png", // Replace with actual default image path
  followers: 0,
  following: 0,
  netWorth: 74831.94,
  solBalance: 43.77886026,
  ai16zBalance: 22,
  scoreRank: 1
};

const ExplorerView: FC = () => {
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.userProfile}>
          <div className={styles.profileHeader}>
            <Image
              src={mockUserProfile.discordImage}
              alt={mockUserProfile.discordUsername}
              width={64}
              height={64}
              className={styles.profileImage}
            />
            <div className={styles.profileInfo}>
              <h2 className={styles.username}>{mockUserProfile.discordUsername}</h2>
              <p className={styles.address}>
                {mockUserProfile.address}
                <button className={styles.copyButton}>
                  <Image src="/copy-icon.svg" alt="Copy" width={16} height={16} />
                </button>
              </p>
            </div>
            <div className={styles.socialStats}>
              <div className={styles.statItem}>
                <p className={styles.statValue}>{mockUserProfile.following}</p>
                <p className={styles.statLabel}>following</p>
              </div>
              <div className={styles.statItem}>
                <p className={styles.statValue}>{mockUserProfile.followers}</p>
                <p className={styles.statLabel}>followers</p>
              </div>
            </div>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <p className={styles.metricLabel}>NET WORTH</p>
              <p className={styles.metricValue}>{formatCurrency(mockUserProfile.netWorth)}</p>
            </div>
            <div className={styles.metricCard}>
              <p className={styles.metricLabel}>SOL BALANCE</p>
              <p className={styles.metricValue}>{formatNumber(mockUserProfile.solBalance)} SOL</p>
            </div>
            <div className={styles.metricCard}>
              <p className={styles.metricLabel}>NUMBER OF ASSETS</p>
              <p className={styles.metricValue}>{mockUserProfile.ai16zBalance}</p>
            </div>
            <div className={styles.metricCard}>
              <p className={styles.metricLabel}>SCORE RANK</p>
              <p className={styles.metricValue}>#{mockUserProfile.scoreRank}</p>
            </div>
          </div>
        </div>

        <div className={styles.scoreCards}>
          <ScoreCard
            title="TRUST SCORE"
            value={85.5}
            description="Overall trust score based on multiple factors"
          />
          <ScoreCard
            title="RISK SCORE"
            value={65.4}
            description="Risk assessment of investment recommendations"
          />
          <ScoreCard
            title="CONSISTENCY"
            value={78.9}
            description="Consistency of investment performance"
          />
        </div>

        <div className={styles.performanceSection}>
          <h2 className={styles.sectionTitle}>Performance Metrics</h2>
          <div className={styles.performanceGrid}>
            <div className={styles.performanceCard}>
              <h3 className={styles.performanceLabel}>Total Recommendations</h3>
              <div className={styles.performanceValue}>150</div>
            </div>
            <div className={styles.performanceCard}>
              <h3 className={styles.performanceLabel}>Successful Recommendations</h3>
              <div className={styles.performanceValue}>125</div>
            </div>
            <div className={styles.performanceCard}>
              <h3 className={styles.performanceLabel}>Average Performance</h3>
              <div className={styles.performanceValue}>12.3%</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExplorerView;
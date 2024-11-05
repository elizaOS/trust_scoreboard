import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from './ProfileTotals.module.css';
import Image from 'next/image';

type View = 'profile' | 'holdings';

interface ProfileTotalsProps {
  onViewChange?: (view: View) => void;
}

interface DashboardData {
  partners: {
    owner: string;
    amount: number;
    createdAt: string;
  }[];
  userHoldings: {
    name: string;
    amount: number;
    price: number;
    value: number;
  }[];
  trustScores: {
    [key: string]: number;
  };
}

const ProfileTotals: NextPage<ProfileTotalsProps> = ({ onViewChange = () => {} }) => {
  const { publicKey } = useWallet();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('profile');

  const handleViewChange = useCallback((view: View) => {
    setActiveView(view);
    onViewChange(view);
  }, [onViewChange]);

  useEffect(() => {
    const fetchData = async () => {
      if (!publicKey) return;
      
      setIsLoading(true);
      try {
        // Fetch holdings data
        const holdingsResponse = await fetch(`/api/userHoldings?wallet=${publicKey.toString()}`);
        if (!holdingsResponse.ok) throw new Error('Failed to fetch holdings data');
        const holdingsData = await holdingsResponse.json();

        // Fetch dashboard data
        const dashboardResponse = await fetch(`/api/dashboard?wallet=${publicKey.toString()}`);
        if (!dashboardResponse.ok) throw new Error('Failed to fetch dashboard data');
        const dashboardData = await dashboardResponse.json();
        
        // Combine the data
        const combinedData: DashboardData = {
          partners: dashboardData.partners || [],
          userHoldings: holdingsData.holdings || [],
          trustScores: dashboardData.trustScores || {}
        };
        
        setData(combinedData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [publicKey]);

  const calculateMetrics = () => {
    if (!data || !publicKey) return { trustScore: 0, totalWorth: 0, rank: 0 };

    // Calculate total worth from holdings
    const totalWorth = data.userHoldings
      ?.filter(holding => ['ai16z', 'degenai'].includes(holding.name.toLowerCase()))
      .reduce((sum, holding) => sum + holding.value, 0) || 0;

    // Get trust score from dashboard data
    const trustScore = data.trustScores?.[publicKey.toString()] || 0;

    // Calculate rank from partners data
    const allPartners = [...(data.partners || [])];
    const userIndex = allPartners
      .sort((a, b) => b.amount - a.amount)
      .findIndex(partner => partner.owner === publicKey?.toString());
    const rank = userIndex === -1 ? 0 : userIndex + 1;

    return { trustScore, totalWorth, rank };
  };

  const formatValue = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}m`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}k`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  const { trustScore, totalWorth, rank } = calculateMetrics();

  const renderMetricItem = (value: React.ReactNode, label: string) => (
    <div className={styles.metricItem}>
      <div className={styles.metricValue}>
        {label === 'TRUST SCORE' && value === '0.0' ? (
          <div className={styles.tooltipContainer}>
            <Image 
              src="/null.svg"
              alt="Null trust score"
              width={20}
              height={20}
              className={styles.trustScoreImage}
            />
            <span className={styles.tooltip}>
              AI Marc is Calculating Your Trust
            </span>
          </div>
        ) : (
          value
        )}
      </div>
      <div className={styles.metricLabel}>{label}</div>
    </div>
  );

  return (
    <div>
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
      
      <div className={styles.metricsBar}>
        {!publicKey ? (
          <>
            {renderMetricItem('-', 'TRUST SCORE')}
            {renderMetricItem('-', 'AUM')}
            {renderMetricItem('-', 'RANK')}
          </>
        ) : isLoading ? (
          <>
            {renderMetricItem(<div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>, 'TRUST SCORE')}
            {renderMetricItem(<div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>, 'AUM')}
            {renderMetricItem(<div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>, 'RANK')}
          </>
        ) : error ? (
          <>
            {renderMetricItem('-', 'TRUST SCORE')}
            {renderMetricItem('-', 'AUM')}
            {renderMetricItem('-', 'RANK')}
          </>
        ) : (
          <>
            {renderMetricItem(trustScore.toFixed(1), 'TRUST SCORE')}
            {renderMetricItem(formatValue(totalWorth), 'AUM')}
            {renderMetricItem(rank || '-', 'RANK')}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileTotals;

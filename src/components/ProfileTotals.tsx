import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from './ProfileTotals.module.css';

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
        const response = await fetch(`/api/dashboard?wallet=${publicKey.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const dashboardData = await response.json();
        setData(dashboardData);
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

    const totalWorth = data.userHoldings?.reduce((sum, holding) => {
      return sum + (holding.amount * holding.price);
    }, 0) || 0;

    const trustScore = data.trustScores?.[publicKey.toString()] || 0;

    const allPartners = [...(data.partners || [])];
    const userIndex = allPartners
      .sort((a, b) => b.amount - a.amount)
      .findIndex(partner => partner.owner === publicKey?.toString());
    const rank = userIndex === -1 ? 0 : userIndex + 1;

    return { trustScore, totalWorth, rank };
  };

  const { trustScore, totalWorth, rank } = calculateMetrics();

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}m`;
    }
    return `$${value.toLocaleString()}`;
  };

  const renderMetricItem = (value: React.ReactNode, label: string) => (
    <div className={styles.metricItem}>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricLabel}>{label}</div>
    </div>
  );

  return (
    <div>
      <div className={styles.metricsBar}>
        {!publicKey ? (
          <>
            {renderMetricItem('-', 'TRUST SCORE')}
            {renderMetricItem('-', 'TOTAL WORTH')}
            {renderMetricItem('-', 'RANK')}
          </>
        ) : isLoading ? (
          <>
            {renderMetricItem(<div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>, 'TRUST SCORE')}
            {renderMetricItem(<div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>, 'TOTAL WORTH')}
            {renderMetricItem(<div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>, 'RANK')}
          </>
        ) : error ? (
          <>
            {renderMetricItem('-', 'TRUST SCORE')}
            {renderMetricItem('-', 'TOTAL WORTH')}
            {renderMetricItem('-', 'RANK')}
          </>
        ) : (
          <>
            {renderMetricItem(trustScore.toFixed(1), 'TRUST SCORE')}
            {renderMetricItem(formatCurrency(totalWorth), 'TOTAL WORTH')}
            {renderMetricItem(rank || '-', 'RANK')}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileTotals;

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import styles from './LeaderboardTotals.module.css';

interface DashboardData {
  partners: {
    owner: string;
    amount: number;
    createdAt: string;
  }[];
  prices: {
    address: string;
    usdPrice: number;
  }[];
}

const LeaderboardTotals: NextPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateMetrics = () => {
    if (!data?.partners) return {
      totalPartners: 0,
      totalWorth: 0,
      newPartners: 0
    };

    // Total number of partners
    const totalPartners = data.partners.length;

    // Calculate total worth from all partners
    const totalWorth = data.partners.reduce((sum, partner) => sum + partner.amount, 0);

    // Calculate new partners in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newPartners = data.partners.filter(partner => 
      new Date(partner.createdAt) > sevenDaysAgo
    ).length;

    return {
      totalPartners,
      totalWorth,
      newPartners
    };
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const { totalPartners, totalWorth, newPartners } = calculateMetrics();

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statItem}>
        <div className={styles.statValue}>{totalPartners.toLocaleString()}</div>
        <div className={styles.statLabel}>PARTNERS</div>
      </div>
      <div className={styles.statItem}>
        <div className={styles.statValue}>
          ${(totalWorth / 1000000).toFixed(2)}m
        </div>
        <div className={styles.statLabel}>TOTAL WORTH</div>
      </div>
      <div className={styles.statItem}>
        <div className={styles.statValue}>+{newPartners.toLocaleString()}</div>
        <div className={styles.statLabel}>NEW PARTNERS (7D)</div>
      </div>
    </div>
  );
};

export default LeaderboardTotals;

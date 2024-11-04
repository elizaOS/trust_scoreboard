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

// Add AI16Z token constant
const AI16Z_ADDRESS = 'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC';
const DECIMALS = 1_000_000_000; // 9 decimals for Solana tokens

const LeaderboardTotals: NextPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateMetrics = () => {
    if (!data?.partners || !data?.prices) return {
      totalPartners: 0,
      totalWorth: 0,
      newPartners: 0
    };

    const totalPartners = data.partners.length;
    const helpPrice = data.prices.find(p => p.address === AI16Z_ADDRESS)?.usdPrice || 0;
    const totalWorth = data.partners.reduce((sum, partner) => {
      return sum + partner.amount * helpPrice;
    }, 0);

    return {
      totalPartners,
      totalWorth,
      newPartners: data.partners.filter(partner => 
        new Date(partner.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
    };
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  const metrics = calculateMetrics();

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statItem}>
        <div className={styles.statValue}>{metrics.totalPartners.toLocaleString()}</div>
        <div className={styles.statLabel}>PARTNERS</div>
      </div>
      <div className={styles.statItem}>
        <div className={styles.statValue}>
          ${(metrics.totalWorth / 1000000).toFixed(2)}m
        </div>
        <div className={styles.statLabel}>TOTAL WORTH</div>
      </div>
      <div className={styles.statItem}>
        <div className={styles.statValue}>+{metrics.newPartners.toLocaleString()}</div>
        <div className={styles.statLabel}>NEW PARTNERS (7D)</div>
      </div>
    </div>
  );
};

export default LeaderboardTotals;

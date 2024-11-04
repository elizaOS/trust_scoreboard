import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import styles from './LeaderboardTotals.module.css';

interface Partner {
  createdAt: string;
  holdings: number;
}

interface LeaderboardData {
  partners: Partner[];
  prices: {
    address: string;
    usd: number;
  }[];
}

const LeaderboardTotals: NextPage = () => {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        const result = await response.json();
        setData(result);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!data) return null;

  const totalPartners = data.partners.length;
  const totalValue = data.partners.reduce((sum, partner) => 
    sum + (partner.holdings * data.prices[0].usd), 0);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const newPartners = data.partners.filter(partner => 
    new Date(partner.createdAt) > sevenDaysAgo).length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Total Partners</th>
            <th>Total Value</th>
            <th>New Partners (7d)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{totalPartners.toLocaleString()}</td>
            <td>{formatCurrency(totalValue)}</td>
            <td>{newPartners}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTotals;

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
          const text = await response.text();
          console.error('API Response:', {
            status: response.status,
            statusText: response.statusText,
            body: text
          });
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error(`Expected JSON but got ${contentType}`);
        }

        const result = await response.json();
        
        // Validate the data structure
        if (!result.partners || !result.prices) {
          console.error('Invalid data structure:', result);
          throw new Error('Invalid data format received');
        }

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
    if (!data?.partners || !data?.prices) return {
      totalPartners: 0,
      totalWorth: 0,
      newPartners: 0
    };

    // Total number of partners
    const totalPartners = data.partners.length;

    // Get HELP token price
    const helpPrice = data.prices.find(p => p.address === AI16Z_ADDRESS)?.usdPrice || 0;
    console.log('HELP Price:', helpPrice);

    // Calculate total worth - use the amount directly as it's already in tokens
    const totalWorth = data.partners.reduce((sum, partner) => {
      const worth = partner.amount * helpPrice; // Remove the DECIMALS division
      console.log('Partner calculation:', {
        amount: partner.amount,
        worth,
        helpPrice
      });
      return sum + worth;
    }, 0);

    console.log('Final total worth:', totalWorth);

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

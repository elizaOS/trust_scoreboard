import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from "next/image";
import styles from './ProfileHoldings.module.css';

interface TokenHolding {
  name: string;
  amount: number;
  allocation: number;
  price: number;
  value: number;
}

const TOKEN_ADDRESSES = {
  'AI16Z': 'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC',
  'DEGENAI': 'Gu3LDkn7Vx3bmCzLafYNKcDxv2mH7YN44NJZFXnypump'
};

const TOKEN_LOGOS: { [key: string]: string } = {
  'AI16Z': '/ai16z.png',
  'DEGENAI': '/degenai.png'
};

const ProfileHoldings: FC = () => {
  const { publicKey } = useWallet();
  const [holdings, setHoldings] = useState<TokenHolding[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoldings = async () => {
      if (!publicKey) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/userHoldings?wallet=${publicKey.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch holdings');
        }
        
        const data = await response.json();
        console.log('API response:', data);

        if (data.error) {
          throw new Error(data.error);
        }

        const validHoldings = data.holdings
          .filter(holding => holding.amount > 0)
          .sort((a, b) => b.value - a.value);

        console.log('Final holdings:', validHoldings);
        setHoldings(validHoldings);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch holdings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoldings();
  }, [publicKey]);

  if (isLoading) {
    return <div className="text-center">Loading holdings...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!publicKey) {
    return <div>Please connect your wallet to view holdings</div>;
  }

  return (
    <div className={styles.container}>
      <table className={styles.holdingsTable}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>HOLDING</th>
            <th className={styles.tableHeader}>ALLOCATION</th>
            <th className={styles.tableHeader}>VALUE</th>
          </tr>
        </thead>
        <tbody>
          {holdings.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-4">
                No holdings found
              </td>
            </tr>
          ) : (
            holdings.map((holding, index) => (
              <tr key={index} className={`${styles.tableRow} ${index % 2 === 1 ? styles.alternateRow : ''}`}>
                <td className={styles.holdingCell}>
                  <div className={styles.holdingInfo}>
                    <Image 
                      src={TOKEN_LOGOS[holding.name] || '/default-token.png'}
                      alt={`${holding.name} logo`}
                      width={32}
                      height={32}
                      className={styles.tokenLogo}
                    />
                    <div className={styles.holdingDetails}>
                      <div className={styles.tokenName}>{holding.name}</div>
                      <div className={styles.tokenAmount}>
                        {holding.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={styles.allocationCell}>
                  {holding.allocation.toFixed(1)}%
                </td>
                <td className={styles.valueCell}>
                  ${holding.value.toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileHoldings;
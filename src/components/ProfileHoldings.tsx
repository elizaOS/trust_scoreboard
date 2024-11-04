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

const TOKEN_LOGOS: { [key: string]: string } = {
  'ai16z': '/ai16z.png',
  'degenai': '/degenai.png'
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
        const response = await fetch(`/api/dashboard?wallet=${publicKey.toString()}`);
        const data = await response.json();
        
        if (data.error) {
          console.error('API Error:', data.error);
          setError(data.error);
        } else {
          console.log('Received holdings:', data.userHoldings);
          setHoldings(data.userHoldings || []);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch holdings');
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
          {holdings.map((holding, index) => (
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
                {holding.allocation}%
              </td>
              <td className={styles.valueCell}>
                ${(holding.value / 1000000).toFixed(2)}m
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileHoldings;
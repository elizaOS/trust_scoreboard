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
        console.log('Fetching holdings for wallet:', publicKey.toString());
        const response = await fetch(`/api/userHoldings?wallet=${publicKey.toString()}`);
        const data = await response.json();
        console.log('Raw API response:', data);

        if (data.error) {
          throw new Error(data.error);
        }

        if (!data.holdings) {
          console.error('No holdings data in response:', data);
          throw new Error('Invalid response format');
        }

        // The data.holdings array is already in the format we need
        const validHoldings = data.holdings
          .filter(holding => holding.amount > 0)
          .sort((a, b) => b.value - a.value);

        console.log('Processed holdings:', validHoldings);
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

  return (
    <div className={styles.container}>
      <table className={styles.holdingsTable}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>TOKEN</th>
            <th className={styles.tableHeader}>AMOUNT</th>
            <th className={styles.tableHeader}>PRICE</th>
            <th className={styles.tableHeader}>ALLOCATION</th>
            <th className={styles.tableHeader}>VALUE</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <tr key={index} className={`${styles.tableRow} ${index % 2 === 1 ? styles.alternateRow : ''}`}>
                {Array(5).fill(0).map((_, cellIndex) => (
                  <td key={cellIndex} className={styles.holdingCell}>
                    <div className="animate-pulse bg-gray-300 h-6 w-20 rounded"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : !publicKey ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Connect wallet to view holdings
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={5} className="text-center py-4 text-red-500">
                Error: {error}
              </td>
            </tr>
          ) : !holdings || holdings.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No holdings found
              </td>
            </tr>
          ) : (
            holdings.map((holding, index) => (
              <tr key={index} className={`${styles.tableRow} ${index % 2 === 1 ? styles.alternateRow : ''}`}>
                <td className={styles.holdingCell}>
                  <div className={styles.holdingInfo}>
                    <div className={styles.holdingDetails}>
                      <div className={styles.tokenName}>{holding.name}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.amountCell}>
                  {holding.amount.toLocaleString(undefined, {
                    maximumFractionDigits: 9
                  })}
                </td>
                <td className={styles.priceCell}>
                  ${holding.price > 0 ? holding.price.toFixed(4) : '0.0000'}
                </td>
                <td className={styles.allocationCell}>
                  {holding.allocation > 0 ? holding.allocation.toFixed(1) : '0.0'}%
                </td>
                <td className={styles.valueCell}>
                  ${holding.value > 0 ? holding.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) : '0.00'}
                </td>
              </tr>
            ))
          )}
          {holdings && holdings.length > 0 && (
            <tr className={styles.totalRow}>
              <td colSpan={4} className={styles.totalLabel}>Total Value</td>
              <td className={styles.totalValue}>
                ${holdings.reduce((sum, h) => sum + h.value, 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileHoldings;
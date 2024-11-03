import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getUserHoldings } from '../pages/api/userHoldings';
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
  'HELP': '/ai16z.png',
  'PUMP': '/degenai.png'
};

// Add debug logging function
const getTokenLogo = (tokenName: string): string => {
  const normalizedName = tokenName.toUpperCase();
  const logoPath = TOKEN_LOGOS[normalizedName];
  console.log('Token name:', tokenName);
  console.log('Normalized name:', normalizedName);
  console.log('Logo path:', logoPath);
  return logoPath || '/ai16z.png'; // Fallback image
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
        const response = await getUserHoldings(publicKey.toString());
        if (response.error) {
          setError(response.error);
        } else {
          setHoldings(response.holdings);
        }
      } catch (err) {
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
    <div>
      <table className={styles.holdingsTable}>
        <thead>
          <tr>
            <th className={styles.tableHeader}></th> {/* Empty header for icons */}
            <th className={styles.tableHeader}>HOLDING</th>
            <th className={styles.tableHeader}>ALLOCATION</th>
            <th className={styles.tableHeader}>VALUE</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, index) => (
            <tr key={index} className={styles.tableRow}>
              <td className={`${styles.tableCell} ${styles.iconCell}`}>
                <Image 
                  src={getTokenLogo(holding.name)}
                  alt={`${holding.name} logo`}
                  width={24}
                  height={24}
                  className={styles.tokenLogo}
                  priority // Add priority to ensure early loading
                />
              </td>
              <td className={styles.tableCell}>
                <div className={styles.amount}>
                  {holding.name}
                  <div className="text-sm text-gray-600">
                    {holding.amount.toLocaleString()} tokens
                  </div>
                </div>
              </td>
              <td className={`${styles.tableCell} ${styles.allocation}`}>
                {holding.allocation.toFixed(2)}%
              </td>
              <td className={`${styles.tableCell} ${styles.value}`}>
                <div>${holding.price.toFixed(4)}</div>
                <div className="text-sm text-gray-600">
                  ${holding.value.toFixed(2)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {holdings.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          No tokens found in wallet
        </div>
      )}
    </div>
  );
};

export default ProfileHoldings;
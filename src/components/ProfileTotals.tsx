import type { NextPage } from 'next';
import { FC, useCallback, useEffect, useState } from 'react';
import styles from './ProfileTotals.module.css';

interface TokenPrice {
  address: string;
  usdPrice: number;
}

interface Partner {
  owner: string;
  amount: number;
}

type View = 'profile' | 'holdings';

interface ProfileTotalsProps {
  onViewChange?: (view: View) => void; // Make optional
}

const ProfileTotals: NextPage<ProfileTotalsProps> = ({ onViewChange = () => {} }) => { // Add default empty function
  const [tokenPrices, setTokenPrices] = useState<TokenPrice[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [activeView, setActiveView] = useState<View>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleViewChange = useCallback((view: View) => {
    setActiveView(view);
    if (onViewChange) { // Add safety check
      onViewChange(view);
    }
  }, [onViewChange]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [pricesRes, partnersRes] = await Promise.all([
          fetch('/api/token-prices'),
          fetch('/api/partners')
        ]);

        if (!pricesRes.ok || !partnersRes.ok) {
          throw new Error('API error');
        }

        const pricesData = await pricesRes.json();
        const partnersData = await partnersRes.json();

        setTokenPrices(pricesData);
        setPartners(partnersData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        setTokenPrices([]);
        setPartners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTotalValue = () => {
    if (!tokenPrices.length || !partners.length) return 0;
    const price = tokenPrices[0].usdPrice;
    const totalHoldings = partners.reduce((sum, partner) => sum + partner.amount, 0);
    return price * totalHoldings;
  };

  return (
    <div className={styles.frameParent}>
      <div className={styles.instanceParent}>
        <div className={styles.buttonParent}>
          <div 
            className={`${styles.button} ${activeView === 'profile' ? styles.active : ''}`}
            onClick={() => handleViewChange('profile')}
          >
            <div className={styles.text}>Profile</div>
          </div>
          <div 
            className={`${styles.button1} ${activeView === 'holdings' ? styles.active : ''}`}
            onClick={() => handleViewChange('holdings')}
          >
            <div className={styles.text}>Holdings</div>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className={styles.totalsContainer}>
          <div className={styles.totalValue}>
            Total Value: ${calculateTotalValue().toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTotals;

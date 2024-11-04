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
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buttonStyles = {
    container: "flex space-x-2 mb-4",
    button: (isActive: boolean) => `
      px-4 py-2 rounded-lg transition-colors
      ${isActive 
        ? 'bg-[#B5AD95] text-white' 
        : 'bg-[#E8E3D6] text-[#B5AD95]'}
    `
  };

  const handleViewChange = useCallback((view: View) => {
    if (onViewChange) { // Add safety check
      onViewChange(view);
    }
  }, [onViewChange]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('API error');
        }

        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTotalValue = () => {
    if (!data?.prices?.length || !data?.partners?.length) return 0;
    const price = data.prices[0].usdPrice;
    const totalHoldings = data.partners.reduce((sum, partner) => sum + partner.amount, 0);
    return price * totalHoldings;
  };

  return (
    <div>
      <div className={buttonStyles.container}>
        <button
          className={buttonStyles.button(true)}
          onClick={() => handleViewChange('profile')}
        >
          Profile
        </button>
        <button
          className={buttonStyles.button(false)}
          onClick={() => handleViewChange('holdings')}
        >
          Holdings
        </button>
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

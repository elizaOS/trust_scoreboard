import { FC, useEffect, useState } from 'react';
import styles from './LeaderboardTotals.module.css';

interface TokenPrice {
  address: string;
  usdPrice: number;
}

interface Partner {
  owner: string;
  amount: number;
}

export const LeaderboardTotals: FC = () => {
  const [tokenPrices, setTokenPrices] = useState<TokenPrice[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if API routes exist first
        const [pricesRes, partnersRes] = await Promise.all([
          fetch('/api/tokenPrice'),
          fetch('/api/partners')
        ]);

        // Validate responses
        if (!pricesRes.ok) {
          throw new Error(`Token prices API error: ${pricesRes.status}`);
        }
        if (!partnersRes.ok) {
          throw new Error(`Partners API error: ${partnersRes.status}`);
        }

        // Parse JSON safely
        const pricesText = await pricesRes.text();
        const partnersText = await partnersRes.text();

        let pricesData, partnersData;
        try {
          pricesData = JSON.parse(pricesText);
          partnersData = JSON.parse(partnersText);
        } catch (e) {
          throw new Error('Invalid JSON response from API');
        }

        setTokenPrices(pricesData.prices || []);
        setPartners(partnersData.partners || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        // Set default empty values
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

  if (isLoading) {
    return (
      <div className="w-full rounded-lg p-6 bg-gradient-to-r from-[#F98C1C] to-[#FFAF03]">
        <div className="text-center text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-lg p-6 bg-gradient-to-r from-[#F98C1C] to-[#FFAF03]">
        <div className="text-center text-white">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      <div className="w-full rounded-lg p-6 bg-gradient-to-r from-[#F98C1C] to-[#FFAF03]">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-sm text-white">Total Value</p>
            <p className="text-2xl font-bold text-white">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
                maximumFractionDigits: 2
              }).format(calculateTotalValue())}
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-white">Total Partners</p>
            <p className="text-2xl font-bold text-white">
              {partners.length}
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-white">Total Holdings</p>
            <p className="text-2xl font-bold text-white">
              {new Intl.NumberFormat('en-US', {
                notation: 'compact',
                maximumFractionDigits: 2
              }).format(partners.reduce((sum, partner) => sum + partner.amount, 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTotals;

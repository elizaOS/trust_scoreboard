import { FC, useEffect, useState } from 'react';
import styles from './LeaderboardPartners.module.css';
import Image from 'next/image';
import { calculateTrustScore, TrustScoreResult } from '../pages/api/trustScore';
import type { LeaderboardResponse } from '../pages/api/leaderboard';

interface Partner {
  owner: string;
  displayAddress: string;
  amount: number;
  trustScore?: TrustScoreResult;
}

interface TokenPrice {
  address: string;
  usdPrice: number;
}

export const LeaderboardPartners: FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [tokenPrices, setTokenPrices] = useState<TokenPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data: LeaderboardResponse = await response.json();
        
        const partnersWithTrust = data.partners.map((partner) => ({
          ...partner,
          trustScore: calculateTrustScore(partner.amount)
        }));

        setPartners(partnersWithTrust);
        setTokenPrices(data.prices);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading partners...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.frameParent}>
      <div className={styles.headingParent}>
	  <div className={styles.heading}>Rank</div>
        <div className={styles.heading}>Partner</div>
        <div className={styles.heading1}>Trust Score</div>
        <div className={styles.heading2}>Holdings</div>
      </div>

      {partners.map((partner, index) => (
        <div key={partner.owner} className={index % 2 === 0 ? styles.row : styles.row1}>
          {/* Rank column */}
          <div className={styles.text}>{index + 1}</div>
          
          {/* Partner column */}
          <div className={styles.textParent}>
            <div className={styles.text1}>
              {partner.displayAddress || `${partner.owner.slice(0, 4)}...${partner.owner.slice(-4)}`}
            </div>
            <div className={styles.text2}>{partner.trustScore?.label || 'Unverified'}</div>
          </div>
          
          {/* Trust Score column */}
          <div className={styles.textWrapper}>
            {partner.trustScore?.score === 0 ? (
              <Image 
                src={partner.trustScore?.imagePath || '/null.png'} 
                alt="Trust Score" 
                width={34} 
                height={34} 
                className={styles.rowChild}
              />
            ) : (
              <div className={styles.text3}>
                {partner.trustScore?.score ? partner.trustScore.score.toFixed(1) : '0.0'}
              </div>
            )}
          </div>
          
          {/* Holdings column */}
          <div className={styles.textWrapper}>
            <div className={styles.text3}>
              {new Intl.NumberFormat('en-US', {
                notation: 'compact',
                maximumFractionDigits: 2
              }).format(partner.amount)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardPartners;

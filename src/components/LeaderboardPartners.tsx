import type { FC } from 'react';
import { useState, useEffect } from 'react'; 
import Image from "next/image";
import styles from './LeaderboardPartners.module.css';

interface Partner {
  rank: number;
  address: string;
  trustScore: number;
  holdings: number;
  displayAddress: string;
}

const LeaderboardPartners: FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        if (!data.partners?.length || !data.trustScores) {
          throw new Error('Invalid or empty data received');
        }

        const sortedPartners = data.partners
          .filter(partner => partner && partner.amount >= 100000)
          .sort((a, b) => b.amount - a.amount)
          .map((partner, index) => ({
            rank: index + 1,
            address: partner.owner,
            displayAddress: `${partner.owner.slice(0, 6)}...${partner.owner.slice(-4)}`,
            trustScore: data.trustScores?.[partner.owner] || 0,
            holdings: partner.amount
          }));

        setPartners(sortedPartners);
        setError(null);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
        
        // Retry logic
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 1000 * (retryCount + 1));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [retryCount]);

  if (isLoading) return <div>Loading partners...</div>;
  if (error) return <div>Error loading partners. Retrying... ({retryCount}/{MAX_RETRIES})</div>;
  if (!partners?.length) return <div>No partners found</div>;

  return (
    <div className={styles.frameParent}>
      <div className={styles.headingParent}>
        <div className={styles.heading}>Rank</div>
        <div className={styles.heading}>Partner</div>
        <div className={styles.heading2}>TRUST SCORE</div>
        <div className={styles.heading3}>HOLDINGS</div>
      </div>
      
      {partners.map((partner) => (
        <div key={partner.address} className={partner.rank % 2 === 0 ? styles.row : styles.row1}>
          <div className={styles.text}>{partner.rank}</div>
          <div className={styles.textParent}>
            <div className={styles.rowChild}>
              <Image 
                width={34} 
                height={34} 
                alt="Partner avatar" 
                src={`https://avatars.dicebear.com/api/identicon/${partner.address}.svg`}
                className={styles.avatarImage} 
              />
              <div className={styles.text1}>{partner.displayAddress}</div>
            </div>
            <div className={styles.text2}>Partner</div>
          </div>
          <div className={styles.textWrapper}>
            {partner.trustScore === 0 ? (
              <div className={styles.imageWrapper}>
                <Image 
                  src="/null.png"
                  alt="Null trust score"
                  width={34}
                  height={34}
                  className={styles.trustScoreImage}
                />
              </div>
            ) : (
              <div className={styles.text3}>{partner.trustScore.toFixed(1)}</div>
            )}
          </div>
          <div className={styles.text3}>
            {partner.holdings.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardPartners;

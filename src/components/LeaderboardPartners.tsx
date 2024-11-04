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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        
        if (!Array.isArray(data.partners)) {
          throw new Error('Invalid partners data format');
        }

        // Filter and sort partners by amount
        const sortedPartners = data.partners
          .filter(partner => partner.amount >= 100000)
          .sort((a, b) => b.amount - a.amount)
          .map((partner, index) => ({
            rank: index + 1,
            address: partner.owner,
            displayAddress: `${partner.owner.slice(0, 6)}...${partner.owner.slice(-4)}`,
            trustScore: data.trustScores[partner.owner] || 0,
            holdings: partner.amount
          }));

        setPartners(sortedPartners);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
          <div className={styles.rowChild}>
            <Image 
              width={34} 
              height={34} 
              alt="Partner avatar" 
              src={`https://avatars.dicebear.com/api/identicon/${partner.address}.svg`} 
            />
          </div>
          <div className={styles.textParent}>
            <div className={styles.text1}>{partner.displayAddress}</div>
            <div className={styles.text2}>Partner</div>
          </div>
          <div className={styles.instanceParent}>
            <div className={styles.textWrapper}>
              <div className={styles.text3}>{partner.trustScore.toFixed(1)}</div>
            </div>
            <div className={styles.textWrapper}>
              <div className={styles.text3}>{partner.holdings.toLocaleString()}</div>
            </div>
          </div>
        </div>
      ))}
      {partners.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          No partners found with minimum required holdings
        </div>
      )}
    </div>
  );
};

export default LeaderboardPartners;

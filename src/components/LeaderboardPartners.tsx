import type { FC } from 'react';
import { useState, useEffect } from 'react'; 
import Image from "next/image";
import styles from './LeaderboardPartners.module.css';

interface Partner {
  address: string;
  trustScore: number;
  holdings: number;
}

interface PartnerData {
  address: string;
  holdings: number;
}

interface ApiResponse {
  partners: PartnerData[];
}

const LeaderboardPartners: FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setIsLoading(true);
        const [partnersResponse, trustScoresResponse] = await Promise.all([
          fetch('/api/partners'),
          fetch('/api/trustScore')
        ]);
        
        if (!partnersResponse.ok || !trustScoresResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const { partners: partnersData }: ApiResponse = await partnersResponse.json();
        const trustScores = await trustScoresResponse.json();

        // Validate that partnersData is an array
        if (!Array.isArray(partnersData)) {
          throw new Error('Invalid partners data format');
        }

        const combinedData = partnersData.map((partner: PartnerData) => ({
          address: partner.address,
          trustScore: trustScores[partner.address] || 0,
          holdings: partner.holdings
        }));

        setPartners(combinedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.frameParent}>
      <div className={styles.headingParent}>
        <div className={styles.heading}>RANK</div>
        <div className={styles.heading1}>PARTNER</div>
        <div className={styles.heading2}>TRUST SCORE</div>
        <div className={styles.heading3}>HOLDINGS</div>
      </div>
      
      {partners.map((partner, index) => (
        <div key={partner.address} className={index % 2 === 0 ? styles.row : styles.row1}>
          <div className={styles.text}>{index + 1}</div>
          <div className={styles.rowChild}>
            <Image width={34} height={34} alt="Partner avatar" src={`https://avatars.dicebear.com/api/identicon/${partner.address}.svg`} />
          </div>
          <div className={styles.textParent}>
            <div className={styles.text1}>{partner.address.substring(0, 6)}...{partner.address.substring(38)}</div>
            <div className={styles.text2}>Partner</div>
          </div>
          <div className={styles.instanceParent}>
            <div className={styles.textWrapper}>
              <div className={styles.text3}>{partner.trustScore.toFixed(1)}</div>
            </div>
            <div className={styles.textWrapper}>
              <div className={styles.text3}>{partner.holdings.toFixed(2)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardPartners;

import { FC, useEffect, useState } from 'react';
import styles from './LeaderboardPartners.module.css';
import Image from 'next/image';
import LeaderboardResponse from '../pages/api/leaderboard';

interface TrustScoreResult {
  score: number;
  imagePath: string;
}

interface Partner {
  owner: string;
  displayAddress: string;
  amount: number;
  trustScore: TrustScoreResult;
}

interface TokenPrice {
  address: string;
  usdPrice: number;
}

const LeaderboardPartners: FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const partnersData = await fetch('/api/partners').then(res => res.json());
        const trustScores = await Promise.all(
          partnersData.map((partner: any) =>
            fetch(`/api/trustScore?address=${partner.owner}`).then(res => res.json())
          )
        );

        const partnersWithTrust = partnersData.map((partner: any, index: number) => ({
          ...partner,
          trustScore: trustScores[index],
        }));

        setPartners(partnersWithTrust);
        setError(null);
      } catch (err) {
        setError('Failed to fetch partners');
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className={styles.container}>
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        partners.map((partner) => (
          <div key={partner.owner} className={styles.partner}>
            <div>{partner.displayAddress}</div>
            <div>{partner.amount}</div>
            <div>{partner.trustScore.score}</div>
            <Image src={partner.trustScore.imagePath} alt="Trust Score" width={50} height={50} />
          </div>
        ))
      )}
    </div>
  );
};

export default LeaderboardPartners;

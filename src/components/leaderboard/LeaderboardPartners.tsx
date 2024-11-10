import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import Image from "next/image";
import styles from './LeaderboardPartners.module.css';
import { useMediaQuery } from 'react-responsive';

interface Partner {
  rank: number;
  address: string;
  trustScore: number;
  holdings: number;
  displayAddress: string;
}

const LeaderboardPartners: FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const formatAddress = useCallback((address: string) => {
    if (isMobile) {
      return `${address.slice(0, 3)}...${address.slice(-2)}`;
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [isMobile]);

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
            displayAddress: formatAddress(partner.owner),
            trustScore: data.trustScores?.[partner.owner] || 0,
            holdings: partner.amount
          }));

        setPartners(sortedPartners);
        setError(null);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);

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
  }, [retryCount, isMobile, formatAddress]);

  const formatHoldings = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  const Loader = () => (
    <div className="flex justify-center items-center w-full py-8">
      <div className="w-8 h-8 border-4 border-[#F98C13] border-t-transparent rounded-full animate-spin" />
    </div>
  );


  return (
    <div className={styles.frameParent}>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className={styles.errorMessage}>
          Error loading partners. Retrying... ({retryCount}/{MAX_RETRIES})
        </div>
      ) : !partners?.length ? (
        <div className={styles.emptyMessage}>No partners found</div>
      ) : (
        <>
          <div className={styles.headingParent}>
            <div className={styles.heading}>PARTNER</div>
            <div className={styles.heading}></div>
            <div className={styles.heading2}>TRUST SCORE</div>
            <div className={styles.heading3}>HOLDINGS</div>
          </div>
          {
            partners.map((partner) => (
              <div key={partner.address} className={partner.rank % 2 === 0 ? styles.row : styles.row1}>
                <div className={styles.rowChild}>
                  <div className={styles.text}>{partner.rank}</div>
                  <Image
                    width={34}
                    height={34}
                    alt="Partner avatar"
                    src="/profile_default.png"
                    className={styles.avatarImage}
                  />
                  <div className={styles.textParent}>
                    <div className={styles.text1}>{partner.displayAddress}</div>
                    <div className={styles.text2}>Partner</div>
                  </div>
                </div>
                <div className={styles.textWrapper}>
                  {partner.trustScore === 0 ? (
                    <div className={styles.tooltipContainer}>
                      <Image
                        src="/null.svg"
                        alt="Null trust score"
                        width={20}
                        height={20}
                        className={styles.trustScoreImage}
                      />
                      <span className={styles.tooltip}>
                        AI Marc is Calculating Trust
                      </span>
                    </div>
                  ) : (
                    <div className={styles.text3}>{partner.trustScore.toFixed(1)}</div>
                  )}
                </div>
                <div className={styles.text3}>
                  {formatHoldings(partner.holdings)}
                </div>
              </div>
            ))
          }
        </>

      )}
    </div>
  );
};

export default LeaderboardPartners;
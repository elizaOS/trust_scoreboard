import { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './LeaderboardHoldings.module.css';

interface DAOHolding {
  rank: number;
  name: string;
  holdings: string;
  percentage: string;
  imageUrl: string;
}

const LeaderboardHoldings: FC = () => {
  const [holdings, setHoldings] = useState<DAOHolding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/daoHoldings');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.holdings || !Array.isArray(data.holdings)) {
          throw new Error('Invalid data format received from API');
        }

        setHoldings(data.holdings);
      } catch (err) {
        console.error('Error fetching DAO holdings:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoldings();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Asset</th>
            <th>Holdings</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((dao) => (
            <tr key={dao.rank} className={styles.row}>
              <td>{dao.rank}</td>
              <td>
                <div className={styles.daoInfo}>
                  <Image 
                    src={dao.imageUrl} 
                    alt={dao.name} 
                    width={34} 
                    height={34} 
                    className={styles.daoImage}
                  />
                  <span>{dao.name}</span>
                </div>
              </td>
              <td>{dao.holdings}</td>
              <td>{dao.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardHoldings;

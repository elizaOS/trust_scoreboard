import { useEffect, useState } from 'react';
import styles from './LeaderboardHoldings.module.css';

interface DAOHolding {
  rank: number;
  name: string;
  members: number;
  holdings: string;
  percentage: string;
  imageUrl: string;
}

export default function LeaderboardHoldings() {
  const [holdings, setHoldings] = useState<DAOHolding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const response = await fetch('/api/daoHoldings');
        const data = await response.json();
        
        // Validate that data is an array
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from API');
        }
        
        setHoldings(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching DAO holdings:', error);
        setError('Failed to load DAO holdings');
        setHoldings([]); // Reset to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoldings();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <table className={styles.holdingsTable}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>DAO</th>
            <th>Members</th>
            <th>Holdings</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(holdings) && holdings.map((dao) => (
            <tr key={dao.rank} className={styles.row}>
              <td>{dao.rank}</td>
              <td>
                <div className={styles.daoInfo}>
                  <img 
                    src={dao.imageUrl} 
                    alt={dao.name} 
                    width={34} 
                    height={34} 
                    className={styles.daoImage}
                  />
                  <span>{dao.name}</span>
                </div>
              </td>
              <td>{dao.members.toLocaleString()}</td>
              <td>{dao.holdings}</td>
              <td>{dao.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

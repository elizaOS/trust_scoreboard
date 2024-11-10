import { useState, useEffect } from 'react';

interface Partner {
  wallet: string;
  trustScore: number;
  image?: string;
}

interface DashboardData {
  partners: Partner[];
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/dashboard');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // For development, let's add some mock data
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setData({
        partners: [
          {
            wallet: '8xzt6Cytp7JkrX44FkuRw2pXCzZg4BaCwdEzz6F4ZxJE',
            trustScore: 93.2,
            image: '/path-to-image-1.jpg'
          },
          {
            wallet: '6yztNCytp9JkrX44FkuRw2pXCzZg4BaCwdEzz6F4ZxJE',
            trustScore: 91.32,
            image: '/path-to-image-2.jpg'
          },
          {
            wallet: '4xzt6Cytp7JkrX44FkuRw2pXCzZg4BaCwdEzz6F4ZxJE',
            trustScore: 89.54,
            image: '/path-to-image-3.jpg'
          }
        ]
      });
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error };
}; 
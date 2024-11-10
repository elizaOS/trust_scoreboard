import { FC } from 'react';
import { useRouter } from 'next/router';
import styles from './ApiSection.module.css';

export const ApiSection: FC = () => {
  const router = useRouter();

  const handleNavigateToSaas = () => {
    router.push('/saas');
  };

  return (
    <div>
      <h2 className={styles.title}>API Access</h2>
      <div className={styles.buttonParent}>
        <div 
          className={styles.button}
          onClick={handleNavigateToSaas}
        >
          <div className={styles.text}>
            Get API Access
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiSection;

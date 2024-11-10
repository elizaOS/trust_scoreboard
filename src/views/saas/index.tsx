import { FC } from 'react';
import Pricing from '../../components/saas/Pricing';
import styles from './index.module.css';

const SaasView: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Trust Score API</h1>
        <p className={styles.heroSubtitle}>
          Integrate trust scores directly into your application
        </p>
      </div>
      <Pricing />
      <div className={styles.features}>
        <h2 className={styles.featuresTitle}>Why Choose Our API?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <h3>Real-time Updates</h3>
            <p>Get the latest trust scores as they change</p>
          </div>
          <div className={styles.feature}>
            <h3>Easy Integration</h3>
            <p>Simple REST API with comprehensive documentation</p>
          </div>
          <div className={styles.feature}>
            <h3>Reliable Service</h3>
            <p>99.9% uptime guarantee with enterprise SLA</p>
          </div>
          <div className={styles.feature}>
            <h3>Secure Access</h3>
            <p>Enterprise-grade security and encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaasView;
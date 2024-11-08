import { FC } from 'react';
import styles from './BuyCredits.module.css';
import GetStarted from './GetStarted';

interface CreditPackage {
  name: string;
  credits: number;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const creditPackages: CreditPackage[] = [
  {
    name: "Starter",
    credits: 1000,
    price: 9,
    description: "For testing and small projects",
    features: [
      "1,000 API Credits",
      "30 Days Validity",
      "Basic Support",
      "Real-time Access",
      "Basic Analytics"
    ]
  },
  {
    name: "Growth",
    credits: 5000,
    price: 39,
    description: "Ideal for growing applications",
    features: [
      "5,000 API Credits",
      "60 Days Validity",
      "Priority Support",
      "Real-time Access",
      "Advanced Analytics"
    ],
    highlighted: true
  },
  {
    name: "Scale",
    credits: 20000,
    price: 149,
    description: "For high-volume applications",
    features: [
      "20,000 API Credits",
      "90 Days Validity",
      "Premium Support",
      "Real-time Access",
      "Enterprise Analytics"
    ]
  }
];

const CreditCard: FC<CreditPackage> = ({ name, credits, price, description, features, highlighted }) => (
  <div className={`${styles.creditCard} ${highlighted ? styles.highlighted : ''}`}>
    {highlighted && <div className={styles.popularBadge}>MOST POPULAR</div>}
    <h3 className={styles.tierName}>{name}</h3>
    <div className={styles.credits}>{credits.toLocaleString()}</div>
    <div className={styles.price}>
      <span className={styles.currency}>$</span>
      {price}
    </div>
    <p className={styles.description}>{description}</p>
    <ul className={styles.features}>
      {features.map((feature, index) => (
        <li key={index} className={styles.feature}>
          <span className={styles.checkmark}>✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <GetStarted 
      tier={name}
      price={price}
      isHighlighted={highlighted}
    />
  </div>
);

const BuyCredits: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Make More Requests</h1>
        <p className={styles.subtitle}>Choose the request package that suits your needs</p>
      </div>
      <div className={styles.creditGrid}>
        {creditPackages.map((pkg, index) => (
          <CreditCard key={index} {...pkg} />
        ))}
      </div>
    </div>
  );
};

export default BuyCredits;
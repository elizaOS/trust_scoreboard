import { FC } from 'react';
import styles from './Pricing.module.css';
import GetStarted from './GetStarted';

interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
  requestLimit: string;
  highlighted?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Basic",
    price: 49,
    description: "Perfect for getting started with Trust Score API",
    requestLimit: "10,000 requests/month",
    features: [
      "Trust Score API Access",
      "Basic Documentation",
      "Email Support",
      "Real-time Updates",
      "Basic Analytics"
    ]
  },
  {
    name: "Pro",
    price: 149,
    description: "For growing projects that need more power",
    requestLimit: "50,000 requests/month",
    features: [
      "Everything in Basic",
      "Advanced Analytics",
      "Priority Support",
      "Historical Data Access",
      "Custom Webhooks"
    ],
    highlighted: true
  },
  {
    name: "Enterprise",
    price: 499,
    description: "For large-scale applications that need advanced features",
    requestLimit: "200,000 requests/month",
    features: [
      "Everything in Pro",
      "Dedicated Support",
      "Custom Integration",
      "SLA Guarantee",
      "White-label Options"
    ]
  }
];

const PricingCard: FC<PricingTier> = ({ name, price, description, features, requestLimit, highlighted }) => (
  <div className={`${styles.pricingCard} ${highlighted ? styles.highlighted : ''}`}>
    <h3 className={styles.tierName}>{name}</h3>
    <div className={styles.price}>
      <span className={styles.currency}>$</span>
      {price}
      <span className={styles.period}>/month</span>
    </div>
    <p className={styles.description}>{description}</p>
    <div className={styles.requestLimit}>{requestLimit}</div>
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

const Pricing: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Simple, Transparent Pricing</h1>
        <p className={styles.subtitle}>Choose the plan that's right for you</p>
      </div>
      <div className={styles.pricingGrid}>
        {pricingTiers.map((tier, index) => (
          <PricingCard key={index} {...tier} />
        ))}
      </div>
    </div>
  );
};

export default Pricing;
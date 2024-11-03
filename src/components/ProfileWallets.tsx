import type { FC } from 'react'; // Changed from NextPage since this is a component
import styles from './ProfileWallets.module.css';

interface WalletDisplayProps {
  address: string;
  truncateLength?: number;
}

const truncateAddress = (address: string, length: number = 4): string => {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

const ProfileWallets: FC<WalletDisplayProps> = ({ 
  address,
  truncateLength = 3
}) => {
  return (
    <div className={styles.walletContainer}>
      <span className={styles.walletAddress}>
        {truncateAddress(address, truncateLength)}
      </span>
    </div>
  );
};

export default ProfileWallets; // Added default export
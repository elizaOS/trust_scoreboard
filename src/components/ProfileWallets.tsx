import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from './ProfileWallets.module.css';

interface WalletDisplayProps {
  truncateLength?: number;
}

const truncateAddress = (address: string, length: number = 4): string => {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

const ProfileWallets: FC<WalletDisplayProps> = ({ truncateLength = 4 }) => {
  const { publicKey } = useWallet();

  return (
    <div className={styles.button}>
      <div className={styles.text}>
        {publicKey 
          ? truncateAddress(publicKey.toString(), truncateLength)
          : 'No wallet connected'}
      </div>
    </div>
  );
};

export default ProfileWallets;
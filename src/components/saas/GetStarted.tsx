import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  LAMPORTS_PER_SOL, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  Connection 
} from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';
import styles from './GetStarted.module.css';

interface GetStartedProps {
  tier: string;
  price: number;
  isHighlighted?: boolean;
}

interface TokenPrice {
  address: string;
  usdPrice: number;
}

// Safely get treasury wallet from env var
const TREASURY_WALLET = new PublicKey(
  process.env.NEXT_PUBLIC_TREASURY_WALLET_SOL!
);

const HELIUS_RPC = `https://rpc.helius.xyz/?api-key=${process.env.NEXT_PUBLIC_SOLANA_API}`;

const GetStarted: FC<GetStartedProps> = ({ tier, price, isHighlighted }) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);

  // Create a new connection with Helius RPC
  const heliusConnection = new Connection(HELIUS_RPC);

  const getSolPrice = async (): Promise<number> => {
    try {
      const response = await fetch('/api/tokenPrice');
      const data = await response.json();
      const prices: TokenPrice[] = data.prices;
      
      // Find SOL price from the returned prices
      const solPrice = prices.find(p => 
        p.address === 'So11111111111111111111111111111111111111112'
      )?.usdPrice || 100; // Fallback to $100 if price not found
      
      return solPrice;
    } catch (error) {
      console.error('Error fetching SOL price:', error);
      return 100; // Fallback price
    }
  };

  const handlePayment = async () => {
    if (!publicKey) return;

    setLoading(true);
    try {
      // Get current SOL price
      const solPrice = await getSolPrice();
      console.log('SOL Price in USD:', solPrice);
      
      // Convert USD price to SOL
      const solAmount = price / solPrice;
      console.log('Price in USD:', price);
      console.log('Amount in SOL:', solAmount);
      
      // Convert SOL to lamports
      const lamports = Math.round(solAmount * LAMPORTS_PER_SOL);
      console.log('Amount in lamports:', lamports);

      // Check if user has enough balance using Helius connection
      const balance = await heliusConnection.getBalance(publicKey);
      console.log('User balance in lamports:', balance);
      
      if (balance < lamports) {
        throw new Error(`Insufficient SOL balance. Need ${solAmount.toFixed(4)} SOL`);
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: TREASURY_WALLET,
          lamports,
        })
      );

      const { blockhash, lastValidBlockHeight } = await heliusConnection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, heliusConnection);

      // Wait for transaction confirmation
      const confirmation = await heliusConnection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature
      });

      if (confirmation.value.err) throw new Error('Transaction failed');

      // Emit success event
      const event = new CustomEvent('paymentSuccess', {
        detail: {
          tier,
          price,
          signature,
          wallet: publicKey.toString(),
          solAmount
        }
      });
      window.dispatchEvent(event);

      alert(`Payment successful! Paid ${solAmount.toFixed(4)} SOL (${price} USD)`);

    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <button 
        className={`${styles.button} ${isHighlighted ? styles.highlighted : ''}`}
        disabled={true}
      >
        Connect Wallet to Continue
      </button>
    );
  }

  return (
    <button
      className={`${styles.button} ${isHighlighted ? styles.highlighted : ''}`}
      onClick={handlePayment}
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Pay with SOL'}
    </button>
  );
};

export default GetStarted;
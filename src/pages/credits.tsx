import type { NextPage } from "next";
import Head from "next/head";
import CreditsView from "../views/credits";
import { PublicKey } from '@solana/web3.js';

const Credits: NextPage = (props) => {
  // Add validation before creating PublicKey
  const createSafePublicKey = (address: string | undefined): PublicKey | null => {
    if (!address) return null;
    try {
      return new PublicKey(address);
    } catch (e) {
      console.error('Invalid public key:', e);
      return null;
    }
  };

  // Use the safe function when creating PublicKeys
  const publicKey = createSafePublicKey(address);
  if (!publicKey) {
    return null; // or some error UI
  }

  return (
    <div>
      <Head>
        <title>Buy API Credits - Trust Score</title>
        <meta
          name="description"
          content="Purchase API credits for Trust Score access"
        />
      </Head>
      <CreditsView />
    </div>
  );
};

export default Credits;
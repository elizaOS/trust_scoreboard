// pages/api/partners.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL = `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_SOLANA_API}`;
const MINT_ADDRESS = "HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC";
const DECIMALS = 9;
const MIN_AMOUNT = 100000;

interface Partner {
  owner: string;
  displayAddress: string;
  amount: number;
  trustScore?: number;  // Make optional since it's calculated later
}

// Add helper function for address truncation
const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const calculateTrustScore = (amount: number, minAmount: number = 100000): number => {
  const rawScore = amount === 0 ? 0 : Math.min(100, (amount / minAmount) * 10);
  return Number(rawScore.toFixed(1));
};

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getAllPartners(): Promise<Partner[]> {
  const partners: Partner[] = [];
  let cursor;
  
  try {
    do {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "helius-test",
          method: "getTokenAccounts",
          params: { 
            limit: 1000, 
            mint: MINT_ADDRESS, 
            ...(cursor && { cursor }) 
          }
        }),
      });

      const { result } = await response.json();
      
      if (!result?.token_accounts?.length) break;
      
      const newPartners = result.token_accounts.map((acc: any) => {
        const formattedAmount = Number(acc.amount) / Math.pow(10, DECIMALS);
        if (formattedAmount >= MIN_AMOUNT) {
          return {
            owner: acc.owner,
            displayAddress: truncateAddress(acc.owner),
            amount: formattedAmount,
            trustScore: calculateTrustScore(formattedAmount)
          };
        }
      }).filter(Boolean);
      
      partners.push(...newPartners);
      cursor = result.cursor;
      console.log(`Processed ${partners.length} qualifying partners`);
      
      await sleep(50);
    } while (cursor);

    // Sort partners by amount in descending order
    return partners.sort((a, b) => b.amount - a.amount);
  } catch (error) {
    console.error("Error fetching partner accounts:", error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const partners = await getAllPartners();
    // Partners are already sorted by amount
    res.status(200).json({ partners });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch partner accounts',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export { getAllPartners, type Partner };
// pages/api/leaderboard.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllPartners, type Partner } from './partners';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.NEXT_PUBLIC_CG_API;
const SOLANA_PLATFORM_ID = 'solana';
const TOKEN_ADDRESSES = [
  'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC',
  'Gu3LDkn7Vx3bmCzLafYNKcDxv2mH7YN44NJZFXnypump'
];

interface TokenPrice {
  address: string;
  usd: number;
}

interface TokenPrices {
  [key: string]: {
    usd: number;
  };
}

interface ErrorResponse {
  message: string;
  statusCode: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ErrorResponse | { partners: Partner[]; prices: any[] }>) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed', statusCode: 405 });
    }

    // Get partners first with error handling
    const partners = await getAllPartners();
    if (!partners) {
      return res.status(500).json({ message: 'Failed to fetch partners', statusCode: 500 });
    }

    // Fetch token prices from CoinGecko
    const pricesRes = await fetch(`${COINGECKO_API}/simple/token_price/${SOLANA_PLATFORM_ID}?contract_addresses=${TOKEN_ADDRESSES.join(',')}&vs_currencies=usd&x_cg_pro_api_key=${API_KEY}`);
    const pricesData = await pricesRes.json();

    if (!pricesRes.ok) {
      return res.status(500).json({ message: 'Failed to fetch token prices', statusCode: 500 });
    }

    const prices: TokenPrice[] = TOKEN_ADDRESSES.map((address) => ({
      address,
      usd: pricesData[address]?.usd || 0,
    }));

    return res.status(200).json({ partners, prices });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', statusCode: 500 });
  }
}

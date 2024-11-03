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
  error: string;
  message: string;
  statusCode: number;
}

export interface LeaderboardResponse {
  partners: Partner[];
  tokenPrices: TokenPrice[];
}

type ApiResponse = LeaderboardResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{partners: Partner[], prices: any[]} | ErrorResponse>
) {
  // Add timeout
  const timeout = setTimeout(() => {
    res.status(504).json({ error: 'Request timeout' });
  }, 30000);

  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get partners first with error handling
    const partners = await getAllPartners().catch(error => {
      console.error('Partner fetch error:', error);
      throw new Error('Failed to fetch partners');
    });

    // Validate API key
    if (!API_KEY) {
      throw new Error('CoinGecko API key not configured');
    }

    // Fetch prices with error handling
    const pricesResponse = await fetch(
      `${COINGECKO_API}/simple/token_price/${SOLANA_PLATFORM_ID}?contract_addresses=${TOKEN_ADDRESSES.join(',')}&vs_currencies=usd`,
      {
        headers: {
          'x-cg-pro-api-key': API_KEY,
          'Accept': 'application/json'
        }
      }
    ).catch(error => {
      console.error('Price fetch error:', error);
      throw new Error('Failed to fetch token prices');
    });

    if (!pricesResponse.ok) {
      const errorText = await pricesResponse.text();
      console.error('CoinGecko API error:', errorText);
      throw new Error(`CoinGecko API error: ${pricesResponse.status}`);
    }

    const pricesData: TokenPrices = await pricesResponse.json();
    const prices = Object.entries(pricesData).map(([address, priceData]) => ({
      address,
      usdPrice: priceData.usd
    }));

    clearTimeout(timeout);
    return res.status(200).json({ partners, prices });

  } catch (error) {
    clearTimeout(timeout);
    console.error('Leaderboard API Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch leaderboard data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

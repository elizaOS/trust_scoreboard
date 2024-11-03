// pages/api/tokenPrices.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.NEXT_PUBLIC_CG_API;
const SOLANA_PLATFORM_ID = 'solana';
const TOKEN_ADDRESSES = [
  'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC',
  'Gu3LDkn7Vx3bmCzLafYNKcDxv2mH7YN44NJZFXnypump'
];

interface TokenPrices {
  [key: string]: {
    usd: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (!API_KEY) {
      throw new Error('CoinGecko API key is not configured');
    }

    const response = await fetch(
      `${COINGECKO_API}/simple/token_price/${SOLANA_PLATFORM_ID}?contract_addresses=${TOKEN_ADDRESSES.join(',')}&vs_currencies=usd`,
      {
        headers: {
          'x-cg-pro-api-key': API_KEY,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error('CoinGecko API error:', await response.text());
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: TokenPrices = await response.json();
    
    // Transform data to expected format
    const prices = Object.entries(data).map(([address, priceData]) => ({
      address,
      usdPrice: priceData.usd
    }));

    res.status(200).json({ prices });
  } catch (error) {
    console.error('Token price API error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch token prices',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
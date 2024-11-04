// pages/api/tokenPrices.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.NEXT_PUBLIC_CG_API;
const SOLANA_PLATFORM_ID = 'solana';
const TOKEN_ADDRESSES = [
  'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC',
  'Gu3LDkn7Vx3bmCzLafYNKcDxv2mH7YN44NJZFXnyai16z'
];

interface TokenPrice {
  address: string;
  usdPrice: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!API_KEY) {
      throw new Error('CoinGecko API key not configured');
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
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data to expected format
    const prices: TokenPrice[] = Object.entries(data).map(([address, priceData]: [string, any]) => ({
      address,
      usdPrice: priceData.usd || 0
    }));

    res.status(200).json({ prices });
  } catch (error) {
    console.error('Token price API error:', error);
    // Return fallback prices if API fails
    res.status(200).json({ 
      prices: TOKEN_ADDRESSES.map(address => ({
        address,
        usdPrice: 0
      }))
    });
  }
}
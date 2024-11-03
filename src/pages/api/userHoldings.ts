// api/userHoldings.ts
import { PublicKey } from '@solana/web3.js';

interface TokenHolding {
  name: string;
  amount: number;
  allocation: number;
  price: number;
  value: number;
}

interface TokenResponse {
  holdings: TokenHolding[];
  error?: string;
}

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_SOLANA_API;
const TOKENS = {
  PUMP: {
    address: 'Gu3LDkn7Vx3bmCzLafYNKcDxv2mH7YN44NJZFXnypump',
    totalSupply: 999994411.71,
  },
  HELP: {
    address: 'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC',
    totalSupply: 1099999775.54,
  }
};

async function getTokenPrices() {
  try {
    const response = await fetch('/api/tokenPrices');
    const data = await response.json();
    return data.prices.reduce((acc: {[key: string]: number}, item: {address: string, usdPrice: number}) => {
      acc[item.address] = item.usdPrice;
      return acc;
    }, {});
  } catch (error) {
    console.error('Failed to fetch token prices:', error);
    return {};
  }
}

export async function getUserHoldings(walletAddress: string): Promise<TokenResponse> {
  if (!HELIUS_API_KEY) return { holdings: [], error: 'API key not found' };

  try {
    // Fetch token prices first
    const tokenPrices = await getTokenPrices();

    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'searchAssets',
        params: {
          ownerAddress: walletAddress,
          tokenType: 'fungible',
          displayOptions: {
            showNativeBalance: false,
          },
        },
      }),
    });

    const { result } = await response.json();
    const holdings: TokenHolding[] = [];

    // Process results
    for (const item of result.items) {
      if (item.id === TOKENS.PUMP.address || item.id === TOKENS.HELP.address) {
        const amount = Number(item.token_info?.amount || 0);
        const isPump = item.id === TOKENS.PUMP.address;
        const totalSupply = isPump ? TOKENS.PUMP.totalSupply : TOKENS.HELP.totalSupply;
        const price = tokenPrices[item.id] || 0;

        holdings.push({
          name: item.token_info?.symbol || '',
          amount,
          allocation: (amount / totalSupply) * 100,
          price,
          value: amount * price
        });
      }
    }

    return { holdings };
  } catch (error) {
    return { holdings: [], error: 'Failed to fetch holdings' };
  }
}
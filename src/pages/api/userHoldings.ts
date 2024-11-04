// api/userHoldings.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const HELIUS_API = `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_SOLANA_API}`;

const TOKENS = {
  DEGENAI: {
    address: 'Gu3LDkn7Vx3bmCzLafYNKcDxv2mH7YN44NJZFXnypump',
    symbol: 'DEGENAI',
    decimals: 9
  },
  AI16Z: {
    address: 'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC',
    symbol: 'AI16Z',
    decimals: 9
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const walletAddress = req.query.wallet as string;
  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  if (!process.env.NEXT_PUBLIC_SOLANA_API) {
    return res.status(500).json({ error: 'Solana API key not configured' });
  }

  try {
    console.log('Fetching holdings for wallet:', walletAddress);
    
    const response = await fetch(HELIUS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'tokens-query',
        method: 'searchAssets',
        params: {
          ownerAddress: walletAddress,
          tokenType: 'fungible',
          mintAccounts: [TOKENS.DEGENAI.address, TOKENS.AI16Z.address],
          displayOptions: {
            showFungible: true,
            showNativeBalance: true
          }
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Helius response:', JSON.stringify(data, null, 2));

    if (data.error) {
      throw new Error(data.error.message || 'Failed to fetch token data');
    }

    const holdings = [];
    
    if (data.result?.items) {
      for (const item of data.result.items) {
        const tokenInfo = item.token_info || {};
        const decimals = item.id === TOKENS.DEGENAI.address ? 
          TOKENS.DEGENAI.decimals : TOKENS.AI16Z.decimals;
        
        const amount = Number(tokenInfo.amount || 0) / Math.pow(10, decimals);
        const price = tokenInfo.price_info?.price_per_token || 0;
        const value = amount * price;
        
        if (amount > 0) {
          holdings.push({
            name: item.id === TOKENS.DEGENAI.address ? 'DEGENAI' : 'AI16Z',
            amount,
            price,
            value,
            allocation: 0
          });
        }
      }
    }

    // Calculate allocations
    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
    holdings.forEach(h => {
      h.allocation = totalValue > 0 ? (h.value / totalValue) * 100 : 0;
    });

    console.log('Processed holdings:', holdings);
    return res.status(200).json({ holdings });
    
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch holdings'
    });
  }
}
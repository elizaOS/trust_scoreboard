// api/userHoldings.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const HELIUS_API = `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_SOLANA_API}`;

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

  try {
    console.log('Fetching holdings for wallet:', walletAddress);
    
    const response = await fetch(HELIUS_API, {
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
            showNativeBalance: true
          },
        },
      }),
    });

    const data = await response.json();
    console.log('Raw API response:', JSON.stringify(data, null, 2));

    if (!response.ok || data.error) {
      throw new Error(data.error?.message || 'Failed to fetch token data');
    }

    if (!data.result?.items) {
      return res.status(200).json({ holdings: [] });
    }

    const holdings = data.result.items
      .map(item => {
        const tokenInfo = item.token_info || {};
        const decimals = tokenInfo.decimals || 9; // Default to 9 decimals if not specified
        
        const amount = Number(tokenInfo.amount || 0) / Math.pow(10, decimals);
        const price = tokenInfo.price_info?.price_per_token || 0;
        const value = amount * price;

        return {
          name: tokenInfo.symbol || tokenInfo.name || item.id,
          amount,
          price,
          value,
          allocation: 0
        };
      })
      .filter(holding => holding.amount > 0); // Only show tokens with non-zero balance

    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
    holdings.forEach(h => {
      h.allocation = totalValue > 0 ? (h.value / totalValue) * 100 : 0;
    });

    // Sort by value descending
    holdings.sort((a, b) => b.value - a.value);

    return res.status(200).json({ holdings });
    
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch holdings'
    });
  }
}
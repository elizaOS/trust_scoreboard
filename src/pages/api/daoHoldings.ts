// pages/api/daoHoldings.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface TokenInfo {
  name: string;
  symbol: string;
  balance: number;
  price_info?: {
    total_price: number;
  }
}

interface HeliusResponse {
  result: {
    items: {
      token_info: TokenInfo;
    }[];
    nativeBalance: {
      total_price: number;
    }
  }
}

interface DAOHolding {
  rank: number;
  name: string;
  holdings: string;
  percentage: string;
  imageUrl: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_SOLANA_API}`;
  const DAO_WALLET = 'AM84n1iLdxgVTAyENBcLdjXoyvjentTbu5Q6EpKV1PeG';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'searchAssets',
        params: {
          ownerAddress: DAO_WALLET,
          tokenType: 'fungible',
          displayOptions: {
            showNativeBalance: true,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Helius API');
    }

    const data: HeliusResponse = await response.json();

    if (!data?.result?.items) {
      throw new Error('Invalid data format received from API');
    }

    const totalValue = data.result.nativeBalance.total_price;
    
    const holdings = data.result.items.map((item, index) => {
      const tokenInfo = item.token_info;
      const tokenValue = tokenInfo.price_info?.total_price || 0;
      
      return {
        rank: index + 1,
        name: tokenInfo.symbol || tokenInfo.name,
        holdings: formatCurrency(tokenValue),
        percentage: calculatePercentage(tokenValue, totalValue),
        imageUrl: `/images/tokens/${tokenInfo.symbol || 'default'}.png`,
      };
    });

    return res.status(200).json({ holdings });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to fetch holdings' });
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function calculatePercentage(amount: number, total: number): string {
  if (!total) return '0%';
  return `${((amount / total) * 100).toFixed(2)}%`;
}
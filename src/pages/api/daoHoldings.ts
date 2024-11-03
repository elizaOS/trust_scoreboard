// pages/api/daoHoldings.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const HELIUS_API = `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API}`;
const DAO_WALLET = 'AM84n1iLdxgVTAyENBcLdjXoyvjentTbu5Q6EpKV1PeG';

interface Asset {
  id: string;
  token_info?: {
    symbol: string;
    associated_token_address: string;
    price_info?: {
      price_per_token: number;
      total_price: number;
      currency: string;
    }
  }
}

interface HeliusResponse {
  result: {
    items: Asset[];
    nativeBalance: {
      price_per_sol: number;
      total_price: number;
    }
  }
}

interface DAOHolding {
  rank: number;
  name: string;
  members: number;
  holdings: string;
  percentage: string;
  imageUrl: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch wallet assets from Helius
    const response = await fetch(HELIUS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAssetsByOwner',
        params: [
          DAO_WALLET,
          { page: 1, limit: 1000 }
        ],
      }),
    });

    const data = await response.json();
    
    if (!data.result) {
      throw new Error('Invalid response from Helius API');
    }

    // Process and transform the data
    const holdings: DAOHolding[] = data.result.items.map((asset: Asset, index: number) => ({
      rank: index + 1,
      name: asset.token_info?.symbol || 'Unknown Token',
      members: 0, // This would need to be fetched from another source
      holdings: asset.token_info?.price_info ? 
        `$${asset.token_info.price_info.total_price.toLocaleString()}` : 
        'N/A',
      percentage: '0%', // Calculate based on total holdings
      imageUrl: `/images/tokens/${asset.token_info?.symbol || 'default'}.png`,
    }));

    // Sort by holdings value
    holdings.sort((a, b) => {
      const aValue = parseFloat(a.holdings.replace('$', '').replace(',', '')) || 0;
      const bValue = parseFloat(b.holdings.replace('$', '').replace(',', '')) || 0;
      return bValue - aValue;
    });

    return res.status(200).json(holdings);

  } catch (error) {
    console.error('Error fetching DAO holdings:', error);
    return res.status(500).json({ error: 'Failed to fetch DAO holdings' });
  }
}
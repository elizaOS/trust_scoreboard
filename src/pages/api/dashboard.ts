import type { NextApiRequest, NextApiResponse } from 'next';
import NodeCache from 'node-cache';

// Create cache instance with 30 minute TTL
const cache = new NodeCache({ 
  stdTTL: 1800, // 30 minutes in seconds
  checkperiod: 120 // Check for expired keys every 2 minutes
});

const CACHE_KEY = 'dashboard_data';

// Constants
const HELIUS_API = `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_SOLANA_API}`;
const TOKENS = {
  DEGENAI: {
    address: 'Gu3LDkn7Vx3bmCzLafYNKcDxv2mH7YN44NJZFXnyai16z',
    totalSupply: 999994411.71,
  },
  AI16Z: {
    address: 'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC',
    totalSupply: 1099999775.54,
  }
};
const DAO_WALLET = 'AM84n1iLdxgVTAyENBcLdjXoyvjentTbu5Q6EpKV1PeG';
const DECIMALS = 9;
const MIN_AMOUNT = 100000;

// Additional Interfaces
interface TokenHolding {
  name: string;
  amount: number;
  allocation: number;
  price: number;
  value: number;
}

interface TrustScoreResult {
  score: number;
  imagePath?: string;
  label: string;
}
interface Partner {
  owner: string;
  displayAddress: string;
  amount: number;
  createdAt: string;
  trustScore: number;
}

interface DashboardResponse {
  partners: Partner[];
  holdings: any[];
  prices: any[];
  trustScores: Record<string, number>;
  userHoldings?: TokenHolding[];
}

// Add new ai16zer function for trust score calculation with tiers
const calculateTrustScoreWithTier = (amount: number): TrustScoreResult => {
  const rawScore = amount === 0 ? 0 : Math.min(100, (amount / MIN_AMOUNT) * 10);
  const score = Number(rawScore.toFixed(1));

  let result: TrustScoreResult = {
    score,
    label: 'Unverified'
  };

  if (score === 0) {
    result.imagePath = '/null.png';
  } else if (score >= 8) {
    result.label = 'Diamond Partner';
    result.imagePath = '/diamond.png';
  } else if (score >= 5) {
    result.label = 'Gold Partner';
    result.imagePath = '/gold.png';
  } else if (score >= 2) {
    result.label = 'Silver Partner';
    result.imagePath = '/silver.png';
  } else {
    result.label = 'Bronze Partner';
    result.imagePath = '/bronze.png';
  }

  return result;
};

// Add function to fetch token prices from Helius
async function getTokenPrices() {
  try {
    const responses = await Promise.all([
      fetch(HELIUS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'ai16z-price',
          method: 'getAsset',
          params: {
            id: TOKENS.AI16Z.address,
            displayOptions: {
              showFungible: true
            }
          },
        }),
      }),
      fetch(HELIUS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'degenai-price',
          method: 'getAsset',
          params: {
            id: TOKENS.DEGENAI.address,
            displayOptions: {
              showFungible: true
            }
          },
        }),
      })
    ]);

    const [ai16zData, degenAiData] = await Promise.all(responses.map(r => r.json()));
    console.log('Price data:', { ai16z: ai16zData, degenAi: degenAiData });

    return [
      {
        address: TOKENS.AI16Z.address,
        usdPrice: ai16zData.result?.token_info?.price_info?.price_per_token || 0
      },
      {
        address: TOKENS.DEGENAI.address,
        usdPrice: ai16zData.result?.token_info?.price_info?.price_per_token || 0
      }
    ];
  } catch (error) {
    console.error('Token price API error:', error);
    return Object.values(TOKENS).map(token => ({
      address: token.address,
      usdPrice: 0
    }));
  }
}

// Add function to get user holdings
async function getUserHoldings(walletAddress: string): Promise<TokenHolding[]> {
  try {
    console.log('Fetching holdings for wallet:', walletAddress);
    
    // Fetch token balances using getAssetsByOwner
    const response = await fetch(HELIUS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: walletAddress,
          page: 1,
          limit: 1000,
          displayOptions: {
            showFungible: true,
          }
        },
      }),
    });

    const data = await response.json();
    console.log('Raw balance response:', data);

    // Get token prices
    const prices = await getTokenPrices();
    console.log('Token prices:', prices);

    const priceMap = prices.reduce((acc, { address, usdPrice }) => {
      acc[address] = usdPrice;
      return acc;
    }, {} as Record<string, number>);

    // Initialize holdings array
    const holdings: TokenHolding[] = [];
    // Process AI16Z token
    const ai16zHolding = data.result.items?.find((item: any) => 
      item.id === TOKENS.AI16Z.address
    );
    if (ai16zHolding) {
      const amount = Number(ai16zHolding.token_info?.amount || 0) / Math.pow(10, DECIMALS);
      const price = priceMap[TOKENS.AI16Z.address] || 0;
      const value = amount * price;
      holdings.push({
        name: 'ai16z',
        amount,
        allocation: (amount / TOKENS.AI16Z.totalSupply) * 100,
        price,
        value
      });
    }

    // Process DEGENAI token
    const ai16zToken = data.result.items?.find((item: any) => 
      item.id === TOKENS.DEGENAI.address
    );
    if (ai16zToken) {
      const amount = Number(ai16zToken.token_info?.amount || 0) / Math.pow(10, DECIMALS);
      const price = priceMap[TOKENS.DEGENAI.address] || 0;
      const value = amount * price;
      holdings.push({
        name: 'degenai',
        amount,
        allocation: (amount / TOKENS.DEGENAI.totalSupply) * 100,
        price,
        value
      });
    }

    console.log('Processed holdings:', holdings);

    // Sort by value descending
    return holdings.sort((a, b) => b.value - a.value);

  } catch (error) {
    console.error('Error fetching user holdings:', error);
    return [];
  }
}

// Main Data Fetching Functions
async function getAllPartners(): Promise<Partner[]> {
  try {
    let allHolders: Partner[] = [];
    let cursor = undefined;
    
    // Keep fetching until we have all holders
    while (true) {
      const response = await fetch(HELIUS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "helius-test",
          method: "getTokenAccounts",
          params: {
            mint: TOKENS.AI16Z.address,
            limit: 1000,
            displayOptions: {
              showZeroBalance: false
            },
            ...(cursor && { cursor })
          },
        }),
      });

      const data = await response.json();
      
      if (!data.result?.token_accounts || data.result.token_accounts.length === 0) {
        break;
      }

      // Process current batch of holders
      const currentHolders = data.result.token_accounts
        .map((account: any) => {
          const amount = Number(account.amount || 0) / Math.pow(10, DECIMALS);
          if (amount >= MIN_AMOUNT) {
            return {
              owner: account.owner,
              displayAddress: `${account.owner.slice(0, 6)}...${account.owner.slice(-4)}`,
              amount: amount,
              createdAt: new Date().toISOString(),
              trustScore: 0 // Default trust score
            };
          }
          return null;
        })
        .filter(Boolean);

      allHolders = [...allHolders, ...currentHolders];
      
      // Get cursor for next page
      cursor = data.result.cursor;
      
      // If no cursor, we've reached the end
      if (!cursor) {
        break;
      }
    }

    // Sort by amount and ensure unique holders
    const uniqueHolders = Array.from(
      new Map(allHolders.map(holder => [holder.owner, holder]))
      .values()
    ).sort((a, b) => b.amount - a.amount);

    console.log(`Found ${uniqueHolders.length} unique holders with > ${MIN_AMOUNT} AI16Z`);
    return uniqueHolders;
  } catch (error) {
    console.error("Error fetching partner accounts:", error);
    return [];
  }
}

async function getDAOHoldings() {
  try {
    const response = await fetch(HELIUS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'searchAssets',
        params: {
          ownerAddress: DAO_WALLET,
          tokenType: 'fungible',
          displayOptions: { showNativeBalance: true },
        },
      }),
    });

    const data = await response.json();
    
    // Better error handling and default values
    if (!data?.result) {
      console.warn('Empty result from Helius API');
      return [];
    }

    const items = data.result.items || [];
    const totalValue = data.result.nativeBalance?.total_price || 0;
    
    return items.map((item: any, index: number) => {
      const tokenInfo = item.token_info || {};
      const tokenValue = tokenInfo.price_info?.total_price || 0;
      const tokenAmount = Number(item.amount || 0);
      
      return {
        rank: index + 1,
        name: tokenInfo.symbol || tokenInfo.name || 'Unknown',
        holdings: tokenAmount.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: tokenInfo.decimals || 6
        }),
        value: tokenValue.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        }),
        percentage: totalValue > 0 ? ((tokenValue / totalValue) * 100).toFixed(2) + '%' : '0%',
        imageUrl: `/images/tokens/${tokenInfo.symbol || 'default'}.png`,
      };
    });
  } catch (error) {
    console.error('Error fetching DAO holdings:', error);
    return [];
  }
}

// Main API Handler with retry logic
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if we have cached data
    const cachedData = cache.get(CACHE_KEY);
    if (cachedData) {
      console.log('Returning cached dashboard data');
      return res.status(200).json(cachedData);
    }

    // If no cached data, fetch fresh data
    const MAX_RETRIES = 3;
    let attempt = 0;
    
    while (attempt < MAX_RETRIES) {
      try {
        const walletAddress = req.query.wallet as string;
        
        const timeout = (promise: Promise<any>, ms: number) => {
          return Promise.race([
            promise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), ms)
            )
          ]);
        };

        const [partnersResult, holdingsResult, pricesResult, userHoldingsResult] = await Promise.allSettled([
          timeout(getAllPartners(), 10000),
          timeout(getDAOHoldings(), 10000),
          timeout(getTokenPrices(), 10000),
          walletAddress ? timeout(getUserHoldings(walletAddress), 10000) : Promise.resolve(undefined)
        ]);

        const partners = partnersResult.status === 'fulfilled' ? partnersResult.value : [];
        const holdings = holdingsResult.status === 'fulfilled' ? holdingsResult.value : [];
        const prices = pricesResult.status === 'fulfilled' ? pricesResult.value : [];
        const userHoldings = userHoldingsResult.status === 'fulfilled' ? userHoldingsResult.value : undefined;

        if (!partners.length || !prices.length) {
          throw new Error('Missing critical data');
        }

        const trustScores = partners.reduce((acc, partner) => {
          // Default all trust scores to 0 for now
          acc[partner.owner] = 0;
          return acc;
        }, {} as Record<string, number>);

        const response: DashboardResponse = {
          partners,
          holdings,
          prices,
          trustScores,
          ...(userHoldings && { userHoldings })
        };

        // Cache the response
        cache.set(CACHE_KEY, response);
        console.log('Cached fresh dashboard data');

        return res.status(200).json(response);
      } catch (error) {
        attempt++;
        if (attempt === MAX_RETRIES) {
          console.error('Dashboard API Error after retries:', error);
          return res.status(500).json({ 
            error: 'Failed to fetch dashboard data',
            details: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  } catch (error) {
    console.error('Cache error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Add function to manually clear cache if needed
export function clearDashboardCache() {
  cache.del(CACHE_KEY);
}

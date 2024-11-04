import type { NextApiRequest, NextApiResponse } from 'next';

// Constants
const HELIUS_API = `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_SOLANA_API}`;
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

// Add new helper function for trust score calculation with tiers
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
          id: 'help-price',
          method: 'getAsset',
          params: {
            id: TOKENS.HELP.address,
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
          id: 'pump-price',
          method: 'getAsset',
          params: {
            id: TOKENS.PUMP.address,
            displayOptions: {
              showFungible: true
            }
          },
        }),
      })
    ]);

    const [helpData, pumpData] = await Promise.all(responses.map(r => r.json()));

    return [
      {
        address: TOKENS.HELP.address,
        usdPrice: helpData.result?.token_info?.price_info?.price_per_token || 0
      },
      {
        address: TOKENS.PUMP.address,
        usdPrice: pumpData.result?.token_info?.price_info?.price_per_token || 0
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
            showFungible: true,
            showNativeBalance: false 
          },
        },
      }),
    });

    const { result } = await response.json();
    const holdings: TokenHolding[] = [];

    for (const item of result.items) {
      if (item.id === TOKENS.PUMP.address || item.id === TOKENS.HELP.address) {
        const amount = Number(item.token_info?.amount || 0) / Math.pow(10, DECIMALS);
        const isPump = item.id === TOKENS.PUMP.address;
        const totalSupply = isPump ? TOKENS.PUMP.totalSupply : TOKENS.HELP.totalSupply;
        const price = item.token_info?.price_info?.price_per_token || 0;

        holdings.push({
          name: item.token_info?.symbol || '',
          amount,
          allocation: (amount / totalSupply) * 100,
          price,
          value: amount * price
        });
      }
    }

    return holdings;
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
            mint: TOKENS.HELP.address,
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

    console.log(`Found ${uniqueHolders.length} unique holders with > ${MIN_AMOUNT} HELP`);
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

  const MAX_RETRIES = 3;
  let attempt = 0;
  
  while (attempt < MAX_RETRIES) {
    try {
      const walletAddress = req.query.wallet as string;
      
      // Add timeouts to Promise.allSettled
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

      // Validate results
      const partners = partnersResult.status === 'fulfilled' ? partnersResult.value : [];
      const holdings = holdingsResult.status === 'fulfilled' ? holdingsResult.value : [];
      const prices = pricesResult.status === 'fulfilled' ? pricesResult.value : [];
      const userHoldings = userHoldingsResult.status === 'fulfilled' ? userHoldingsResult.value : undefined;

      // Ensure we have minimum required data
      if (!partners.length || !prices.length) {
        throw new Error('Missing critical data');
      }

      const trustScores = partners.reduce((acc, partner) => {
        const trustResult = calculateTrustScoreWithTier(partner.amount);
        acc[partner.owner] = trustResult.score;
        return acc;
      }, {} as Record<string, number>);

      const response: DashboardResponse = {
        partners,
        holdings,
        prices,
        trustScores,
        ...(userHoldings && { userHoldings })
      };

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
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

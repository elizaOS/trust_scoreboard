// api/trustScore.ts

interface TrustScoreResult {
  score: number;
  imagePath?: string;
  label: string;
}

export const calculateTrustScore = (amount: number, minAmount: number = 100000): TrustScoreResult => {
  // Input validation
  if (typeof amount !== 'number' || amount < 0) {
    throw new Error('Invalid amount provided');
  }

  // Base calculation - fixed the Math.min logic
  const rawScore = amount === 0 ? 0 : Math.min(100, (amount / minAmount) * 10);
  const score = Number(rawScore.toFixed(1));

  // Result object with score categories
  let result: TrustScoreResult = {
    score,
    label: 'Unverified'
  };

  // Score classification
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

export const getTrustScoreImage = (score: number): string => {
  if (score <= 0) return '/null.png';
  return '/null.png'; // Placeholder for future tier images
};

// API Route Handler
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Mock data for example - replace with real data source
    const mockTrustScores: Record<string, number> = {
      '0x123...': 750000,
      '0x456...': 250000,
      '0x789...': 100000,
    };

    const scores = Object.entries(mockTrustScores).reduce((acc, [address, amount]) => {
      acc[address] = calculateTrustScore(amount).score;
      return acc;
    }, {} as Record<string, number>);

    return res.status(200).json(scores);
  } catch (error) {
    console.error('Trust score calculation error:', error);
    return res.status(500).json({ error: 'Failed to calculate trust scores' });
  }
}
// utils/trustScore.ts

interface TrustScoreResult {
  score: number;
  imagePath?: string;
  label: string;
}

export const calculateTrustScore = (amount: number, minAmount: number = 100000): TrustScoreResult => {
  // Base calculation
  const rawScore = amount === 0 ? 0 : Math.min(0, (amount / minAmount) * 10);
  const score = Number(rawScore.toFixed(1));

  // Default values
  let label = 'Unverified';
  let result: TrustScoreResult = { score, label };

  if (score === 0) {
    result.imagePath = '/null.png';
  } else if (score >= 80) {
    result.label = 'Diamond Partner';
  } else if (score >= 60) {
    result.label = 'Platinum Partner';
  } else if (score >= 40) {
    result.label = 'Gold Partner';
  } else if (score >= 20) {
    result.label = 'Silver Partner';
  } else {
    result.label = 'Bronze Partner';
  }

  return result;
};

export const getTrustScoreImage = (score: number): string => {
  if (score <= 0) return '/null.png';
  return '/null.png'; // Placeholder for future tier images
};
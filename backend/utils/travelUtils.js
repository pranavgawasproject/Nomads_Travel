/**
 * Utility functions for digital nomad travel calculations and data sanitization.
 */

export function calculateNomadLivingCost(baseMonthlyCost, durationDays, style = 'standard') {
  if (typeof baseMonthlyCost !== 'number' || baseMonthlyCost <= 0 || isNaN(baseMonthlyCost)) {
    return 0;
  }
  if (typeof durationDays !== 'number' || durationDays <= 0 || isNaN(durationDays)) {
    return 0;
  }

  const multiplier = style === 'budget' ? 0.8 : style === 'luxury' ? 1.6 : 1.0;
  const dailyRate = (baseMonthlyCost / 30) * multiplier;
  return Math.round(dailyRate * durationDays * 100) / 100;
}

export function formatCurrency(amount, currency = 'USD') {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0.00';
  }
  try {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function calculateCurrencyExchange(amount, rate) {
  if (typeof amount !== 'number' || amount <= 0 || typeof rate !== 'number' || rate <= 0) {
    return 0;
  }
  return Math.round(amount * rate * 100) / 100;
}

export function calculateTripBudget({ totalBudget, durationDays, accommodationShare = 0.4, foodShare = 0.3, activitiesShare = 0.2, contingencyShare = 0.1 } = {}) {
  if (typeof totalBudget !== 'number' || totalBudget <= 0 || isNaN(totalBudget)) {
    return { valid: false, error: 'Total budget must be a positive number' };
  }
  if (typeof durationDays !== 'number' || durationDays <= 0 || !Number.isInteger(durationDays)) {
    return { valid: false, error: 'Duration days must be a positive integer' };
  }

  const accommodation = Math.round(totalBudget * accommodationShare * 100) / 100;
  const food = Math.round(totalBudget * foodShare * 100) / 100;
  const activities = Math.round(totalBudget * activitiesShare * 100) / 100;
  const contingency = Math.round(totalBudget * contingencyShare * 100) / 100;
  const dailySpendable = Math.round(((food + activities) / durationDays) * 100) / 100;

  return {
    valid: true,
    totalBudget,
    durationDays,
    breakdown: {
      accommodation,
      food,
      activities,
      contingency
    },
    dailySpendable
  };
}

export function validateDestinationFilter(query = {}) {
  const sanitized = {};
  if (query.region && typeof query.region === 'string') {
    sanitized.region = query.region.trim();
  }
  if (query.maxCost && !isNaN(Number(query.maxCost))) {
    sanitized.maxCost = Math.max(0, Number(query.maxCost));
  }
  if (query.minInternetMbps && !isNaN(Number(query.minInternetMbps))) {
    sanitized.minInternetMbps = Math.max(0, Number(query.minInternetMbps));
  }
  if (typeof query.safetyScore === 'number' || (typeof query.safetyScore === 'string' && !isNaN(Number(query.safetyScore)))) {
    const score = Number(query.safetyScore);
    if (score >= 1 && score <= 5) {
      sanitized.safetyScore = score;
    }
  }
  return sanitized;
}

export function calculateNomadScore({ internetSpeedMbps = 0, monthlyCostUsd = 2000, safetyRating = 3, visaEaseScore = 3 } = {}) {
  const speed = Math.max(0, typeof internetSpeedMbps === 'number' ? internetSpeedMbps : 0);
  const cost = Math.max(1, typeof monthlyCostUsd === 'number' ? monthlyCostUsd : 2000);
  const safety = Math.min(5, Math.max(1, typeof safetyRating === 'number' ? safetyRating : 3));
  const visa = Math.min(5, Math.max(1, typeof visaEaseScore === 'number' ? visaEaseScore : 3));

  const speedScore = Math.min(100, (speed / 100) * 100);
  const costScore = Math.max(0, Math.min(100, 100 - ((cost - 500) / 3500) * 100));
  const safetyScore = (safety / 5) * 100;
  const visaScore = (visa / 5) * 100;

  const totalScore = Math.round((speedScore * 0.35 + costScore * 0.25 + safetyScore * 0.20 + visaScore * 0.20) * 10) / 10;
  return {
    score: Math.min(100, Math.max(0, totalScore)),
    rating: totalScore >= 80 ? 'Excellent' : totalScore >= 60 ? 'Good' : totalScore >= 40 ? 'Average' : 'Challenging',
    breakdown: { speedScore: Math.round(speedScore), costScore: Math.round(costScore), safetyScore: Math.round(safetyScore), visaScore: Math.round(visaScore) }
  };
}



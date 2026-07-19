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

/**
 * Nomad Community Hub & Destination Match Score Utility
 * Calculates destination suitability for digital nomads based on internet speed,
 * budget alignment, visa feasibility, community density, and time zone overlap.
 */

export function calculateNomadCommunityHubMatchScore({
  destination = {},
  nomadPreferences = {}
} = {}) {
  const minWifiMbps = nomadPreferences.minWifiMbps || 50;
  const maxMonthlyBudget = nomadPreferences.maxMonthlyBudget || 2500;
  const preferredContinent = (nomadPreferences.preferredContinent || '').toLowerCase();
  const workTimezoneUtcOffset = nomadPreferences.workTimezoneUtcOffset ?? 0;

  const destWifiMbps = destination.wifiSpeedMbps || 30;
  const destMonthlyCost = destination.monthlyCostUsd || 2000;
  const destContinent = (destination.continent || '').toLowerCase();
  const destTimezoneUtcOffset = destination.timezoneUtcOffset ?? 0;
  const destCoworkingSpaces = destination.coworkingSpaceCount || 5;
  const destVisaDays = destination.visaFreeDays || 90;

  // 1. Wifi Score (25%)
  const wifiRatio = Math.min(2.0, destWifiMbps / minWifiMbps);
  const wifiScore = Math.min(100, Math.round(wifiRatio * 50));

  // 2. Budget Score (25%)
  let budgetScore = 100;
  if (destMonthlyCost > maxMonthlyBudget) {
    const over = destMonthlyCost - maxMonthlyBudget;
    budgetScore = Math.max(0, 100 - Math.round((over / maxMonthlyBudget) * 100));
  }

  // 3. Visa & Location Feasibility Score (20%)
  let visaScore = Math.min(100, Math.round((destVisaDays / 90) * 80));
  if (preferredContinent && destContinent === preferredContinent) {
    visaScore = Math.min(100, visaScore + 20);
  }

  // 4. Community & Coworking Score (15%)
  const coworkingScore = Math.min(100, destCoworkingSpaces * 10);

  // 5. Time zone Overlap Score (15%)
  const tzDiff = Math.abs(destTimezoneUtcOffset - workTimezoneUtcOffset);
  const tzScore = Math.max(0, 100 - tzDiff * 12);

  // Total weighted score
  const totalScore = Math.round(
    wifiScore * 0.25 +
    budgetScore * 0.25 +
    visaScore * 0.20 +
    coworkingScore * 0.15 +
    tzScore * 0.15
  );

  const finalScore = Math.max(0, Math.min(100, totalScore));

  let suitabilityTier = 'POOR';
  if (finalScore >= 80) suitabilityTier = 'EXCELLENT';
  else if (finalScore >= 65) suitabilityTier = 'GOOD';
  else if (finalScore >= 50) suitabilityTier = 'MODERATE';

  const recommendations = [];
  if (wifiScore < 60) recommendations.push('Consider verifying local SIM/5G coverage or backup eSIM options.');
  if (budgetScore < 60) recommendations.push('Cost of living exceeds target budget; consider off-peak season accommodation.');
  if (tzScore < 50) recommendations.push(`Significant time zone offset (${tzDiff} hours difference from work team).`);

  return {
    matchScore: finalScore,
    suitabilityTier,
    categoryScores: {
      wifiScore,
      budgetScore,
      visaScore,
      coworkingScore,
      tzScore
    },
    recommendations
  };
}

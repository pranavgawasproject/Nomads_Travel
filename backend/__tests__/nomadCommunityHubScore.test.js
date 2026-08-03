import { calculateNomadCommunityHubMatchScore } from '../utils/nomadCommunityHubScore.js';

describe('nomadCommunityHubScore', () => {
  test('evaluates excellent match destination correctly', () => {
    const result = calculateNomadCommunityHubMatchScore({
      destination: {
        name: 'Lisbon',
        wifiSpeedMbps: 120,
        monthlyCostUsd: 1800,
        continent: 'Europe',
        timezoneUtcOffset: 1,
        coworkingSpaceCount: 12,
        visaFreeDays: 90
      },
      nomadPreferences: {
        minWifiMbps: 50,
        maxMonthlyBudget: 2500,
        preferredContinent: 'Europe',
        workTimezoneUtcOffset: 0
      }
    });

    expect(result.matchScore).toBeGreaterThanOrEqual(80);
    expect(result.suitabilityTier).toBe('EXCELLENT');
    expect(result.categoryScores.wifiScore).toBe(100);
  });

  test('flags budget constraints when destination cost exceeds budget', () => {
    const result = calculateNomadCommunityHubMatchScore({
      destination: {
        name: 'Zurich',
        wifiSpeedMbps: 200,
        monthlyCostUsd: 4500,
        continent: 'Europe',
        timezoneUtcOffset: 1,
        coworkingSpaceCount: 8,
        visaFreeDays: 90
      },
      nomadPreferences: {
        minWifiMbps: 50,
        maxMonthlyBudget: 2000,
        preferredContinent: 'Europe',
        workTimezoneUtcOffset: 0
      }
    });

    expect(result.categoryScores.budgetScore).toBeLessThan(50);
    expect(result.recommendations.some(r => r.includes('exceeds target budget'))).toBe(true);
  });

  test('calculates timezone offset warnings correctly', () => {
    const result = calculateNomadCommunityHubMatchScore({
      destination: {
        name: 'Tokyo',
        wifiSpeedMbps: 150,
        monthlyCostUsd: 2200,
        continent: 'Asia',
        timezoneUtcOffset: 9,
        coworkingSpaceCount: 15,
        visaFreeDays: 90
      },
      nomadPreferences: {
        minWifiMbps: 50,
        maxMonthlyBudget: 2500,
        preferredContinent: 'Europe',
        workTimezoneUtcOffset: -5
      }
    });

    expect(result.categoryScores.tzScore).toBeLessThan(30);
    expect(result.recommendations.some(r => r.includes('time zone offset'))).toBe(true);
  });
});

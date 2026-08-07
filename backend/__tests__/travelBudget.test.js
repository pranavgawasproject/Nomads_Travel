import { calculateTripBudget, validateDestinationFilter, calculateNomadColivingUtilityAndWifiCostSplit, calculateNomadCoworkingSlaAndPowerBackupScore } from '../utils/travelUtils.js';

describe('calculateTripBudget and validateDestinationFilter', () => {
  describe('calculateTripBudget', () => {
    it('returns error for invalid budget', () => {
      expect(calculateTripBudget({ totalBudget: 0, durationDays: 10 })).toEqual({
        valid: false,
        error: 'Total budget must be a positive number'
      });
      expect(calculateTripBudget({ totalBudget: -500, durationDays: 10 })).toEqual({
        valid: false,
        error: 'Total budget must be a positive number'
      });
    });

    it('returns error for invalid duration', () => {
      expect(calculateTripBudget({ totalBudget: 2000, durationDays: 0 })).toEqual({
        valid: false,
        error: 'Duration days must be a positive integer'
      });
      expect(calculateTripBudget({ totalBudget: 2000, durationDays: 3.5 })).toEqual({
        valid: false,
        error: 'Duration days must be a positive integer'
      });
    });

    it('calculates accurate budget breakdown and daily spendable rate', () => {
      const result = calculateTripBudget({ totalBudget: 3000, durationDays: 30 });
      expect(result.valid).toBe(true);
      expect(result.breakdown.accommodation).toBe(1200);
      expect(result.breakdown.food).toBe(900);
      expect(result.breakdown.activities).toBe(600);
      expect(result.breakdown.contingency).toBe(300);
      expect(result.dailySpendable).toBe(50);
    });
  });

  describe('validateDestinationFilter', () => {
    it('sanitizes and extracts valid filter parameters', () => {
      const raw = {
        region: '  Southeast Asia  ',
        maxCost: '2500',
        minInternetMbps: '50',
        safetyScore: '4',
        invalidField: 'hacked'
      };
      const clean = validateDestinationFilter(raw);
      expect(clean).toEqual({
        region: 'Southeast Asia',
        maxCost: 2500,
        minInternetMbps: 50,
        safetyScore: 4
      });
    });

    it('ignores safety score outside 1-5 range', () => {
      expect(validateDestinationFilter({ safetyScore: 10 })).toEqual({});
    });
  });

  describe('calculateNomadColivingUtilityAndWifiCostSplit', () => {
    it('calculates utility and wifi split accurately', () => {
      const res = calculateNomadColivingUtilityAndWifiCostSplit({
        totalMonthlyUtilitiesUsd: 300,
        highSpeedWifiBillUsd: 100,
        occupantsCount: 4
      });
      expect(res.valid).toBe(true);
      expect(res.grandTotalUsd).toBe(400);
      expect(res.equalPerPersonShare).toBe(100);
      expect(res.wifiPerPersonShare).toBe(25);
      expect(res.utilityPerPersonShare).toBe(75);
    });

    it('returns error on invalid occupants count', () => {
      const err = calculateNomadColivingUtilityAndWifiCostSplit({ occupantsCount: 0 });
      expect(err.valid).toBe(false);
      expect(err.error).toBe('Occupants count must be a positive integer');
    });
  });

  describe('calculateNomadCoworkingSlaAndPowerBackupScore', () => {
    it('calculates enterprise ready SLA tier for reliable workspace', () => {
      const res = calculateNomadCoworkingSlaAndPowerBackupScore({
        primarySpeedMbps: 200,
        backupSpeedMbps: 50,
        hasGeneratorPowerBackup: true,
        averagePowerOutageHoursPerMonth: 1,
        dailyDeskRateUsd: 25
      });
      expect(res.valid).toBe(true);
      expect(res.reliabilityScore).toBe(100);
      expect(res.slaTier).toBe('PREMIUM_ENTERPRISE_READY');
    });

    it('returns error for invalid non-positive primary speed', () => {
      const err = calculateNomadCoworkingSlaAndPowerBackupScore({ primarySpeedMbps: 0 });
      expect(err.valid).toBe(false);
      expect(err.error).toBe('Primary speed Mbps must be a positive number');
    });
  });
});



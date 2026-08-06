import {
  calculate183DayTaxThreshold,
  calculateVisaExpiryWindow,
  assessNomadComplianceScore
} from '../utils/taxVisaAlertCalculator.js';

describe('taxVisaAlertCalculator engine', () => {
  describe('calculate183DayTaxThreshold', () => {
    it('returns default SAFE status for empty or invalid stays', () => {
      const result = calculate183DayTaxThreshold([]);
      expect(result.overallRisk).toBe('SAFE');
      expect(result.maxDaysSpent).toBe(0);
      expect(result.highestRiskCountry).toBeNull();
    });

    it('calculates total days per country and identifies WARNING status', () => {
      const stays = [
        { country: 'Portugal', days: 90 },
        { country: 'Portugal', days: 70 }, // total 160 -> WARNING
        { country: 'Spain', days: 30 }
      ];
      const result = calculate183DayTaxThreshold(stays);
      expect(result.overallRisk).toBe('WARNING');
      expect(result.countryBreakdown['PORTUGAL'].totalDaysSpent).toBe(160);
      expect(result.countryBreakdown['PORTUGAL'].status).toBe('WARNING');
      expect(result.countryBreakdown['PORTUGAL'].daysRemaining).toBe(23);
      expect(result.highestRiskCountry).toBe('PORTUGAL');
    });

    it('identifies CRITICAL_TAX_LIABILITY status when 183 days is exceeded', () => {
      const stays = [
        { country: 'Thailand', days: 190 }
      ];
      const result = calculate183DayTaxThreshold(stays);
      expect(result.overallRisk).toBe('CRITICAL_TAX_LIABILITY');
      expect(result.countryBreakdown['THAILAND'].exposurePercentage).toBe(100);
      expect(result.countryBreakdown['THAILAND'].daysRemaining).toBe(0);
    });
  });

  describe('calculateVisaExpiryWindow', () => {
    it('calculates valid remaining days correctly', () => {
      const entryDate = '2026-08-01';
      const currentDate = '2026-08-10';
      const maxDaysAllowed = 30; // deadline is Aug 31
      const result = calculateVisaExpiryWindow(entryDate, maxDaysAllowed, currentDate);
      expect(result.remainingDays).toBe(21);
      expect(result.status).toBe('VALID');
      expect(result.exitDeadline).toBe('2026-08-31');
    });

    it('flags EXPIRING_SOON when remaining days <= 14', () => {
      const entryDate = '2026-08-01';
      const currentDate = '2026-08-25';
      const maxDaysAllowed = 30;
      const result = calculateVisaExpiryWindow(entryDate, maxDaysAllowed, currentDate);
      expect(result.status).toBe('EXPIRING_SOON');
      expect(result.remainingDays).toBe(6);
    });

    it('flags OVERSTAY_EXPIRED when deadline has passed', () => {
      const entryDate = '2026-07-01';
      const currentDate = '2026-08-10';
      const maxDaysAllowed = 30;
      const result = calculateVisaExpiryWindow(entryDate, maxDaysAllowed, currentDate);
      expect(result.status).toBe('OVERSTAY_EXPIRED');
    });
  });

  describe('assessNomadComplianceScore', () => {
    it('returns score of 100 for safe stays and no visa alerts', () => {
      const result = assessNomadComplianceScore([{ country: 'Japan', days: 30 }]);
      expect(result.score).toBe(100);
      expect(result.recommendations.length).toBe(0);
    });

    it('deducts score and outputs urgent recommendations for tax & visa alerts', () => {
      const stays = [{ country: 'Indonesia', days: 185 }];
      const visaDetails = { entryDate: '2026-01-01', maxDaysAllowed: 90 };
      const result = assessNomadComplianceScore(stays, visaDetails);
      expect(result.score).toBeLessThan(60);
      expect(result.taxRisk).toBe('CRITICAL_TAX_LIABILITY');
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });
});

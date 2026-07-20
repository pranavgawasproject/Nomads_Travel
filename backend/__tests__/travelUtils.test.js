import { calculateNomadLivingCost, formatCurrency, calculateCurrencyExchange, calculateNomadScore, calculateTimeZoneOverlap, calculateCoworkingCostEstimate, calculateVisaStayLimit } from '../utils/travelUtils.js';

describe('Travel Utilities — Living Cost & Currency', () => {
  describe('calculateNomadLivingCost', () => {
    it('should calculate living cost correctly for standard style', () => {
      const cost = calculateNomadLivingCost(3000, 15, 'standard');
      expect(cost).toBe(1500);
    });

    it('should calculate living cost correctly for budget style', () => {
      const cost = calculateNomadLivingCost(3000, 30, 'budget');
      expect(cost).toBe(2400);
    });

    it('should calculate living cost correctly for luxury style', () => {
      const cost = calculateNomadLivingCost(3000, 10, 'luxury');
      expect(cost).toBe(1600);
    });

    it('should return 0 for invalid or negative inputs', () => {
      expect(calculateNomadLivingCost(-1000, 10)).toBe(0);
      expect(calculateNomadLivingCost(3000, -5)).toBe(0);
      expect(calculateNomadLivingCost(null, 10)).toBe(0);
    });
  });

  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      const formatted = formatCurrency(1250.5, 'USD');
      expect(formatted).toContain('1,250.50');
    });

    it('should return default $0.00 for non-numeric input', () => {
      expect(formatCurrency(NaN)).toBe('$0.00');
      expect(formatCurrency(null)).toBe('$0.00');
    });
  });

  describe('calculateCurrencyExchange', () => {
    it('should convert currency with given rate', () => {
      expect(calculateCurrencyExchange(100, 1.08)).toBe(108);
      expect(calculateCurrencyExchange(50, 0.92)).toBe(46);
    });

    it('should return 0 for invalid inputs', () => {
      expect(calculateCurrencyExchange(-100, 1.08)).toBe(0);
      expect(calculateCurrencyExchange(100, 0)).toBe(0);
    });
  });

  describe('calculateNomadScore', () => {
    it('should calculate composite nomad score for a high-performing hub', () => {
      const result = calculateNomadScore({ internetSpeedMbps: 120, monthlyCostUsd: 1200, safetyRating: 4.5, visaEaseScore: 4.5 });
      expect(result.score).toBeGreaterThan(70);
      expect(result.rating).toBeDefined();
    });

    it('should fallback gracefully for empty inputs', () => {
      const result = calculateNomadScore({});
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.breakdown).toBeDefined();
    });
  });

  describe('calculateTimeZoneOverlap', () => {
    it('should calculate 8 hours overlap for identical timezones', () => {
      const result = calculateTimeZoneOverlap(0, 0);
      expect(result.overlapHours).toBe(8);
      expect(result.percentage).toBe(100);
    });

    it('should calculate partial overlap for 3 hours difference', () => {
      const result = calculateTimeZoneOverlap(-5, -8);
      expect(result.overlapHours).toBe(5);
      expect(result.percentage).toBe(63);
    });

    it('should return 0 overlap when time difference exceeds work duration', () => {
      const result = calculateTimeZoneOverlap(-5, 5);
      expect(result.overlapHours).toBe(0);
      expect(result.percentage).toBe(0);
    });

    it('should handle invalid inputs gracefully', () => {
      const result = calculateTimeZoneOverlap(null, 'invalid');
      expect(result.overlapHours).toBe(0);
      expect(result.percentage).toBe(0);
    });
  });

  describe('calculateCoworkingCostEstimate', () => {
    it('calculates coworking desk cost based on pass type', () => {
      const res = calculateCoworkingCostEstimate(300, 10, 'hotdesk');
      expect(res.totalCost).toBe(100);
      expect(res.dailyRate).toBe(10);

      const dedicated = calculateCoworkingCostEstimate(300, 10, 'dedicated');
      expect(dedicated.totalCost).toBe(140);
    });

    it('returns 0 for invalid inputs', () => {
      expect(calculateCoworkingCostEstimate(0, 10).totalCost).toBe(0);
    });
  });

  describe('calculateVisaStayLimit', () => {
    it('calculates remaining visa days and deadline date', () => {
      const res = calculateVisaStayLimit('2026-01-01', 90, 30);
      expect(res.daysRemaining).toBe(60);
      expect(res.isWarning).toBe(false);
      expect(res.deadlineDate).toBe('2026-03-02');
    });

    it('triggers warning when 14 or fewer days remain', () => {
      const res = calculateVisaStayLimit('2026-01-01', 90, 80);
      expect(res.daysRemaining).toBe(10);
      expect(res.isWarning).toBe(true);
    });

    it('handles invalid or empty inputs gracefully', () => {
      const res = calculateVisaStayLimit(null);
      expect(res.daysRemaining).toBe(0);
      expect(res.isWarning).toBe(false);
    });
  });
});





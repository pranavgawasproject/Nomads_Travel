import { calculateNomadLivingCost, formatCurrency, calculateCurrencyExchange, calculateNomadScore, calculateTimeZoneOverlap, calculateCoworkingCostEstimate, calculateVisaStayLimit, calculateTripBudget, validateDestinationFilter, calculateEventReminderSchedule, calculateNomadTaxResidencyRisk, calculateTravelInsuranceEstimate, calculateNomadWorkationSavings, calculateNomadEmergencyFundRequirement, calculateDigitalNomadSubletRoi, calculateNomadSimDataBudget } from '../utils/travelUtils.js';



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

  describe('calculateTripBudget', () => {
    it('calculates category breakdowns and daily spendable correctly', () => {
      const budget = calculateTripBudget({ totalBudget: 2000, durationDays: 20 });
      expect(budget.valid).toBe(true);
      expect(budget.breakdown.accommodation).toBe(800);
      expect(budget.breakdown.food).toBe(600);
      expect(budget.breakdown.activities).toBe(400);
      expect(budget.breakdown.contingency).toBe(200);
      expect(budget.dailySpendable).toBe(50);
    });

    it('returns error for invalid budget or duration', () => {
      const res = calculateTripBudget({ totalBudget: -100, durationDays: 10 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Total budget must be a positive number');
    });
  });

  describe('validateDestinationFilter', () => {
    it('sanitizes query fields and trims region strings', () => {
      const filter = validateDestinationFilter({ region: ' Europe ', maxCost: '1500', minInternetMbps: '50', safetyScore: '4' });
      expect(filter.region).toBe('Europe');
      expect(filter.maxCost).toBe(1500);
      expect(filter.minInternetMbps).toBe(50);
      expect(filter.safetyScore).toBe(4);
    });

    it('ignores invalid safetyScore values outside 1-5', () => {
      const filter = validateDestinationFilter({ safetyScore: 10 });
      expect(filter.safetyScore).toBeUndefined();
    });
  });

  describe('calculateEventReminderSchedule', () => {
    it('calculates reminder timestamps and evaluates upcoming status', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const res = calculateEventReminderSchedule(futureDate);
      expect(res.isValid).toBe(true);
      expect(res.isUpcomingSoon).toBe(true);
      expect(res.reminder24h).toBeDefined();
      expect(res.reminder2h).toBeDefined();
    });

    it('handles invalid dates gracefully', () => {
      const res = calculateEventReminderSchedule('invalid-date');
      expect(res.isValid).toBe(false);
      expect(res.isUpcomingSoon).toBe(false);
    });
  });

  describe('calculateNomadTaxResidencyRisk', () => {
    it('calculates total days, risk percentage and detects threshold exceedance', () => {
      const stays = [
        { country: 'Portugal', days: 190 },
        { country: 'Spain', days: 90 },
        { country: 'Thailand', days: 60 }
      ];
      const res = calculateNomadTaxResidencyRisk(stays, 183);
      expect(res.hasHighRisk).toBe(true);
      expect(res.totalDaysTracked).toBe(340);
      expect(res.warningCountries).toEqual(['Portugal']);
      expect(res.countryBreakdown[0].riskPercentage).toBe(100);
    });

    it('handles empty stays array gracefully', () => {
      const res = calculateNomadTaxResidencyRisk([]);
      expect(res.hasHighRisk).toBe(false);
      expect(res.totalStaysCount).toBe(0);
      expect(res.countryBreakdown).toEqual([]);
    });
  });

  describe('calculateTravelInsuranceEstimate', () => {
    it('calculates insurance costs for default options', () => {
      const res = calculateTravelInsuranceEstimate({ durationDays: 10 });
      expect(res.valid).toBe(true);
      expect(res.totalCost).toBe(35);
      expect(res.dailyRate).toBe(3.5);
    });

    it('handles invalid durationDays gracefully', () => {
      const res = calculateTravelInsuranceEstimate({ durationDays: -5 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Duration days must be a positive number');
    });
  });

  describe('calculateNomadWorkationSavings', () => {
    it('calculates net monthly and total savings correctly with recommendation', () => {
      const res = calculateNomadWorkationSavings({ homeMonthlyExpense: 3000, destinationMonthlyExpense: 1200, flightCostUsd: 500, durationMonths: 3 });
      expect(res.valid).toBe(true);
      expect(res.monthlySavings).toBe(1800);
      expect(res.grossHomeTotal).toBe(9000);
      expect(res.grossDestinationTotal).toBe(4100);
      expect(res.netTotalSavings).toBe(4900);
      expect(res.recommendation).toBe('Highly Favorable');
    });

    it('returns error for invalid expense or duration inputs', () => {
      const res = calculateNomadWorkationSavings({ homeMonthlyExpense: -500 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Home monthly expense must be a positive number');
    });
  });

  describe('calculateNomadEmergencyFundRequirement', () => {
    it('calculates total required emergency fund including buffer and flight cost', () => {
      const res = calculateNomadEmergencyFundRequirement({ monthlyLivingExpense: 2000, durationMonths: 6, bufferPercentage: 20, includesEmergencyFlight: true, emergencyFlightCostUsd: 1200 });
      expect(res.valid).toBe(true);
      expect(res.baseExpenseTotal).toBe(12000);
      expect(res.bufferAmount).toBe(2400);
      expect(res.emergencyFlightCost).toBe(1200);
      expect(res.totalEmergencyFundRequired).toBe(15600);
      expect(res.recommendedMonthlySavingTarget).toBe(1300);
    });

    it('handles zero buffer and no emergency flight option correctly', () => {
      const res = calculateNomadEmergencyFundRequirement({ monthlyLivingExpense: 1500, durationMonths: 3, bufferPercentage: 0, includesEmergencyFlight: false });
      expect(res.valid).toBe(true);
      expect(res.totalEmergencyFundRequired).toBe(4500);
      expect(res.emergencyFlightCost).toBe(0);
    });

    it('returns error for non-positive living expenses or duration', () => {
      const res = calculateNomadEmergencyFundRequirement({ monthlyLivingExpense: 0, durationMonths: 6 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Monthly living expense must be a positive number');
    });
  });

  describe('calculateDigitalNomadSubletRoi', () => {
    it('calculates sublet income, fees, net profit, and rent coverage percentage', () => {
      const res = calculateDigitalNomadSubletRoi({ homeRentUsd: 2000, subletPriceUsd: 2500, platformFeePercentage: 3, utilityBufferUsd: 100, durationMonths: 2 });
      expect(res.valid).toBe(true);
      expect(res.grossSubletIncome).toBe(5000);
      expect(res.platformFeesTotal).toBe(150);
      expect(res.netSubletIncome).toBe(4650);
      expect(res.totalRentCost).toBe(4000);
      expect(res.netProfitUsd).toBe(650);
      expect(res.rentCoveragePercentage).toBe(116);
      expect(res.isProfitable).toBe(true);
    });

    it('returns error for non-positive home rent or sublet price', () => {
      const res = calculateDigitalNomadSubletRoi({ homeRentUsd: 0 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Home rent must be a positive number');
    });
  });

  describe('calculateNomadSimDataBudget', () => {
    it('calculates daily data burn, total GB, and cost estimates', () => {
      const res = calculateNomadSimDataBudget({ durationDays: 30, workHoursPerDay: 8, videoHoursPerDay: 2, isHeavyUsage: false });
      expect(res.valid).toBe(true);
      expect(res.durationDays).toBe(30);
      expect(res.estimatedDailyGb).toBe(3.6);
      expect(res.totalGbRequired).toBe(108);
      expect(res.esimEstimatedCostUsd).toBe(486);
      expect(res.localSimEstimatedCostUsd).toBe(194.4);
      expect(res.recommendedOption).toBe('Local Physical SIM');
    });

    it('recommends eSIM for low data consumption', () => {
      const res = calculateNomadSimDataBudget({ durationDays: 5, workHoursPerDay: 2, videoHoursPerDay: 0 });
      expect(res.valid).toBe(true);
      expect(res.recommendedOption).toBe('eSIM');
    });

    it('returns error for invalid durationDays', () => {
      const res = calculateNomadSimDataBudget({ durationDays: -10 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Duration days must be a positive number');
    });
  });
});











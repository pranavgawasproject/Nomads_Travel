import { calculateNomadLivingCost, formatCurrency, calculateCurrencyExchange, calculateNomadScore, calculateTimeZoneOverlap, calculateCoworkingCostEstimate, calculateVisaStayLimit, calculateTripBudget, validateDestinationFilter, calculateEventReminderSchedule, calculateNomadTaxResidencyRisk, calculateTravelInsuranceEstimate, calculateNomadWorkationSavings, calculateNomadEmergencyFundRequirement, calculateDigitalNomadSubletRoi, calculateNomadSimDataBudget, calculateNomadCarbonOffsetEstimate, calculateNomadVisaIncomeQualification, calculateNomadSchengen90180Limit, calculateNomadColivingVsApartmentCost, calculateNomadVisaProcessingTimeEstimate, calculateNomadCommunityHubScore, calculateNomadFlightLayoverOptimization, calculateNomadHealthInsuranceCoverageScore, calculateNomadLuggageWeightAndFee, calculateNomadCoworkingPassOptimization, calculateNomadSalaryParity, calculateNomadInternetBackupRedundancyScore, calculateNomadTaxResidencyRiskScore, calculateNomadRemoteWorkStipendRoi, calculateNomadTimezoneOverlapAndConnectivity, calculateNomadCoworkingConnectivityScore, calculateNomadDestinationSafetyAndHealthcareScore, calculateNomadCommunityEventEngagementIndex, calculateNomadCoworkingPassVsWorkspaceCost, calculateNomadTravelInsuranceCoverageScore, calculateNomadWorkspaceErgonomicsIndex, calculateNomadCoworkingCommunityDensityScore, calculateNomadColivingBudgetOptimization, calculateNomadColivingWorkstationHealthScore, calculateNomadRemoteWorkstationPowerBackupScore, calculateNomadEsimRoamingDataPackageRoi, calculateNomadMultiCityItineraryBudget, calculateNomadRemoteWorkConnectivityScore, calculateNomadColivingCommunitySafetyRating, calculateNomadDestinationQualityOfLifeIndex, calculateNomadHealthcareAccessAndEvacuationIndex, calculateNomadDigitalNomadVisaEligibilityScore, calculateNomadColivingMonthlyLivingCostIndex, calculateNomadColivingSpaceReviewAuthenticityScore, calculateNomadColivingReservationDepositRefundAudit, calculateNomadTaxResidencyPhysicalPresenceAudit, calculateNomadVisaExemptTravelWindow, calculateNomadRemoteWorkTaxTieBreakerScore, calculateNomadEmergencyMedicalEvacuationCoverageScore, calculateNomadColivingSecurityAndPrivacyScore, calculateNomadTravelInsuranceAndEmergencyFund, calculateNomadColivingCommunityMatchScore, calculateNomadCoworkingPassSavingsIndex, calculateNomadCrossBorderTaxLiabilityIndex, calculateNomadCommunityEventEngagementScore } from '../utils/travelUtils.js';














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

  describe('calculateNomadCarbonOffsetEstimate', () => {
    it('calculates total CO2 emissions and offset cost correctly', () => {
      const res = calculateNomadCarbonOffsetEstimate({ flightHours: 10, busTrainHours: 5, stayDurationDays: 30, isEcoStay: false });
      expect(res.valid).toBe(true);
      expect(res.flightEmissionsKg).toBe(900);
      expect(res.transitEmissionsKg).toBe(75);
      expect(res.stayEmissionsKg).toBe(540);
      expect(res.totalKgCo2).toBe(1515);
      expect(res.totalMetricTons).toBe(1.515);
      expect(res.offsetCostUsd).toBe(22.73);
      expect(res.ecoStayDiscountApplied).toBe(false);
    });

    it('applies discount factor for eco-friendly stay', () => {
      const res = calculateNomadCarbonOffsetEstimate({ flightHours: 0, busTrainHours: 10, stayDurationDays: 30, isEcoStay: true });
      expect(res.valid).toBe(true);
      expect(res.stayEmissionsKg).toBe(351);
      expect(res.ecoStayDiscountApplied).toBe(true);
    });

    it('handles zero or invalid travel duration gracefully', () => {
      const res = calculateNomadCarbonOffsetEstimate({ flightHours: 0, busTrainHours: 0, stayDurationDays: 0 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Travel duration and hours must be positive numbers');
    });
  });

  describe('calculateNomadVisaIncomeQualification', () => {
    it('calculates visa qualification and surplus margin for qualifying income', () => {
      const res = calculateNomadVisaIncomeQualification({ monthlyIncomeUsd: 3500, targetCountry: 'Spain', dependentsCount: 1 });
      expect(res.valid).toBe(true);
      expect(res.country).toBe('Spain');
      expect(res.baseRequirementUsd).toBe(2400);
      expect(res.totalRequiredIncomeUsd).toBe(2880);
      expect(res.incomeMarginUsd).toBe(620);
      expect(res.qualifies).toBe(true);
    });

    it('identifies shortfall when income is below requirement', () => {
      const res = calculateNomadVisaIncomeQualification({ monthlyIncomeUsd: 2000, targetCountry: 'Portugal', dependentsCount: 0 });
      expect(res.valid).toBe(true);
      expect(res.country).toBe('Portugal');
      expect(res.totalRequiredIncomeUsd).toBe(3200);
      expect(res.qualifies).toBe(false);
      expect(res.incomeMarginUsd).toBe(-1200);
    });

    it('returns error for invalid income input', () => {
      const res = calculateNomadVisaIncomeQualification({ monthlyIncomeUsd: 0 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Monthly income must be a positive number');
    });
  });

  describe('calculateNomadSchengen90180Limit', () => {
    it('calculates safe remaining days within Schengen 90/180 window', () => {
      const res = calculateNomadSchengen90180Limit({ stayDaysPast180: 45, plannedStayDays: 30 });
      expect(res.valid).toBe(true);
      expect(res.remainingAllowedDays).toBe(45);
      expect(res.isOverstayRisk).toBe(false);
      expect(res.allowablePlannedDays).toBe(30);
    });

    it('identifies overstay risk when planned days exceed remaining limit', () => {
      const res = calculateNomadSchengen90180Limit({ stayDaysPast180: 70, plannedStayDays: 30 });
      expect(res.valid).toBe(true);
      expect(res.remainingAllowedDays).toBe(20);
      expect(res.isOverstayRisk).toBe(true);
      expect(res.allowablePlannedDays).toBe(20);
    });

    it('returns error for invalid stay inputs', () => {
      const res = calculateNomadSchengen90180Limit({ stayDaysPast180: -10 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Stay days in past 180 days must be a non-negative number');
    });
  });

  describe('calculateNomadColivingVsApartmentCost', () => {
    it('calculates cost breakdown and identifies coliving savings', () => {
      const res = calculateNomadColivingVsApartmentCost({
        monthlyApartmentRent: 1600,
        coworkingPassCost: 250,
        utilityCost: 150,
        setupCostOneTime: 400,
        monthlyColivingCost: 1800,
        stayDurationMonths: 3
      });
      expect(res.valid).toBe(true);
      expect(res.totalApartmentCost).toBe(6400); // (1600+250+150)*3 + 400 = 6400
      expect(res.totalColivingCost).toBe(5400);  // 1800*3 = 5400
      expect(res.netSavingsWithColiving).toBe(1000);
      expect(res.colivingCheaper).toBe(true);
    });

    it('returns error for non-positive rent or coliving parameters', () => {
      const res = calculateNomadColivingVsApartmentCost({ monthlyApartmentRent: 0 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Monthly apartment rent must be a positive number');
    });
  });

  describe('calculateNomadVisaProcessingTimeEstimate', () => {
    it('estimates standard and express processing times correctly', () => {
      const standard = calculateNomadVisaProcessingTimeEstimate({ country: 'Portugal', processingType: 'standard' });
      expect(standard.valid).toBe(true);
      expect(standard.estimatedBusinessDays).toBe(45);

      const express = calculateNomadVisaProcessingTimeEstimate({ country: 'Portugal', processingType: 'express' });
      expect(express.valid).toBe(true);
      expect(express.estimatedBusinessDays).toBe(18);
    });
  });

  describe('calculateNomadCommunityHubScore', () => {
    it('calculates hub composite score, grade, and breakdown correctly', () => {
      const hub = calculateNomadCommunityHubScore({
        internetSpeedMbps: 100,
        coworkingSpacesCount: 8,
        monthlyEventsCount: 15,
        safetyScore: 4.5,
        costOfLivingIndex: 40
      });
      expect(hub.valid).toBe(true);
      expect(hub.compositeScore).toBeGreaterThanOrEqual(8.0);
      expect(hub.grade).toBe('A+');
      expect(hub.breakdown.speedScore).toBe(10);
    });
  });

  describe('calculateNomadFlightLayoverOptimization', () => {
    it('calculates layover extra costs, friction score, and workable status correctly', () => {
      const res = calculateNomadFlightLayoverOptimization({
        layoverDurationHours: 5,
        overnightHotelRequired: false,
        transitVisaRequired: true,
        transitVisaCostUsd: 50,
        coworkingLoungeAccess: true,
        loungeFeeUsd: 40
      });
      expect(res.valid).toBe(true);
      expect(res.layoverDurationHours).toBe(5);
      expect(res.totalExtraCostUsd).toBe(90);
      expect(res.isWorkableLayover).toBe(true);
    });

    it('returns error for negative layover duration input', () => {
      const res = calculateNomadFlightLayoverOptimization({ layoverDurationHours: -2 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Layover duration must be a non-negative number');
    });
  });

  describe('calculateNomadHealthInsuranceCoverageScore', () => {
    it('calculates health insurance coverage score and risk tier correctly', () => {
      const res = calculateNomadHealthInsuranceCoverageScore({
        age: 32,
        monthlyPremiumUsd: 150,
        maxDeductibleUsd: 500,
        includesMedicalEvacuation: true,
        includesAdventureSports: true,
        hasPreExistingConditionCoverage: true
      });
      expect(res.valid).toBe(true);
      expect(res.coverageScore).toBe(100);
      expect(res.riskTier).toBe('EXCELLENT');
      expect(res.isEvacuationCovered).toBe(true);
    });

    it('returns error for non-positive monthly premium', () => {
      const res = calculateNomadHealthInsuranceCoverageScore({ monthlyPremiumUsd: 0 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Monthly premium must be a positive number');
    });
  });

  describe('calculateNomadLuggageWeightAndFee', () => {
    it('calculates luggage total weight and handles fee-free baggage correctly', () => {
      const res = calculateNomadLuggageWeightAndFee({
        carryOnBaggageKg: 7,
        checkedBaggageKg: 20,
        airlineLimitKg: 23
      });
      expect(res.valid).toBe(true);
      expect(res.totalWeightKg).toBe(27);
      expect(res.excessKg).toBe(0);
      expect(res.excessFeeUsd).toBe(0);
      expect(res.isOverweight).toBe(false);
    });

    it('calculates excess baggage fees accurately when weight exceeds limit', () => {
      const res = calculateNomadLuggageWeightAndFee({
        carryOnBaggageKg: 8,
        checkedBaggageKg: 27,
        airlineLimitKg: 23,
        excessFeePerKgUsd: 15
      });
      expect(res.valid).toBe(true);
      expect(res.excessKg).toBe(4);
      expect(res.excessFeeUsd).toBe(60);
      expect(res.isOverweight).toBe(true);
    });

    it('returns error for invalid negative baggage weights', () => {
      const res = calculateNomadLuggageWeightAndFee({ checkedBaggageKg: -5 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Checked baggage weight must be a non-negative number');
    });
  });

  describe('calculateNomadCoworkingPassOptimization', () => {
    it('calculates monthly vs day pass optimization correctly', () => {
      const res = calculateNomadCoworkingPassOptimization({
        monthlyPassCostUsd: 250,
        dayPassCostUsd: 25,
        workingDaysPerMonth: 15
      });
      expect(res.valid).toBe(true);
      expect(res.adjustedMonthlyCost).toBe(250);
      expect(res.totalDayPassCost).toBe(375);
      expect(res.preferMonthly).toBe(true);
      expect(res.costDifference).toBe(125);
    });

    it('recommends day passes when working days are few', () => {
      const res = calculateNomadCoworkingPassOptimization({
        monthlyPassCostUsd: 300,
        dayPassCostUsd: 25,
        workingDaysPerMonth: 5,
        requires247Access: false
      });
      expect(res.valid).toBe(true);
      expect(res.totalDayPassCost).toBe(125);
      expect(res.preferMonthly).toBe(false);
      expect(res.recommendation).toContain('Day passes save $175.00');
    });

    it('returns error for invalid non-positive cost parameters', () => {
      const res = calculateNomadCoworkingPassOptimization({ monthlyPassCostUsd: 0 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Monthly pass cost must be a positive number');
    });
  });

  describe('calculateNomadSalaryParity', () => {
    it('calculates salary parity and purchasing power gain correctly', () => {
      const res = calculateNomadSalaryParity({
        homeAnnualSalaryUsd: 100000,
        homeCostIndex: 100,
        targetCostIndex: 60,
        hasLocalTaxExemption: true
      });
      expect(res.valid).toBe(true);
      expect(res.paritySalaryUsd).toBe(60000);
      expect(res.purchasingPowerGainPercent).toBe(91.7);
      expect(res.recommendation).toContain('yields a 91.7% gain');
    });

    it('returns error for invalid salary parameters', () => {
      const res = calculateNomadSalaryParity({ homeAnnualSalaryUsd: -1000 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Home annual salary must be a positive number');
    });
  });

  describe('calculateNomadInternetBackupRedundancyScore', () => {
    it('calculates internet backup redundancy score and risk tier accurately', () => {
      const res = calculateNomadInternetBackupRedundancyScore({
        primarySpeedMbps: 100,
        backupSpeedMbps: 50,
        hasMobileHotspot: true,
        hasUPSPowerBackup: true
      });
      expect(res.valid).toBe(true);
      expect(res.redundancyScore).toBe(100);
      expect(res.riskTier).toBe('Low Risk');
      expect(res.recommendation).toContain('Dual connections with power & mobile backup');
    });

    it('returns high risk tier when backup and UPS are missing', () => {
      const res = calculateNomadInternetBackupRedundancyScore({
        primarySpeedMbps: 30,
        backupSpeedMbps: 0,
        hasMobileHotspot: false,
        hasUPSPowerBackup: false
      });
      expect(res.valid).toBe(true);
      expect(res.redundancyScore).toBe(15);
      expect(res.riskTier).toBe('High Risk');
      expect(res.recommendation).toContain('High outage risk');
    });

    it('returns error for invalid negative primary speed input', () => {
      const res = calculateNomadInternetBackupRedundancyScore({ primarySpeedMbps: -20 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Primary internet speed must be a non-negative number');
    });
  });

  describe('calculateNomadTaxResidencyRiskScore', () => {
    it('calculates tax residency risk score and remaining days correctly', () => {
      const res = calculateNomadTaxResidencyRiskScore({
        daysInCountry: 140,
        taxResidencyThresholdDays: 183,
        hasPermanentHome: true,
        hasLocalBankOrBusiness: false
      });
      expect(res.valid).toBe(true);
      expect(res.daysInCountry).toBe(140);
      expect(res.taxResidencyThresholdDays).toBe(183);
      expect(res.remainingDaysBeforeThreshold).toBe(43);
      expect(res.totalRiskScore).toBe(65);
      expect(res.riskTier).toBe('MODERATE');
      expect(res.isResidencyTriggered).toBe(false);
    });

    it('triggers HIGH risk tier when residency threshold is exceeded', () => {
      const res = calculateNomadTaxResidencyRiskScore({
        daysInCountry: 190,
        taxResidencyThresholdDays: 183,
        hasPermanentHome: true,
        hasLocalBankOrBusiness: true
      });
      expect(res.valid).toBe(true);
      expect(res.isResidencyTriggered).toBe(true);
      expect(res.riskTier).toBe('HIGH');
      expect(res.totalRiskScore).toBe(100);
    });

    it('returns error for invalid negative days input', () => {
      const res = calculateNomadTaxResidencyRiskScore({ daysInCountry: -10 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Days in country must be a non-negative number');
    });
  });

  describe('calculateNomadRemoteWorkStipendRoi', () => {
    it('calculates stipend coverage and net surplus accurately', () => {
      const res = calculateNomadRemoteWorkStipendRoi({
        monthlyStipendUsd: 500,
        monthlyCoworkingExpenseUsd: 300,
        monthlyEquipmentExpenseUsd: 100,
        durationMonths: 12
      });
      expect(res.valid).toBe(true);
      expect(res.totalStipendProvided).toBe(6000);
      expect(res.totalExpensesIncurred).toBe(4800);
      expect(res.netSurplusUsd).toBe(1200);
      expect(res.coveragePercentage).toBe(125);
      expect(res.isFullyCovered).toBe(true);
      expect(res.recommendation).toContain('Stipend fully covers expenses with a $1200.00 surplus');
    });

    it('identifies shortfall when expenses exceed stipend', () => {
      const res = calculateNomadRemoteWorkStipendRoi({
        monthlyStipendUsd: 300,
        monthlyCoworkingExpenseUsd: 350,
        monthlyEquipmentExpenseUsd: 100,
        durationMonths: 6
      });
      expect(res.valid).toBe(true);
      expect(res.isFullyCovered).toBe(false);
      expect(res.netSurplusUsd).toBe(-900);
      expect(res.coveragePercentage).toBe(67);
      expect(res.recommendation).toContain('Expenses exceed stipend by $900.00');
    });

    it('returns error for invalid non-positive stipend or duration inputs', () => {
      const res = calculateNomadRemoteWorkStipendRoi({ monthlyStipendUsd: 0 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Monthly stipend must be a positive number');
    });
  });

  describe('calculateNomadTimezoneOverlapAndConnectivity', () => {
    it('calculates team overlap hours correctly for given timezones', () => {
      const res = calculateNomadTimezoneOverlapAndConnectivity({
        teamTimezoneOffsetHours: -5,
        localTimezoneOffsetHours: 1,
        workStartHourLocal: 9,
        workEndHourLocal: 17,
        minOverlapHoursRequired: 2
      });
      expect(res.valid).toBe(true);
      expect(res.overlapHours).toBe(2);
      expect(res.meetsRequirement).toBe(true);
      expect(res.recommendation).toContain('Sufficient team overlap of 2 hours/day');
    });

    it('identifies when overlap hours fall below minimum requirement', () => {
      const res = calculateNomadTimezoneOverlapAndConnectivity({
        teamTimezoneOffsetHours: -8,
        localTimezoneOffsetHours: 8,
        minOverlapHoursRequired: 4
      });
      expect(res.valid).toBe(true);
      expect(res.meetsRequirement).toBe(false);
      expect(res.recommendation).toContain('Only 0 hours of overlap');
    });

    it('returns error for invalid timezone offset parameters', () => {
      const res = calculateNomadTimezoneOverlapAndConnectivity({ teamTimezoneOffsetHours: 20 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Team timezone offset must be between -12 and +14 hours');
    });
  });

  describe('calculateNomadCoworkingConnectivityScore', () => {
    it('calculates high suitability score for fast internet and full amenities', () => {
      const res = calculateNomadCoworkingConnectivityScore({
        internetSpeedMbps: 200,
        deskErgonomicsRating: 5,
        backupPowerAvailable: true,
        quietCallBoothsAvailable: true,
        monthlyPassUsd: 200
      });
      expect(res.valid).toBe(true);
      expect(res.coworkingScore).toBe(100);
      expect(res.suitabilityTier).toBe('HIGHLY_RECOMMENDED');
    });

    it('returns error for negative internet speed', () => {
      const res = calculateNomadCoworkingConnectivityScore({ internetSpeedMbps: -50 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Internet speed must be a non-negative number');
    });
  });

  describe('calculateNomadDestinationSafetyAndHealthcareScore', () => {
    it('calculates safety and healthcare composite score correctly', () => {
      const res = calculateNomadDestinationSafetyAndHealthcareScore({
        safetyScore: 4.5,
        healthcareQualityRating: 4.5,
        hospitalAccessMinutes: 10,
        emergencyServicesAvailable: true,
        speaksEnglishStaff: true
      });
      expect(res.valid).toBe(true);
      expect(res.compositeSafetyScore).toBe(98);
      expect(res.safetyTier).toBe('HIGH_SAFETY');
    });

    it('handles low safety ratings and returns warning recommendation', () => {
      const res = calculateNomadDestinationSafetyAndHealthcareScore({
        safetyScore: 2.0,
        healthcareQualityRating: 2.0,
        hospitalAccessMinutes: 60,
        emergencyServicesAvailable: false,
        speaksEnglishStaff: false
      });
      expect(res.valid).toBe(true);
      expect(res.safetyTier).toBe('HIGH_RISK_EVALUATION_NEEDED');
    });

    it('returns error for invalid safety score ratings', () => {
      const res = calculateNomadDestinationSafetyAndHealthcareScore({ safetyScore: 6.0 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Safety and healthcare ratings must be numbers between 1 and 5');
    });
  });

  describe('calculateNomadCommunityEventEngagementIndex', () => {
    it('calculates vibrant community score correctly', () => {
      const vibrant = calculateNomadCommunityEventEngagementIndex({
        upcomingEventsCount: 8,
        activeMeetupGroups: 4,
        monthlyActiveNomads: 200,
        meetupHostRating: 4.8
      });
      expect(vibrant.valid).toBe(true);
      expect(vibrant.engagementScore).toBeGreaterThanOrEqual(80);
      expect(vibrant.communityTier).toBe('VIBRANT_COMMUNITY');
    });

    it('identifies quiet spot when event density is minimal', () => {
      const quiet = calculateNomadCommunityEventEngagementIndex({
        upcomingEventsCount: 1,
        activeMeetupGroups: 0,
        monthlyActiveNomads: 15,
        meetupHostRating: 3.5
      });
      expect(quiet.valid).toBe(true);
      expect(quiet.communityTier).toBe('QUIET_SPOT');
    });

    it('returns error for invalid negative counts', () => {
      const invalid = calculateNomadCommunityEventEngagementIndex({ upcomingEventsCount: -5 });
      expect(invalid.valid).toBe(false);
    });
  });

  describe('calculateNomadCoworkingPassVsWorkspaceCost', () => {
    it('calculates hot desk vs private office cost breakdown correctly', () => {
      const desk = calculateNomadCoworkingPassVsWorkspaceCost({
        monthlyDeskPriceUsd: 200,
        privateOfficePriceUsd: 500,
        stayMonths: 4,
        needsPrivateOffice: false
      });
      expect(desk.valid).toBe(true);
      expect(desk.totalDeskCost).toBe(800);
      expect(desk.totalOfficeCost).toBe(2000);
      expect(desk.chosenCost).toBe(800);
      expect(desk.priceDifference).toBe(1200);
      expect(desk.recommendation).toContain('Hot desk chosen ($800.00 total over 4 months)');
    });

    it('calculates chosen cost when private office is selected', () => {
      const office = calculateNomadCoworkingPassVsWorkspaceCost({
        monthlyDeskPriceUsd: 250,
        privateOfficePriceUsd: 600,
        stayMonths: 2,
        needsPrivateOffice: true
      });
      expect(office.valid).toBe(true);
      expect(office.chosenCost).toBe(1200);
      expect(office.recommendation).toContain('Private office chosen ($1200.00 total over 2 months)');
    });

    it('returns error for non-positive desk price or stay duration', () => {
      const invalid = calculateNomadCoworkingPassVsWorkspaceCost({ monthlyDeskPriceUsd: 0 });
      expect(invalid.valid).toBe(false);
      expect(invalid.error).toBe('Monthly desk price must be a positive number');
    });
  });

  describe('calculateNomadTravelInsuranceCoverageScore', () => {
    it('calculates coverage score and adequacy tier accurately', () => {
      const res = calculateNomadTravelInsuranceCoverageScore({
        monthlyPremiumUsd: 50,
        medicalCoverageCapUsd: 250000,
        emergencyEvacuationCapUsd: 500000,
        includesAdventureSports: true,
        destinationRiskTier: 'LOW'
      } );
      expect(res.valid).toBe(true);
      expect(res.coverageScore).toBe(100);
      expect(res.isAdequate).toBe(true);
      expect(res.recommendation).toContain('Insurance policy provides robust coverage');
    });

    it('flags sub-optimal coverage for high risk destinations', () => {
      const res = calculateNomadTravelInsuranceCoverageScore({
        monthlyPremiumUsd: 40,
        medicalCoverageCapUsd: 50000,
        emergencyEvacuationCapUsd: 100000,
        includesAdventureSports: false,
        destinationRiskTier: 'HIGH'
      });
      expect(res.valid).toBe(true);
      expect(res.isAdequate).toBe(false);
      expect(res.recommendation).toContain('sub-optimal for HIGH risk destination');
    });
  });

  describe('calculateNomadWorkspaceErgonomicsIndex', () => {
    it('calculates excellent ergonomics score for optimal setup', () => {
      const res = calculateNomadWorkspaceErgonomicsIndex({
        dualMonitorAvailable: true,
        standingDeskAvailable: true,
        chairErgonomicRating: 5,
        naturalLightRating: 5,
        noiseDecibels: 35
      });
      expect(res.valid).toBe(true);
      expect(res.ergonomicsScore).toBe(100);
      expect(res.tier).toBe('EXCELLENT');
      expect(res.recommendation).toContain('highly ergonomic');
    });

    it('calculates poor ergonomics score for noisy sub-optimal setup', () => {
      const res = calculateNomadWorkspaceErgonomicsIndex({
        dualMonitorAvailable: false,
        standingDeskAvailable: false,
        chairErgonomicRating: 1,
        naturalLightRating: 1,
        noiseDecibels: 80
      });
      expect(res.valid).toBe(true);
      expect(res.tier).toBe('POOR');
      expect(res.recommendation).toContain('poor');
    });
  });

  describe('calculateNomadCoworkingCommunityDensityScore', () => {
    it('calculates high density score correctly for dense coworking hub', () => {
      const res = calculateNomadCoworkingCommunityDensityScore({
        coworkingCount: 25,
        totalNomadPopulation: 500,
        cityAreaSqKm: 50
      });
      expect(res.valid).toBe(true);
      expect(res.coworkingPer100Nomads).toBe(5);
      expect(res.densityTier).toBe('HIGH_DENSITY');
      expect(res.recommendation).toContain('Thriving digital nomad hub');
    });

    it('identifies emerging destination with low density', () => {
      const res = calculateNomadCoworkingCommunityDensityScore({
        coworkingCount: 2,
        totalNomadPopulation: 1000,
        cityAreaSqKm: 200
      });
      expect(res.valid).toBe(true);
      expect(res.densityTier).toBe('LOW_DENSITY');
      expect(res.recommendation).toContain('Emerging destination');
    });

    it('returns error for invalid negative counts or zero population', () => {
      const res = calculateNomadCoworkingCommunityDensityScore({ coworkingCount: -1 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Coworking space count must be a non-negative number');
    });
  });

  describe('calculateNomadColivingBudgetOptimization', () => {
    it('calculates prime value coliving budget optimization correctly', () => {
      const res = calculateNomadColivingBudgetOptimization({
        baseMonthlyColivingCost: 900,
        durationDays: 30,
        includeCoworkingPass: true,
        communityRating: 4.8,
        highSpeedWifiMbps: 200
      });
      expect(res.valid).toBe(true);
      expect(res.dailyEffectiveCost).toBe(30);
      expect(res.optimizationTier).toBe('PRIME_VALUE_COLIVING');
      expect(res.recommendation).toContain('High-value coliving setup');
    });

    it('returns error for invalid cost input', () => {
      const res = calculateNomadColivingBudgetOptimization({ baseMonthlyColivingCost: -500 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Base monthly coliving cost must be a positive number');
    });
  });

  describe('calculateNomadColivingWorkstationHealthScore', () => {
    it('calculates excellent workstation health score for high-speed Wi-Fi and ergonomic setup', () => {
      const res = calculateNomadColivingWorkstationHealthScore({
        wifiSpeedMbps: 200,
        chairErgonomicsRating: 5,
        quietEnvironment: true,
        backupPowerAvailable: true,
        monitorAvailable: true
      });
      expect(res.valid).toBe(true);
      expect(res.workstationHealthScore).toBe(100);
      expect(res.isWorkstationHealthy).toBe(true);
      expect(res.healthTier).toBe('EXCELLENT_WORKSTATION');
    });

    it('identifies sub-optimal workstation for low Wi-Fi and poor chair', () => {
      const res = calculateNomadColivingWorkstationHealthScore({
        wifiSpeedMbps: 20,
        chairErgonomicsRating: 1,
        quietEnvironment: false,
        backupPowerAvailable: false
      });
      expect(res.valid).toBe(true);
      expect(res.isWorkstationHealthy).toBe(false);
      expect(res.healthTier).toBe('SUB_OPTIMAL_WORKSTATION');
    });
  });

  describe('calculateNomadRemoteWorkstationPowerBackupScore', () => {
    it('calculates excellent power stability for high rating and full backup', () => {
      const res = calculateNomadRemoteWorkstationPowerBackupScore({
        gridReliabilityRating: 5,
        outageFrequencyMonthly: 0,
        hasGeneratorOrUps: true,
        laptopBatteryHours: 8,
        powerStationCapacityWattHours: 300
      });
      expect(res.valid).toBe(true);
      expect(res.powerScore).toBe(100);
      expect(res.riskTier).toBe('EXCELLENT_POWER_STABILITY');
      expect(res.totalBackupHoursAvailable).toBe(14.7);
    });

    it('identifies high outage risk for low grid rating and no generator', () => {
      const res = calculateNomadRemoteWorkstationPowerBackupScore({
        gridReliabilityRating: 1,
        outageFrequencyMonthly: 8,
        hasGeneratorOrUps: false,
        laptopBatteryHours: 3,
        powerStationCapacityWattHours: 0
      });
      expect(res.valid).toBe(true);
      expect(res.powerScore).toBe(0);
      expect(res.riskTier).toBe('HIGH_OUTAGE_RISK');
    });
  });

  describe('calculateNomadEsimRoamingDataPackageRoi', () => {
    it('calculates eSIM vs local SIM cost breakdown and roi correctly', () => {
      const res = calculateNomadEsimRoamingDataPackageRoi({
        durationDays: 30,
        estimatedGbNeeded: 10,
        esimPackagePriceUsd: 25.0,
        localSimPriceUsd: 15.0
      });
      expect(res.valid).toBe(true);
      expect(res.esimCostPerGb).toBe(2.5);
      expect(res.localSimCostPerGb).toBe(1.5);
      expect(res.priceDifferenceUsd).toBe(10.0);
      expect(res.isEsimCostEffective).toBe(true);
      expect(res.recommendation).toContain('eSIM recommended');
    });

    it('returns error for invalid duration input', () => {
      const res = calculateNomadEsimRoamingDataPackageRoi({ durationDays: -5 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Duration days must be a positive integer');
    });
  });

  describe('calculateNomadMultiCityItineraryBudget', () => {
    it('calculates multi-city itinerary budget breakdown and metrics correctly', () => {
      const cities = [
        { city: 'Lisbon', durationDays: 30, estimatedMonthlyCost: 2000, flightToNextCost: 300 },
        { city: 'Bali', durationDays: 60, estimatedMonthlyCost: 1200, flightToNextCost: 500 },
        { city: 'Bansko', durationDays: 30, estimatedMonthlyCost: 1000, flightToNextCost: 0 }
      ];
      const res = calculateNomadMultiCityItineraryBudget({ cities, contingencyPercentage: 10 });
      expect(res.valid).toBe(true);
      expect(res.totalCities).toBe(3);
      expect(res.totalDurationDays).toBe(120);
      expect(res.totalAccommodationAndLivingCost).toBe(5400);
      expect(res.totalTransitFlightCost).toBe(800);
      expect(res.contingencyAmount).toBe(620);
      expect(res.grandTotalCost).toBe(6820);
      expect(res.averageDailyExpense).toBe(56.83);
      expect(res.mostExpensiveCity).toBe('Lisbon');
      expect(res.mostAffordableCity).toBe('Bansko');
    });

    it('throws error for empty or invalid city list', () => {
      expect(() => calculateNomadMultiCityItineraryBudget({ cities: [] }))
        .toThrow('Cities array must contain at least one destination.');
      expect(() => calculateNomadMultiCityItineraryBudget({ cities: [{ city: 'Invalid', durationDays: -10, estimatedMonthlyCost: 1000 }] }))
        .toThrow('Invalid city parameters');
    });
  });

  describe('calculateNomadRemoteWorkConnectivityScore', () => {
    it('calculates optimal nomad hub connectivity score for high-speed Wi-Fi and low ping', () => {
      const res = calculateNomadRemoteWorkConnectivityScore({
        wifiDownloadMbps: 150,
        wifiUploadMbps: 50,
        pingLatencyMs: 20,
        coworkingSpacesCount: 10,
        powerOutageFrequencyMonthly: 0,
        timeZoneOverlapHoursWithHQ: 8
      });
      expect(res.valid).toBe(true);
      expect(res.connectivityScore).toBe(100);
      expect(res.connectivityTier).toBe('OPTIMAL_NOMAD_HUB');
    });

    it('identifies risky infrastructure for slow internet and frequent power outages', () => {
      const res = calculateNomadRemoteWorkConnectivityScore({
        wifiDownloadMbps: 10,
        wifiUploadMbps: 2,
        pingLatencyMs: 200,
        coworkingSpacesCount: 0,
        powerOutageFrequencyMonthly: 5,
        timeZoneOverlapHoursWithHQ: 2
      });
      expect(res.valid).toBe(true);
      expect(res.connectivityScore).toBe(0);
      expect(res.connectivityTier).toBe('RISKY_INFRASTRUCTURE');
    });

    it('returns error for negative internet speed inputs', () => {
      const res = calculateNomadRemoteWorkConnectivityScore({ wifiDownloadMbps: -50 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Speed and ping parameters must be non-negative numbers');
    });
  });

  describe('calculateNomadColivingCommunitySafetyRating', () => {
    it('calculates highly safe coliving score for secure location and verified community', () => {
      const res = calculateNomadColivingCommunitySafetyRating({
        verifiedCommunityMembersCount: 25,
        hasKeycardAccess: true,
        has24SevenSecurity: true,
        verifiedReviewsScore: 4.8,
        neighborhoodSafetyIndex: 90
      });
      expect(res.valid).toBe(true);
      expect(res.safetyScore).toBe(100);
      expect(res.safetyTier).toBe('HIGHLY_SAFE_COLIVING');
    });

    it('identifies elevated safety risk when security features and review scores are low', () => {
      const res = calculateNomadColivingCommunitySafetyRating({
        verifiedCommunityMembersCount: 2,
        hasKeycardAccess: false,
        has24SevenSecurity: false,
        verifiedReviewsScore: 2.0,
        neighborhoodSafetyIndex: 40
      });
      expect(res.valid).toBe(true);
      expect(res.safetyTier).toBe('ELEVATED_SAFETY_RISK');
    });

    it('returns error for out-of-range verified review scores', () => {
      const res = calculateNomadColivingCommunitySafetyRating({ verifiedReviewsScore: 6.0 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Verified reviews score must be a number between 1 and 5');
    });
  });

  describe('calculateNomadDestinationQualityOfLifeIndex', () => {
    it('calculates prime quality of life index for top location', () => {
      const res = calculateNomadDestinationQualityOfLifeIndex({
        internetSpeedMbps: 200,
        safetyRating: 4.8,
        healthcareRating: 4.5,
        monthlyCostUsd: 1600,
        communityHubScore: 90
      });
      expect(res.valid).toBe(true);
      expect(res.qolTier).toBe('PRIME_NOMAD_DESTINATION');
      expect(res.compositeQualityOfLifeScore).toBeGreaterThanOrEqual(80);
    });

    it('returns error for invalid internet speed', () => {
      const res = calculateNomadDestinationQualityOfLifeIndex({ internetSpeedMbps: -10 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Internet speed must be a non-negative number');
    });
  });

  describe('calculateNomadHealthcareAccessAndEvacuationIndex', () => {
    it('calculates healthcare access and evacuation index for high quality medical hub', () => {
      const res = calculateNomadHealthcareAccessAndEvacuationIndex({
        hospitalDensityPer100k: 10,
        englishDoctorRatio: 0.9,
        evacuationInsuranceCovered: true,
        emergencyResponseTimeMins: 8
      });
      expect(res.valid).toBe(true);
      expect(res.medicalAccessScore).toBe(97);
      expect(res.medicalTier).toBe('PREMIUM_MEDICAL_ACCESS');
      expect(res.recommendation).toContain('Top-tier medical infrastructure');
    });

    it('returns error for invalid negative hospital density', () => {
      const res = calculateNomadHealthcareAccessAndEvacuationIndex({ hospitalDensityPer100k: -5 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Hospital density per 100k must be a non-negative number');
    });
  });

  describe('calculateNomadDigitalNomadVisaEligibilityScore', () => {
    it('calculates high eligibility score for qualifying nomad profile', () => {
      const res = calculateNomadDigitalNomadVisaEligibilityScore({
        monthlyIncomeUsd: 5000,
        minRequiredIncomeUsd: 2500,
        bankSavingsBalanceUsd: 12000,
        hasRemoteProof: true,
        hasHealthInsurance: true
      });
      expect(res.valid).toBe(true);
      expect(res.eligibilityTier).toBe('QUALIFIED_FOR_VISA');
      expect(res.eligibilityScore).toBe(100);
      expect(res.incomeCoverageRatio).toBe(2);
      expect(res.recommendation).toContain('Strong visa application profile');
    });

    it('identifies ineligible profile when income is below threshold', () => {
      const res = calculateNomadDigitalNomadVisaEligibilityScore({
        monthlyIncomeUsd: 1500,
        minRequiredIncomeUsd: 2500,
        hasRemoteProof: false
      });
      expect(res.valid).toBe(true);
      expect(res.eligibilityTier).toBe('INELIGIBLE_FOR_VISA');
      expect(res.recommendation).toContain('Ineligible for digital nomad visa');
    });

    it('returns error for invalid negative income', () => {
      const res = calculateNomadDigitalNomadVisaEligibilityScore({ monthlyIncomeUsd: -100 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Monthly income must be a non-negative number');
    });
  });

  describe('calculateNomadColivingMonthlyLivingCostIndex', () => {
    it('calculates monthly living cost breakdown and upfront capital required correctly', () => {
      const res = calculateNomadColivingMonthlyLivingCostIndex({
        monthlyRentUsd: 1200,
        coworkingPassUsd: 200,
        estimatedDailyFoodUsd: 25,
        transitPassUsd: 50,
        durationMonths: 3,
        securityDepositMonths: 1
      });
      expect(res.valid).toBe(true);
      expect(res.monthlyRentUsd).toBe(1200);
      expect(res.coworkingPassUsd).toBe(200);
      expect(res.monthlyFoodEstimateUsd).toBe(750);
      expect(res.transitPassUsd).toBe(50);
      expect(res.totalMonthlyLivingCostUsd).toBe(2200);
      expect(res.totalStayCostUsd).toBe(6600);
      expect(res.depositAmountUsd).toBe(1200);
      expect(res.upfrontCapitalRequiredUsd).toBe(2650);
      expect(res.dailyBurnRateUsd).toBe(73.33);
      expect(res.hubCostTier).toBe('MODERATE_HUB');
    });

    it('returns error for non-positive monthly rent or duration months', () => {
      const invalidRent = calculateNomadColivingMonthlyLivingCostIndex({ monthlyRentUsd: 0 });
      expect(invalidRent.valid).toBe(false);
      expect(invalidRent.error).toBe('Monthly rent must be a positive number');

      const invalidDuration = calculateNomadColivingMonthlyLivingCostIndex({ durationMonths: -1 });
      expect(invalidDuration.valid).toBe(false);
      expect(invalidDuration.error).toBe('Duration months must be a positive integer');
    });
  });

  describe('calculateNomadColivingSpaceReviewAuthenticityScore', () => {
    it('calculates verified high authenticity for stay-verified reviews', () => {
      const res = calculateNomadColivingSpaceReviewAuthenticityScore({
        verifiedStayReviewsCount: 20,
        unverifiedReviewsCount: 2,
        averageRating: 4.6,
        ratingStandardDeviation: 0.5,
        accountAgeDaysAverage: 200
      });
      expect(res.valid).toBe(true);
      expect(res.totalReviews).toBe(22);
      expect(res.verifiedRatio).toBe(0.91);
      expect(res.trustTier).toBe('VERIFIED_HIGH_AUTHENTICITY');
      expect(res.recommendation).toContain('High review authenticity');
    });

    it('flags suspicious review pattern when unverified reviews dominate', () => {
      const res = calculateNomadColivingSpaceReviewAuthenticityScore({
        verifiedStayReviewsCount: 2,
        unverifiedReviewsCount: 20,
        averageRating: 4.9,
        accountAgeDaysAverage: 15
      });
      expect(res.valid).toBe(true);
      expect(res.trustTier).toBe('SUSPICIOUS_REVIEW_PATTERN');
    });

    it('returns error for zero total reviews or negative counts', () => {
      const invalid = calculateNomadColivingSpaceReviewAuthenticityScore({ verifiedStayReviewsCount: 0, unverifiedReviewsCount: 0 });
      expect(invalid.valid).toBe(false);
      expect(invalid.error).toBe('Total reviews count cannot be zero');
    });
  });

  describe('calculateNomadColivingReservationDepositRefundAudit', () => {
    it('calculates full deposit refund when notice requirement is met', () => {
      const res = calculateNomadColivingReservationDepositRefundAudit({
        securityDepositUsd: 600,
        daysNoticeGivenBeforeCheckin: 30,
        requiredNoticeDaysForFullRefund: 30,
        damageOrCleaningDeductionUsd: 0
      });
      expect(res.valid).toBe(true);
      expect(res.netRefundUsd).toBe(600);
      expect(res.refundPercentage).toBe(100);
      expect(res.meetsFullNotice).toBe(true);
    });

    it('calculates pro-rated deduction when notice is shorter than required', () => {
      const res = calculateNomadColivingReservationDepositRefundAudit({
        securityDepositUsd: 500,
        daysNoticeGivenBeforeCheckin: 15,
        requiredNoticeDaysForFullRefund: 30,
        cancellationFeePercent: 20
      });
      expect(res.valid).toBe(true);
      expect(res.noticePenaltyUsd).toBe(50);
      expect(res.netRefundUsd).toBe(450);
    });

    it('returns error for invalid non-positive deposit or negative notice days', () => {
      const inv1 = calculateNomadColivingReservationDepositRefundAudit({ securityDepositUsd: -100 });
      expect(inv1.valid).toBe(false);
      expect(inv1.error).toBe('Security deposit must be a positive number');

      const inv2 = calculateNomadColivingReservationDepositRefundAudit({ daysNoticeGivenBeforeCheckin: -5 });
      expect(inv2.valid).toBe(false);
      expect(inv2.error).toBe('Days notice given must be a non-negative number');
    });
  });

  describe('calculateNomadTaxResidencyPhysicalPresenceAudit', () => {
    it('calculates physical presence audit and tax residency trigger when threshold is exceeded', () => {
      const res = calculateNomadTaxResidencyPhysicalPresenceAudit({
        daysInCountry: 190,
        taxThresholdDays: 183,
        isSchengenZone: true,
        schengenDays180Window: 85
      });
      expect(res.valid).toBe(true);
      expect(res.isTaxResidencyTriggered).toBe(true);
      expect(res.taxRiskTier).toBe('TAX_RESIDENCY_TRIGGERED');
      expect(res.daysRemainingUntilTaxResidency).toBe(0);
      expect(res.schengenStatus.isApplicable).toBe(true);
      expect(res.schengenStatus.remainingSchengenDays).toBe(5);
    });

    it('identifies approaching tax residency risk tier', () => {
      const res = calculateNomadTaxResidencyPhysicalPresenceAudit({
        daysInCountry: 160,
        taxThresholdDays: 183
      });
      expect(res.valid).toBe(true);
      expect(res.isTaxResidencyTriggered).toBe(false);
      expect(res.taxRiskTier).toBe('APPROACHING_TAX_RESIDENCY');
      expect(res.daysRemainingUntilTaxResidency).toBe(23);
    });

    it('returns error for invalid negative days in country input', () => {
      const res = calculateNomadTaxResidencyPhysicalPresenceAudit({ daysInCountry: -10 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Days in country must be a non-negative number');
    });
  });

  describe('calculateNomadVisaExemptTravelWindow', () => {
    it('calculates compliant visa-exempt travel window', () => {
      const res = calculateNomadVisaExemptTravelWindow({
        allowedDaysInWindow: 90,
        rollingWindowDays: 180,
        daysUsedInCurrentWindow: 30,
        plannedStayDays: 45
      });
      expect(res.valid).toBe(true);
      expect(res.daysRemaining).toBe(60);
      expect(res.isPlannedStayCompliant).toBe(true);
      expect(res.complianceStatus).toBe('FULL_VISA_EXEMPT_COMPLIANT');
    });

    it('returns error for non-positive allowed days', () => {
      const res = calculateNomadVisaExemptTravelWindow({ allowedDaysInWindow: 0 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Allowed days in window must be a positive integer');
    });
  });

  describe('calculateNomadRemoteWorkTaxTieBreakerScore', () => {
    it('calculates home country tax residency under OECD tie-breaker criteria', () => {
      const res = calculateNomadRemoteWorkTaxTieBreakerScore({
        hasPermanentHomeHomeCountry: true,
        hasPermanentHomeHostCountry: false,
        familyAndFinancialCenter: 'home',
        daysInHostCountryAnnual: 120,
        daysInHomeCountryAnnual: 245
      });
      expect(res.valid).toBe(true);
      expect(res.primaryTaxResidency).toBe('HOME_COUNTRY');
      expect(res.taxTreatyTier).toBe('SAFE_SINGLE_TAX_RESIDENCY');
      expect(res.tieBreakerScoreHome).toBeGreaterThan(res.tieBreakerScoreHost + 15);
    });

    it('returns error for negative days input', () => {
      const res = calculateNomadRemoteWorkTaxTieBreakerScore({ daysInHostCountryAnnual: -10 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Days in host country must be a non-negative number');
    });
  });

  describe('calculateNomadEmergencyMedicalEvacuationCoverageScore', () => {
    it('calculates robust medical evacuation coverage score for high-tier limits', () => {
      const res = calculateNomadEmergencyMedicalEvacuationCoverageScore({
        medicalEvacuationLimitUsd: 300000,
        inpatientMedicalLimitUsd: 500000,
        deductibleUsd: 100,
        includesAdventureSports: true,
        isPreExistingConditionsCovered: true
      });
      expect(res.valid).toBe(true);
      expect(res.evacuationScore).toBe(100);
      expect(res.riskLevel).toBe('LOW_RISK');
    });

    it('returns error for invalid non-positive evacuation limit', () => {
      const res = calculateNomadEmergencyMedicalEvacuationCoverageScore({ medicalEvacuationLimitUsd: 0 });
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Medical evacuation limit must be a positive number');
    });
  });

  describe('calculateNomadColivingSecurityAndPrivacyScore', () => {
    it('calculates premium coliving security score correctly', () => {
      const res = calculateNomadColivingSecurityAndPrivacyScore({
        hasSmartLockKeylessEntry: true,
        has247CctvSecurity: true,
        privateRoomLockLevel: 'digital_pin',
        wifiEncryptedWpa3: true,
        soundproofDbRating: 48
      });
      expect(res.valid).toBe(true);
      expect(res.securityScore).toBe(100);
      expect(res.tier).toBe('PREMIUM_SECURE_COLIVING');
    });

    it('identifies elevated security risk when key lock and unencrypted wifi are present', () => {
      const res = calculateNomadColivingSecurityAndPrivacyScore({
        hasSmartLockKeylessEntry: false,
        has247CctvSecurity: false,
        privateRoomLockLevel: 'standard_key',
        wifiEncryptedWpa3: false,
        soundproofDbRating: 30
      });
      expect(res.valid).toBe(true);
      expect(res.securityScore).toBe(15);
      expect(res.tier).toBe('ELEVATED_SECURITY_RISK');
    });
  });

  describe('calculateNomadTravelInsuranceAndEmergencyFund', () => {
    it('calculates travel insurance and emergency fund requirements correctly', () => {
      const res = calculateNomadTravelInsuranceAndEmergencyFund({
        tripDurationDays: 60,
        monthlyLivingCostUsd: 3000,
        destinationRiskTier: 'moderate',
        hasPreExistingHealthCondition: false
      });
      expect(res.valid).toBe(true);
      expect(res.recommendedEmergencyFundUsd).toBe(7500); // 3000 * 2.5
      expect(res.estimatedInsuranceCostUsd).toBe(262.5);  // 3.5 * 1.25 * 60
      expect(res.recommendation).toContain('Recommended emergency reserve: $7500.00');
    });

    it('returns error for non-positive trip duration or living cost', () => {
      const inv = calculateNomadTravelInsuranceAndEmergencyFund({ tripDurationDays: 0 });
      expect(inv.valid).toBe(false);
      expect(inv.error).toBe('Trip duration days must be a positive number');
    });
  });

  describe('calculateNomadColivingCommunityMatchScore', () => {
    it('calculates high compatibility match score for matching budget and interests', () => {
      const res = calculateNomadColivingCommunityMatchScore({
        userBudgetUsd: 1600,
        communityMonthlyPriceUsd: 1500,
        userWorkTimezoneOffset: 1,
        communityPrimaryTimezoneOffset: 1,
        sharedInterests: ['tech', 'hiking', 'surfing'],
        communityTags: ['tech', 'hiking', 'surfing'],
        quietHoursRequired: true,
        communityEnforcesQuietHours: true
      });
      expect(res.valid).toBe(true);
      expect(res.overallMatchScore).toBeGreaterThanOrEqual(85);
      expect(res.matchTier).toBe('HIGH_COMPATIBILITY');
    });

    it('returns error for invalid budget or community price', () => {
      const inv = calculateNomadColivingCommunityMatchScore({ userBudgetUsd: 0 });
      expect(inv.valid).toBe(false);
      expect(inv.error).toBe('User budget must be a positive number');
    });
  });

  describe('calculateNomadCoworkingPassSavingsIndex', () => {
    it('calculates monthly membership savings over daily passes correctly', () => {
      const res = calculateNomadCoworkingPassSavingsIndex({
        dailyDeskPassUsd: 25,
        monthlyMembershipPassUsd: 250,
        estimatedDaysPerMonth: 15,
        includesFreeCoffeeAndPerks: true,
        perkMonthlyValueUsd: 30
      });
      expect(res.valid).toBe(true);
      expect(res.payPerDayTotalUsd).toBe(375);
      expect(res.netMonthlyMembershipCostUsd).toBe(220);
      expect(res.monthlySavingsUsd).toBe(155);
      expect(res.isMonthlyPassBetter).toBe(true);
      expect(res.recommendationTier).toBe('HIGH_SAVINGS_MONTHLY_MEMBERSHIP');
      expect(res.recommendation).toContain('Monthly pass recommended');
    });

    it('returns error for invalid non-positive input parameters', () => {
      const inv = calculateNomadCoworkingPassSavingsIndex({ dailyDeskPassUsd: -10 });
      expect(inv.valid).toBe(false);
      expect(inv.error).toBe('Daily desk pass price must be a positive number');
    });
  });

  describe('calculateNomadCrossBorderTaxLiabilityIndex', () => {
    it('calculates tax liability index and flags residency when threshold exceeded', () => {
      const records = [
        { countryName: 'Spain', daysStayed: 190, foreignIncomeUsd: 40000, dtaAgreementActive: true },
        { countryName: 'Portugal', daysStayed: 60, foreignIncomeUsd: 15000, dtaAgreementActive: false }
      ];
      const res = calculateNomadCrossBorderTaxLiabilityIndex(records, 183);
      expect(res.valid).toBe(true);
      expect(res.totalStayDays).toBe(250);
      expect(res.isResidencyTriggered).toBe(true);
      expect(res.flaggedResidencyCountriesCount).toBe(1);
      expect(res.taxRiskTier).toBe('CRITICAL_TAX_RESIDENCY_TRIGGERED');
      expect(res.recommendation).toContain('Tax residency threshold (183 days) exceeded in Spain');
    });

    it('calculates low tax risk tier when all stays are within thresholds', () => {
      const records = [
        { countryName: 'Thailand', daysStayed: 80, foreignIncomeUsd: 20000 },
        { countryName: 'Indonesia', daysStayed: 70, foreignIncomeUsd: 18000 }
      ];
      const res = calculateNomadCrossBorderTaxLiabilityIndex(records, 183);
      expect(res.valid).toBe(true);
      expect(res.isResidencyTriggered).toBe(false);
      expect(res.taxRiskTier).toBe('LOW_TAX_RESIDENCY_RISK');
    });

    it('returns error for invalid empty or non-array records', () => {
      const res = calculateNomadCrossBorderTaxLiabilityIndex([]);
      expect(res.valid).toBe(false);
      expect(res.error).toBe('Stay records must be a non-empty array');
    });
  });

  describe('calculateNomadCommunityEventEngagementScore', () => {
    it('calculates event engagement score and HIGH_ENGAGEMENT_EVENT tier correctly', () => {
      const res = calculateNomadCommunityEventEngagementScore({
        attendeesCount: 25,
        maxCapacity: 30,
        discussionThreadsCount: 8,
        verifiedNomadsCount: 18,
        isHostVerified: true
      });
      expect(res.valid).toBe(true);
      expect(res.engagementScore).toBeGreaterThanOrEqual(80);
      expect(res.engagementTier).toBe('HIGH_ENGAGEMENT_EVENT');
      expect(res.recommendation).toContain('High community engagement event');
    });

    it('returns error for invalid non-positive input parameters', () => {
      const inv = calculateNomadCommunityEventEngagementScore({ attendeesCount: -5 });
      expect(inv.valid).toBe(false);
      expect(inv.error).toBe('Attendees count must be a non-negative number');
    });
  });
});



































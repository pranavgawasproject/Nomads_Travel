export function calculateNomadMonthlyBudgetAndVisaRunCost(params = {}) {
  const {
    cityName,
    monthlyHousingUsd,
    monthlyCoworkingUsd = 180,
    monthlyFoodUsd = 450,
    monthlyTransportUsd = 120,
    monthlySimAndTechUsd = 40,
    monthlyHealthInsuranceUsd = 110,
    stayDurationMonths = 3,
    visaMaxStayDays = 90,
    visaBorderRunFlightCostUsd = 220,
    visaExtensionFeeUsd = 50,
    isCoLivingOption = false
  } = params;

  if (!cityName || !monthlyHousingUsd || monthlyHousingUsd <= 0) {
    return {
      valid: false,
      error: 'Invalid city name or housing cost provided',
      baseMonthlyLivingCostUsd: 0,
      amortizedMonthlyCostUsd: 0,
      totalTripBudgetUsd: 0,
      borderRunsRequiredCount: 0,
      totalVisaExpensesUsd: 0,
      coLivingSavingsUsd: 0,
      taxResidencyRiskWarning: false,
      budgetTier: 'INVALID_INPUT',
      recommendation: 'Provide a valid city name and housing budget.'
    };
  }

  const effectiveHousingUsd = isCoLivingOption
    ? Math.round(monthlyHousingUsd * 0.85 * 100) / 100
    : monthlyHousingUsd;

  const coLivingSavingsUsd = isCoLivingOption
    ? Math.round((monthlyHousingUsd - effectiveHousingUsd) * stayDurationMonths * 100) / 100
    : 0;

  const baseMonthlyLivingCostUsd = Math.round(
    (effectiveHousingUsd +
      monthlyCoworkingUsd +
      monthlyFoodUsd +
      monthlyTransportUsd +
      monthlySimAndTechUsd +
      monthlyHealthInsuranceUsd) * 100
  ) / 100;

  const totalStayDays = stayDurationMonths * 30;
  let borderRunsRequiredCount = 0;
  let totalVisaExpensesUsd = 0;

  if (totalStayDays > visaMaxStayDays) {
    const excessDays = totalStayDays - visaMaxStayDays;
    borderRunsRequiredCount = Math.ceil(excessDays / visaMaxStayDays);
    totalVisaExpensesUsd = Math.round(borderRunsRequiredCount * (visaBorderRunFlightCostUsd + visaExtensionFeeUsd) * 100) / 100;
  }

  const totalTripBudgetUsd = Math.round((baseMonthlyLivingCostUsd * stayDurationMonths + totalVisaExpensesUsd) * 100) / 100;
  const amortizedMonthlyCostUsd = Math.round((totalTripBudgetUsd / stayDurationMonths) * 100) / 100;

  const taxResidencyRiskWarning = totalStayDays >= 183;

  let budgetTier = 'MODERATE_COST_HUB';
  if (amortizedMonthlyCostUsd < 1200) {
    budgetTier = 'BUDGET_FRIENDLY_HUB';
  } else if (amortizedMonthlyCostUsd > 2200) {
    budgetTier = 'PREMIUM_GLOBAL_HUB';
  }


  return {
    valid: true,
    cityName,
    stayDurationMonths,
    baseMonthlyLivingCostUsd,
    amortizedMonthlyCostUsd,
    totalTripBudgetUsd,
    borderRunsRequiredCount,
    totalVisaExpensesUsd,
    coLivingSavingsUsd,
    taxResidencyRiskWarning,
    budgetTier,
    recommendation: taxResidencyRiskWarning
      ? `Tax alert: Planned stay of ${stayDurationMonths} months (${totalStayDays} days) in ${cityName} triggers the 183-day tax residency threshold.`
      : borderRunsRequiredCount > 0
      ? `Visa run required: ${stayDurationMonths}-month stay exceeds ${visaMaxStayDays}-day tourist limit. Budget $${totalVisaExpensesUsd.toFixed(2)} for ${borderRunsRequiredCount} border run(s).`
      : `Optimal nomad stay: $${amortizedMonthlyCostUsd.toFixed(2)}/mo total estimated living expense in ${cityName} (${stayDurationMonths} months total $${totalTripBudgetUsd.toFixed(2)}).`
  };
}

export function calculateNomadFeieTaxExclusionCompliance(params = {}) {
  const {
    annualEarnedIncomeUsd = 120000,
    daysInForeignCountriesCount = 335,
    qualifyingWindowDays = 365,
    feieMaximumExclusionLimitUsd = 126500,
    foreignHousingExpenseUsd = 18000,
    usEffectiveTaxRatePct = 25.0
  } = params;

  if (typeof annualEarnedIncomeUsd !== 'number' || annualEarnedIncomeUsd <= 0) {
    return {
      valid: false,
      error: 'Annual earned income must be a positive number',
      meetsPhysicalPresenceTest: false,
      eligibleExclusionUsd: 0,
      estimatedTaxSavingsUsd: 0,
      daysNeededForQualificationCount: 0,
      complianceTier: 'INVALID_INPUT',
      recommendation: 'Provide valid positive annual earned income.'
    };
  }

  const daysInUSCount = Math.max(0, qualifyingWindowDays - daysInForeignCountriesCount);
  const meetsPhysicalPresenceTest = daysInForeignCountriesCount >= 330;
  const daysNeededForQualificationCount = meetsPhysicalPresenceTest ? 0 : Math.max(0, 330 - daysInForeignCountriesCount);

  let eligibleExclusionUsd = 0;
  let estimatedTaxSavingsUsd = 0;

  if (meetsPhysicalPresenceTest) {
    eligibleExclusionUsd = Math.round(Math.min(annualEarnedIncomeUsd, feieMaximumExclusionLimitUsd) * 100) / 100;
    estimatedTaxSavingsUsd = Math.round((eligibleExclusionUsd * (usEffectiveTaxRatePct / 100)) * 100) / 100;
  }

  const baseHousingThresholdUsd = Math.round((feieMaximumExclusionLimitUsd * 0.16) * 100) / 100;
  const eligibleHousingDeductionUsd = meetsPhysicalPresenceTest && foreignHousingExpenseUsd > baseHousingThresholdUsd
    ? Math.round(Math.min(foreignHousingExpenseUsd - baseHousingThresholdUsd, feieMaximumExclusionLimitUsd * 0.30) * 100) / 100
    : 0;

  const totalExclusionAndDeductionUsd = Math.round((eligibleExclusionUsd + eligibleHousingDeductionUsd) * 100) / 100;

  let complianceTier = 'QUALIFIED_FULL_FEIE_EXCLUSION';
  if (!meetsPhysicalPresenceTest) {
    complianceTier = 'INSUFFICIENT_FOREIGN_PRESENCE_RISK';
  } else if (annualEarnedIncomeUsd > feieMaximumExclusionLimitUsd) {
    complianceTier = 'PARTIAL_FEIE_CAP_EXCEEDED';
  }

  return {
    valid: true,
    annualEarnedIncomeUsd,
    daysInForeignCountriesCount,
    daysInUSCount,
    meetsPhysicalPresenceTest,
    daysNeededForQualificationCount,
    eligibleExclusionUsd,
    eligibleHousingDeductionUsd,
    totalExclusionAndDeductionUsd,
    estimatedTaxSavingsUsd,
    complianceTier,
    recommendation: meetsPhysicalPresenceTest
      ? `IRS Form 2555 FEIE Qualified! Physical presence test met (${daysInForeignCountriesCount}/330 days). Estimated U.S. federal tax savings: $${estimatedTaxSavingsUsd.toFixed(2)}.`
      : `FEIE Alert: Only ${daysInForeignCountriesCount}/330 full foreign days completed. Spend ${daysNeededForQualificationCount} more day(s) abroad within the 365-day window to unlock $${(Math.min(annualEarnedIncomeUsd, feieMaximumExclusionLimitUsd) * (usEffectiveTaxRatePct / 100)).toFixed(2)} in tax savings.`
  };
}

export function calculateNomadSchengenRollingWindowCompliance(params = {}) {
  const {
    plannedSchengenDaysCount = 0,
    past180DaysSchengenCount = 0,
    rollingWindowDays = 180,
    maxAllowedDays = 90,
    dailyOverstayPenaltyEur = 50
  } = params;

  if (typeof plannedSchengenDaysCount !== 'number' || plannedSchengenDaysCount <= 0) {
    return {
      valid: false,
      error: 'Planned Schengen days count must be a positive number',
      totalDaysInWindow: 0,
      daysRemainingAllowed: 0,
      overstayDaysCount: 0,
      complianceTier: 'INVALID_INPUT',
      recommendation: 'Provide valid positive planned stay duration in days.'
    };
  }

  const totalDaysInWindow = past180DaysSchengenCount + plannedSchengenDaysCount;
  const daysRemainingAllowed = Math.max(0, maxAllowedDays - past180DaysSchengenCount);
  const overstayDaysCount = Math.max(0, totalDaysInWindow - maxAllowedDays);
  const estimatedFineEur = Math.round(overstayDaysCount * dailyOverstayPenaltyEur * 100) / 100;

  const isCompliant = totalDaysInWindow <= maxAllowedDays;
  const isTaxResidencyAlert = totalDaysInWindow >= 183;

  let complianceTier = 'FULL_SCHENGEN_COMPLIANT';
  if (overstayDaysCount > 0) {
    complianceTier = 'SCHENGEN_90_180_OVERSTAY_VIOLATION';
  } else if (daysRemainingAllowed - plannedSchengenDaysCount <= 10) {
    complianceTier = 'SCHENGEN_BUFFER_CRITICAL';
  } else if (isTaxResidencyAlert) {
    complianceTier = 'TAX_RESIDENCY_RISK_TRIGGERED';
  }

  return {
    valid: true,
    plannedSchengenDaysCount,
    past180DaysSchengenCount,
    totalDaysInWindow,
    daysRemainingAllowed,
    overstayDaysCount,
    estimatedFineEur,
    isCompliant,
    isTaxResidencyAlert,
    complianceTier,
    recommendation: isCompliant
      ? `Schengen 90/180 Rule Compliant! Total stay: ${totalDaysInWindow}/${maxAllowedDays} days. ${daysRemainingAllowed - plannedSchengenDaysCount} buffer days remaining.`
      : `Schengen Overstay Risk! Planned ${plannedSchengenDaysCount}-day stay exceeds remaining 90-day window quota by ${overstayDaysCount} day(s). Est. penalty: €${estimatedFineEur.toFixed(2)} + entry ban risk.`
  };
}



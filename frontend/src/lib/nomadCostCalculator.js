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
    annualEarnedIncomeUsd: rawIncome = 120000,
    daysInForeignCountriesCount: rawForeignDays = 335,
    qualifyingWindowDays = 365,
    feieMaximumExclusionLimitUsd = 126500,
    foreignHousingExpenseUsd = 18000,
    usEffectiveTaxRatePct = 25.0
  } = params;

  const annualEarnedIncomeUsd = Number(rawIncome);
  const daysInForeignCountriesCount = Number(rawForeignDays);

  if (isNaN(annualEarnedIncomeUsd) || annualEarnedIncomeUsd <= 0) {
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
    plannedSchengenDaysCount: rawPlanned = 0,
    past180DaysSchengenCount: rawPast = 0,
    rollingWindowDays = 180,
    maxAllowedDays = 90,
    dailyOverstayPenaltyEur = 50
  } = params;

  const plannedSchengenDaysCount = Number(rawPlanned);
  const past180DaysSchengenCount = Math.max(0, Number(rawPast) || 0);

  if (isNaN(plannedSchengenDaysCount) || plannedSchengenDaysCount <= 0) {
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

export function calculateNomadDigitalNomadVisaIncomeTaxOptimization(params = {}) {
  const {
    annualRemoteIncomeUsd: rawIncome = 75000,
    destinationCountry = 'Spain',
    stayMonths = 12,
    isForeignSourceIncome = true,
    homeCountryTaxRatePct = 30.0
  } = params;

  const annualRemoteIncomeUsd = Number(rawIncome);
  if (isNaN(annualRemoteIncomeUsd) || annualRemoteIncomeUsd <= 0) {
    return {
      valid: false,
      error: 'Annual remote income must be a positive number',
      meetsMinimumIncomeRequirement: false,
      annualTaxSavingsUsd: 0,
      taxEfficiencyScore: 0,
      complianceTier: 'INVALID_INPUT',
      recommendation: 'Provide valid positive annual remote income.'
    };
  }

  const dnvRules = {
    Spain: { minMonthlyIncomeUsd: 2700, dnvTaxRatePct: 24.0, zeroTaxForeignIncome: false },
    Portugal: { minMonthlyIncomeUsd: 3280, dnvTaxRatePct: 20.0, zeroTaxForeignIncome: false },
    Dubai: { minMonthlyIncomeUsd: 3500, dnvTaxRatePct: 0.0, zeroTaxForeignIncome: true },
    CostaRica: { minMonthlyIncomeUsd: 3000, dnvTaxRatePct: 0.0, zeroTaxForeignIncome: true },
    Bali: { minMonthlyIncomeUsd: 2000, dnvTaxRatePct: 0.0, zeroTaxForeignIncome: true },
    Greece: { minMonthlyIncomeUsd: 3800, dnvTaxRatePct: 22.0, zeroTaxForeignIncome: false }
  };

  const countryKey = Object.keys(dnvRules).find(
    k => k.toLowerCase() === (destinationCountry || '').toLowerCase().replace(/\s+/g, '')
  ) || 'Spain';

  const config = dnvRules[countryKey];
  const minAnnualIncomeRequiredUsd = config.minMonthlyIncomeUsd * 12;
  const meetsMinimumIncomeRequirement = annualRemoteIncomeUsd >= minAnnualIncomeRequiredUsd;

  const baselineHomeTaxUsd = Math.round((annualRemoteIncomeUsd * (homeCountryTaxRatePct / 100)) * 100) / 100;

  let dnvTaxUsd = 0;
  if (config.zeroTaxForeignIncome && isForeignSourceIncome) {
    dnvTaxUsd = 0;
  } else {
    dnvTaxUsd = Math.round((annualRemoteIncomeUsd * (config.dnvTaxRatePct / 100)) * 100) / 100;
  }

  const annualTaxSavingsUsd = meetsMinimumIncomeRequirement
    ? Math.max(0, Math.round((baselineHomeTaxUsd - dnvTaxUsd) * 100) / 100)
    : 0;

  let taxEfficiencyScore = 100;
  if (!meetsMinimumIncomeRequirement) taxEfficiencyScore -= 40;
  if (!isForeignSourceIncome && config.zeroTaxForeignIncome) taxEfficiencyScore -= 25;
  if (dnvTaxUsd > baselineHomeTaxUsd) taxEfficiencyScore -= 30;
  taxEfficiencyScore = Math.max(0, Math.round(taxEfficiencyScore));

  let complianceTier = 'QUALIFIED_DNV_TAX_OPTIMIZED';
  if (!meetsMinimumIncomeRequirement) {
    complianceTier = 'INCOME_BELOW_DNV_THRESHOLD';
  } else if (config.zeroTaxForeignIncome && isForeignSourceIncome) {
    complianceTier = 'ZERO_TAX_FOREIGN_INCOME_EXEMPT';
  }

  return {
    valid: true,
    destinationCountry: countryKey,
    annualRemoteIncomeUsd,
    minAnnualIncomeRequiredUsd,
    meetsMinimumIncomeRequirement,
    baselineHomeTaxUsd,
    dnvTaxUsd,
    annualTaxSavingsUsd,
    taxEfficiencyScore,
    complianceTier,
    recommendation: meetsMinimumIncomeRequirement
      ? `${countryKey} Digital Nomad Visa Qualified! Annual income ($${annualRemoteIncomeUsd.toFixed(2)}) meets $${minAnnualIncomeRequiredUsd.toFixed(2)} threshold. Est. annual tax savings: $${annualTaxSavingsUsd.toFixed(2)}.`
      : `${countryKey} DNV Alert: Annual remote income ($${annualRemoteIncomeUsd.toFixed(2)}) is below the required $${minAnnualIncomeRequiredUsd.toFixed(2)} threshold ($${config.minMonthlyIncomeUsd}/mo).`
  };
}

export function calculateNomadPermanentEstablishmentRisk(params = {}) {
  const {
    employeeName = 'Remote Worker',
    employerHomeCountry = 'US',
    hostCountry = 'Portugal',
    stayDaysCount: rawStay = 120,
    hasContractSigningAuthority = false,
    isExecutiveOrManager = false,
    hasDedicatedHostOfficeSpace = false,
    companyAnnualRevenueUsd = 5000000
  } = params;

  const stayDaysCount = Number(rawStay);
  if (isNaN(stayDaysCount) || stayDaysCount <= 0) {
    return {
      valid: false,
      error: 'Stay days count must be a positive number',
      peRiskScore: 0,
      maxRecommendedSafeDaysCount: 0,
      complianceTier: 'INVALID_INPUT',
      recommendation: 'Provide a valid positive stay duration in days.'
    };
  }

  let riskScore = 10;

  if (stayDaysCount >= 183) riskScore += 50;
  else if (stayDaysCount >= 90) riskScore += 25;
  else if (stayDaysCount >= 60) riskScore += 10;

  if (hasContractSigningAuthority) riskScore += 35;
  if (isExecutiveOrManager) riskScore += 20;
  if (hasDedicatedHostOfficeSpace) riskScore += 15;

  const peRiskScore = Math.min(100, Math.round(riskScore));

  const maxRecommendedSafeDaysCount = hasContractSigningAuthority ? 30 : 90;
  const daysExceedingSafeLimitCount = Math.max(0, stayDaysCount - maxRecommendedSafeDaysCount);

  const estimatedCorporateTaxExposureUsd = Math.round((companyAnnualRevenueUsd * 0.03 * (peRiskScore / 100)) * 100) / 100;

  let complianceTier = 'LOW_PE_RISK_COMPLIANT';
  if (peRiskScore >= 60 || stayDaysCount >= 183 || (hasContractSigningAuthority && stayDaysCount > 30)) {
    complianceTier = 'HIGH_CORPORATE_PE_TAX_NEXUS_RISK';
  } else if (peRiskScore >= 30) {
    complianceTier = 'MODERATE_PE_MONITORING_REQUIRED';
  }

  return {
    valid: true,
    employeeName: String(employeeName || 'Remote Worker'),
    employerHomeCountry: String(employerHomeCountry || 'US').toUpperCase(),
    hostCountry: String(hostCountry || 'Portugal'),
    stayDaysCount,
    hasContractSigningAuthority: Boolean(hasContractSigningAuthority),
    isExecutiveOrManager: Boolean(isExecutiveOrManager),
    hasDedicatedHostOfficeSpace: Boolean(hasDedicatedHostOfficeSpace),
    peRiskScore,
    maxRecommendedSafeDaysCount,
    daysExceedingSafeLimitCount,
    estimatedCorporateTaxExposureUsd,
    complianceTier,
    recommendation: complianceTier === 'HIGH_CORPORATE_PE_TAX_NEXUS_RISK'
      ? `PE Corporate Tax Alert: ${employeeName}'s ${stayDaysCount}-day stay in ${hostCountry} creates high Permanent Establishment tax nexus risk (${peRiskScore}/100 score). Cap stay at ${maxRecommendedSafeDaysCount} days or utilize an Employer of Record (EOR).`
      : complianceTier === 'MODERATE_PE_MONITORING_REQUIRED'
      ? `Moderate PE risk (${peRiskScore}/100 score) for ${employeeName} in ${hostCountry}. Track days abroad and restrict contract signing authority.`
      : `Low Permanent Establishment risk (${peRiskScore}/100 score). Remote work stay compliant for employer.`
  };
}

export function calculateNomadFeiePhysicalPresenceWindowCompliance(params = {}) {
  const {
    foreignDaysCount: rawForeign = 340,
    usDaysCount: rawUs = 25,
    transitDaysCount: rawTransit = 0,
    annualForeignEarnedIncomeUsd: rawIncome = 120000,
    maxFeieExclusionCapUsd: rawCap = 126500,
    usTaxBracketPct: rawTaxBracket = 24.0
  } = params;

  const foreignDaysCount = Number(rawForeign);
  const usDaysCount = Number(rawUs);
  const transitDaysCount = Number(rawTransit);
  const annualForeignEarnedIncomeUsd = Number(rawIncome);
  const maxFeieExclusionCapUsd = Number(rawCap);
  const usTaxBracketPct = Number(rawTaxBracket);

  if (isNaN(foreignDaysCount) || foreignDaysCount < 0 || isNaN(usDaysCount) || usDaysCount < 0) {
    return {
      valid: false,
      error: 'Foreign days and US days counts must be non-negative numbers',
      meetsPhysicalPresenceTest: false,
      daysNeededAbroadForExclusion: 0,
      eligibleExclusionAmountUsd: 0,
      estimatedUsTaxSavingsUsd: 0,
      unqualifiedTaxLiabilityUsd: 0,
      complianceTier: 'INVALID_INPUT',
      recommendation: 'Provide valid day counts for FEIE physical presence audit.'
    };
  }

  const totalTrackedDays = foreignDaysCount + usDaysCount + transitDaysCount;
  const meetsPhysicalPresenceTest = foreignDaysCount >= 330;
  const daysNeededAbroadForExclusion = Math.max(0, 330 - foreignDaysCount);

  const eligibleExclusionAmountUsd = meetsPhysicalPresenceTest
    ? Math.min(annualForeignEarnedIncomeUsd, maxFeieExclusionCapUsd)
    : 0;

  const estimatedUsTaxSavingsUsd = Math.round((eligibleExclusionAmountUsd * (usTaxBracketPct / 100)) * 100) / 100;
  
  const potentialTaxSavingsUsd = Math.round((Math.min(annualForeignEarnedIncomeUsd, maxFeieExclusionCapUsd) * (usTaxBracketPct / 100)) * 100) / 100;
  const unqualifiedTaxLiabilityUsd = meetsPhysicalPresenceTest ? 0 : potentialTaxSavingsUsd;

  let complianceTier = 'QUALIFIED_FULL_FEIE_EXCLUSION';
  if (!meetsPhysicalPresenceTest) {
    if (daysNeededAbroadForExclusion <= 30) {
      complianceTier = 'AT_RISK_PHYSICAL_PRESENCE_GAP';
    } else {
      complianceTier = 'FAILED_FEIE_PHYSICAL_PRESENCE';
    }
  }

  return {
    valid: true,
    foreignDaysCount,
    usDaysCount,
    transitDaysCount,
    totalTrackedDays,
    meetsPhysicalPresenceTest,
    daysNeededAbroadForExclusion,
    annualForeignEarnedIncomeUsd,
    maxFeieExclusionCapUsd,
    eligibleExclusionAmountUsd,
    estimatedUsTaxSavingsUsd,
    unqualifiedTaxLiabilityUsd,
    complianceTier,
    recommendation: complianceTier === 'QUALIFIED_FULL_FEIE_EXCLUSION'
      ? `FEIE Qualified! ${foreignDaysCount} qualifying foreign days in 12-month window exceeds 330-day requirement. $${eligibleExclusionAmountUsd.toLocaleString()} excluded from US tax ($${estimatedUsTaxSavingsUsd.toLocaleString()} tax savings).`
      : complianceTier === 'AT_RISK_PHYSICAL_PRESENCE_GAP'
      ? `FEIE Warning: ${daysNeededAbroadForExclusion} additional foreign days required to reach 330-day threshold. Pass threshold to save ~$${potentialTaxSavingsUsd.toLocaleString()} in US income tax.`
      : `FEIE Ineligible: ${foreignDaysCount}/330 foreign days completed. Tax liability exposure: $${unqualifiedTaxLiabilityUsd.toLocaleString()}.`
  };
}

export function calculateNomadSubstantialPresenceTestRisk(params = {}) {
  const {
    currentYearUsDaysCount: rawCurrent = 120,
    priorYearUsDaysCount: rawPrior = 120,
    twoYearsPriorUsDaysCount: rawTwoPrior = 120,
    hasCloserConnectionToForeignCountry = false,
    annualGlobalIncomeUsd: rawIncome = 150000,
    usTaxRatePct: rawTaxRate = 24.0
  } = params;

  const currentYearUsDaysCount = Number(rawCurrent);
  const priorYearUsDaysCount = Number(rawPrior);
  const twoYearsPriorUsDaysCount = Number(rawTwoPrior);
  const annualGlobalIncomeUsd = Number(rawIncome);
  const usTaxRatePct = Number(rawTaxRate);

  if (
    isNaN(currentYearUsDaysCount) || currentYearUsDaysCount < 0 ||
    isNaN(priorYearUsDaysCount) || priorYearUsDaysCount < 0 ||
    isNaN(twoYearsPriorUsDaysCount) || twoYearsPriorUsDaysCount < 0
  ) {
    return {
      valid: false,
      error: 'US day counts for all 3 years must be non-negative numbers',
      sptWeightedDaysCount: 0,
      meetsSubstantialPresenceTest: false,
      qualifiesForForm8840CloserConnection: false,
      usTaxResidencyStatus: 'INVALID_INPUT',
      complianceTier: 'INVALID_INPUT',
      recommendation: 'Provide valid US day counts for Substantial Presence Test evaluation.'
    };
  }

  const sptWeightedDaysCount = Math.round(
    (currentYearUsDaysCount + (priorYearUsDaysCount / 3) + (twoYearsPriorUsDaysCount / 6)) * 10
  ) / 10;

  const meets31DayThreshold = currentYearUsDaysCount >= 31;
  const meetsSubstantialPresenceTest = meets31DayThreshold && sptWeightedDaysCount >= 183;

  const qualifiesForForm8840CloserConnection =
    meetsSubstantialPresenceTest && currentYearUsDaysCount < 183 && hasCloserConnectionToForeignCountry;

  let usTaxResidencyStatus = 'NON_RESIDENT_ALIEN';
  let estimatedUsTaxExposureUsd = 0;
  let complianceTier = 'NO_US_TAX_RESIDENCY_RISK';

  if (meetsSubstantialPresenceTest) {
    if (qualifiesForForm8840CloserConnection) {
      usTaxResidencyStatus = 'EXEMPT_VIA_FORM_8840';
      complianceTier = 'FORM_8840_CLOSER_CONNECTION_QUALIFIED';
      estimatedUsTaxExposureUsd = 0;
    } else {
      usTaxResidencyStatus = 'US_TAX_RESIDENT_TRIGGERED';
      complianceTier = 'DUAL_TAX_RESIDENCY_TRIGGERED';
      estimatedUsTaxExposureUsd = Math.round((annualGlobalIncomeUsd * (usTaxRatePct / 100)) * 100) / 100;
    }
  } else if (sptWeightedDaysCount >= 150) {
    complianceTier = 'HIGH_SPT_BORDERLINE_WARNING';
  }

  return {
    valid: true,
    currentYearUsDaysCount,
    priorYearUsDaysCount,
    twoYearsPriorUsDaysCount,
    sptWeightedDaysCount,
    meets31DayThreshold,
    meetsSubstantialPresenceTest,
    qualifiesForForm8840CloserConnection,
    usTaxResidencyStatus,
    annualGlobalIncomeUsd,
    estimatedUsTaxExposureUsd,
    complianceTier,
    recommendation: complianceTier === 'DUAL_TAX_RESIDENCY_TRIGGERED'
      ? `SPT Alert: US Tax Residency triggered (${sptWeightedDaysCount} weighted days >= 183). Global income ($${annualGlobalIncomeUsd.toLocaleString()}) subject to US tax ($${estimatedUsTaxExposureUsd.toLocaleString()} exposure).`
      : complianceTier === 'FORM_8840_CLOSER_CONNECTION_QUALIFIED'
      ? `SPT Qualified Exception: IRS Form 8840 closer connection exception applies (${currentYearUsDaysCount} US days < 183). File Form 8840 to claim non-resident tax status.`
      : complianceTier === 'HIGH_SPT_BORDERLINE_WARNING'
      ? `SPT Warning: Weighted US stay is ${sptWeightedDaysCount} days (approaching 183-day limit). Limit current year US stay to avoid tax residency.`
      : `SPT Compliant: ${sptWeightedDaysCount} weighted US days. No US tax residency triggered.`
  };
}


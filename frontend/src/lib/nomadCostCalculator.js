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

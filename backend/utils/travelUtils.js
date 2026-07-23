/**
 * Utility functions for digital nomad travel calculations and data sanitization.
 */

export function calculateNomadLivingCost(baseMonthlyCost, durationDays, style = 'standard') {
  if (typeof baseMonthlyCost !== 'number' || baseMonthlyCost <= 0 || isNaN(baseMonthlyCost)) {
    return 0;
  }
  if (typeof durationDays !== 'number' || durationDays <= 0 || isNaN(durationDays)) {
    return 0;
  }

  const multiplier = style === 'budget' ? 0.8 : style === 'luxury' ? 1.6 : 1.0;
  const dailyRate = (baseMonthlyCost / 30) * multiplier;
  return Math.round(dailyRate * durationDays * 100) / 100;
}

export function formatCurrency(amount, currency = 'USD') {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0.00';
  }
  try {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function calculateCurrencyExchange(amount, rate) {
  if (typeof amount !== 'number' || amount <= 0 || typeof rate !== 'number' || rate <= 0) {
    return 0;
  }
  return Math.round(amount * rate * 100) / 100;
}

export function calculateTripBudget({ totalBudget, durationDays, accommodationShare = 0.4, foodShare = 0.3, activitiesShare = 0.2, contingencyShare = 0.1 } = {}) {
  if (typeof totalBudget !== 'number' || totalBudget <= 0 || isNaN(totalBudget)) {
    return { valid: false, error: 'Total budget must be a positive number' };
  }
  if (typeof durationDays !== 'number' || durationDays <= 0 || !Number.isInteger(durationDays)) {
    return { valid: false, error: 'Duration days must be a positive integer' };
  }

  const accommodation = Math.round(totalBudget * accommodationShare * 100) / 100;
  const food = Math.round(totalBudget * foodShare * 100) / 100;
  const activities = Math.round(totalBudget * activitiesShare * 100) / 100;
  const contingency = Math.round(totalBudget * contingencyShare * 100) / 100;
  const dailySpendable = Math.round(((food + activities) / durationDays) * 100) / 100;

  return {
    valid: true,
    totalBudget,
    durationDays,
    breakdown: {
      accommodation,
      food,
      activities,
      contingency
    },
    dailySpendable
  };
}

export function validateDestinationFilter(query = {}) {
  const sanitized = {};
  if (query.region && typeof query.region === 'string') {
    sanitized.region = query.region.trim();
  }
  if (query.maxCost && !isNaN(Number(query.maxCost))) {
    sanitized.maxCost = Math.max(0, Number(query.maxCost));
  }
  if (query.minInternetMbps && !isNaN(Number(query.minInternetMbps))) {
    sanitized.minInternetMbps = Math.max(0, Number(query.minInternetMbps));
  }
  if (typeof query.safetyScore === 'number' || (typeof query.safetyScore === 'string' && !isNaN(Number(query.safetyScore)))) {
    const score = Number(query.safetyScore);
    if (score >= 1 && score <= 5) {
      sanitized.safetyScore = score;
    }
  }
  return sanitized;
}

export function calculateNomadScore({ internetSpeedMbps = 0, monthlyCostUsd = 2000, safetyRating = 3, visaEaseScore = 3 } = {}) {
  const speed = Math.max(0, typeof internetSpeedMbps === 'number' ? internetSpeedMbps : 0);
  const cost = Math.max(1, typeof monthlyCostUsd === 'number' ? monthlyCostUsd : 2000);
  const safety = Math.min(5, Math.max(1, typeof safetyRating === 'number' ? safetyRating : 3));
  const visa = Math.min(5, Math.max(1, typeof visaEaseScore === 'number' ? visaEaseScore : 3));

  const speedScore = Math.min(100, (speed / 100) * 100);
  const costScore = Math.max(0, Math.min(100, 100 - ((cost - 500) / 3500) * 100));
  const safetyScore = (safety / 5) * 100;
  const visaScore = (visa / 5) * 100;

  const totalScore = Math.round((speedScore * 0.35 + costScore * 0.25 + safetyScore * 0.20 + visaScore * 0.20) * 10) / 10;
  return {
    score: Math.min(100, Math.max(0, totalScore)),
    rating: totalScore >= 80 ? 'Excellent' : totalScore >= 60 ? 'Good' : totalScore >= 40 ? 'Average' : 'Challenging',
    breakdown: { speedScore: Math.round(speedScore), costScore: Math.round(costScore), safetyScore: Math.round(safetyScore), visaScore: Math.round(visaScore) }
  };
}

export function calculateTimeZoneOverlap(offsetA, offsetB, startHour = 9, endHour = 17) {
  if (typeof offsetA !== 'number' || typeof offsetB !== 'number' || isNaN(offsetA) || isNaN(offsetB)) {
    return { overlapHours: 0, percentage: 0 };
  }
  const workDuration = Math.max(1, Math.min(24, endHour - startHour));
  const diff = Math.abs(offsetA - offsetB);
  const overlap = Math.max(0, workDuration - diff);
  const percentage = Math.round((overlap / workDuration) * 100);
  return { overlapHours: Math.round(overlap * 10) / 10, percentage };
}

export function calculateCoworkingCostEstimate(monthlyDeskCostUsd, durationDays, passType = 'hotdesk') {
  if (typeof monthlyDeskCostUsd !== 'number' || monthlyDeskCostUsd <= 0 || isNaN(monthlyDeskCostUsd)) {
    return { totalCost: 0, dailyRate: 0 };
  }
  if (typeof durationDays !== 'number' || durationDays <= 0 || isNaN(durationDays)) {
    return { totalCost: 0, dailyRate: 0 };
  }
  const multiplier = passType === 'dedicated' ? 1.4 : passType === 'private_office' ? 2.2 : 1.0;
  const baseDaily = (monthlyDeskCostUsd / 30) * multiplier;
  const totalCost = Math.round(baseDaily * durationDays * 100) / 100;
  return {
    totalCost,
    dailyRate: Math.round(baseDaily * 100) / 100,
    passType
  };
}

export function calculateVisaStayLimit(entryDateStr, allowedDays = 90, currentUsageDays = 0) {
  if (!entryDateStr || typeof entryDateStr !== 'string') {
    return { daysRemaining: 0, isWarning: false, deadlineDate: '' };
  }
  const entryDate = new Date(entryDateStr);
  if (isNaN(entryDate.getTime())) {
    return { daysRemaining: 0, isWarning: false, deadlineDate: '' };
  }
  const limit = typeof allowedDays === 'number' && allowedDays > 0 ? allowedDays : 90;
  const used = typeof currentUsageDays === 'number' && currentUsageDays >= 0 ? currentUsageDays : 0;
  const netAllowed = Math.max(0, limit - used);

  const deadline = new Date(entryDate);
  deadline.setDate(deadline.getDate() + netAllowed);

  const deadlineStr = deadline.toISOString().split('T')[0];
  const isWarning = netAllowed <= 14;

  return {
    daysRemaining: netAllowed,
    isWarning,
    deadlineDate: deadlineStr
  };
}

export function calculateEventReminderSchedule(eventDateStr) {
  if (!eventDateStr || typeof eventDateStr !== 'string') {
    return { isValid: false, reminder24h: '', reminder2h: '', isUpcomingSoon: false };
  }
  const eventDate = new Date(eventDateStr);
  if (isNaN(eventDate.getTime())) {
    return { isValid: false, reminder24h: '', reminder2h: '', isUpcomingSoon: false };
  }

  const reminder24h = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const reminder2h = new Date(eventDate.getTime() - 2 * 60 * 60 * 1000).toISOString();

  const now = new Date();
  const diffHours = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isUpcomingSoon = diffHours > 0 && diffHours <= 48;

  return {
    isValid: true,
    eventTimestamp: eventDate.toISOString(),
    reminder24h,
    reminder2h,
    isUpcomingSoon,
    hoursUntilEvent: Math.round(diffHours * 10) / 10
  };
}

export function calculateNomadTaxResidencyRisk(stays = [], maxThresholdDays = 183) {
  if (!Array.isArray(stays) || stays.length === 0) {
    return {
      hasHighRisk: false,
      totalStaysCount: 0,
      totalDaysTracked: 0,
      countryBreakdown: [],
      warningCountries: []
    };
  }

  const threshold = typeof maxThresholdDays === 'number' && maxThresholdDays > 0 ? maxThresholdDays : 183;
  const totals = {};
  let totalDaysTracked = 0;

  stays.forEach(stay => {
    if (!stay || typeof stay.country !== 'string' || typeof stay.days !== 'number' || stay.days <= 0) {
      return;
    }
    const country = stay.country.trim();
    if (!country) return;
    totals[country] = (totals[country] || 0) + stay.days;
    totalDaysTracked += stay.days;
  });

  const countryBreakdown = Object.entries(totals).map(([country, days]) => {
    const riskPercentage = Math.min(100, Math.round((days / threshold) * 100));
    return {
      country,
      days,
      riskPercentage,
      exceedsThreshold: days >= threshold
    };
  }).sort((a, b) => b.days - a.days);

  const warningCountries = countryBreakdown.filter(c => c.exceedsThreshold).map(c => c.country);

  return {
    hasHighRisk: warningCountries.length > 0,
    totalStaysCount: stays.length,
    totalDaysTracked,
    countryBreakdown,
    warningCountries
  };
}

export function calculateTravelInsuranceEstimate({ age = 30, durationDays = 30, includesHealth = true, includesEquipment = false, coverageTier = 'standard' } = {}) {
  if (typeof durationDays !== 'number' || durationDays <= 0 || isNaN(durationDays)) {
    return { valid: false, error: 'Duration days must be a positive number' };
  }
  const validAge = typeof age === 'number' && age > 0 ? age : 30;
  const ageMultiplier = validAge > 60 ? 1.8 : validAge > 40 ? 1.3 : 1.0;
  const tierMultiplier = coverageTier === 'premium' ? 1.5 : coverageTier === 'basic' ? 0.75 : 1.0;

  let baseDailyRate = 2.5;
  if (includesHealth) baseDailyRate += 1.0;
  if (includesEquipment) baseDailyRate += 1.5;

  const totalCost = Math.round(baseDailyRate * durationDays * ageMultiplier * tierMultiplier * 100) / 100;
  const dailyRate = Math.round((totalCost / durationDays) * 100) / 100;

  return {
    valid: true,
    totalCost,
    dailyRate,
    durationDays,
    coverageTier,
    includesHealth: Boolean(includesHealth),
    includesEquipment: Boolean(includesEquipment)
  };
}

export function calculateNomadWorkationSavings({ homeMonthlyExpense = 3000, destinationMonthlyExpense = 1500, flightCostUsd = 600, durationMonths = 3 } = {}) {
  if (typeof homeMonthlyExpense !== 'number' || homeMonthlyExpense <= 0 || isNaN(homeMonthlyExpense)) {
    return { valid: false, error: 'Home monthly expense must be a positive number' };
  }
  if (typeof destinationMonthlyExpense !== 'number' || destinationMonthlyExpense <= 0 || isNaN(destinationMonthlyExpense)) {
    return { valid: false, error: 'Destination monthly expense must be a positive number' };
  }
  if (typeof durationMonths !== 'number' || durationMonths <= 0 || isNaN(durationMonths)) {
    return { valid: false, error: 'Duration months must be a positive number' };
  }

  const safeFlightCost = typeof flightCostUsd === 'number' && flightCostUsd >= 0 ? flightCostUsd : 0;
  const grossHomeTotal = homeMonthlyExpense * durationMonths;
  const grossDestinationTotal = (destinationMonthlyExpense * durationMonths) + safeFlightCost;
  const monthlySavings = Math.round((homeMonthlyExpense - destinationMonthlyExpense) * 100) / 100;
  const netTotalSavings = Math.round((grossHomeTotal - grossDestinationTotal) * 100) / 100;

  const roiPercentage = Math.round(((grossHomeTotal - grossDestinationTotal) / grossHomeTotal) * 100);

  let recommendation = 'Cost Neutral';
  if (netTotalSavings > 1000) {
    recommendation = 'Highly Favorable';
  } else if (netTotalSavings > 0) {
    recommendation = 'Moderate Savings';
  } else if (netTotalSavings < 0) {
    recommendation = 'Higher Cost';
  }

  return {
    valid: true,
    monthlySavings,
    grossHomeTotal,
    grossDestinationTotal,
    netTotalSavings,
    roiPercentage,
    flightCostUsd: safeFlightCost,
    recommendation
  };
}

export function calculateNomadEmergencyFundRequirement({ monthlyLivingExpense = 2000, durationMonths = 6, bufferPercentage = 20, includesEmergencyFlight = true, emergencyFlightCostUsd = 1200 } = {}) {
  if (typeof monthlyLivingExpense !== 'number' || monthlyLivingExpense <= 0 || isNaN(monthlyLivingExpense)) {
    return { valid: false, error: 'Monthly living expense must be a positive number' };
  }
  if (typeof durationMonths !== 'number' || durationMonths <= 0 || isNaN(durationMonths)) {
    return { valid: false, error: 'Duration months must be a positive number' };
  }

  const baseExpenseTotal = monthlyLivingExpense * durationMonths;
  const safeBufferPct = typeof bufferPercentage === 'number' && bufferPercentage >= 0 ? bufferPercentage : 20;
  const bufferAmount = Math.round(baseExpenseTotal * (safeBufferPct / 100) * 100) / 100;
  const safeFlightCost = includesEmergencyFlight && typeof emergencyFlightCostUsd === 'number' && emergencyFlightCostUsd >= 0 ? emergencyFlightCostUsd : 0;

  const totalEmergencyFundRequired = Math.round((baseExpenseTotal + bufferAmount + safeFlightCost) * 100) / 100;
  const recommendedMonthlySavingTarget = Math.round((totalEmergencyFundRequired / (durationMonths * 2)) * 100) / 100;

  return {
    valid: true,
    baseExpenseTotal,
    bufferAmount,
    emergencyFlightCost: safeFlightCost,
    totalEmergencyFundRequired,
    recommendedMonthlySavingTarget,
    bufferPercentage: safeBufferPct
  };
}

export function calculateDigitalNomadSubletRoi({ homeRentUsd = 2000, subletPriceUsd = 2200, platformFeePercentage = 3, utilityBufferUsd = 150, durationMonths = 1 } = {}) {
  if (typeof homeRentUsd !== 'number' || homeRentUsd <= 0 || isNaN(homeRentUsd)) {
    return { valid: false, error: 'Home rent must be a positive number' };
  }
  if (typeof subletPriceUsd !== 'number' || subletPriceUsd <= 0 || isNaN(subletPriceUsd)) {
    return { valid: false, error: 'Sublet price must be a positive number' };
  }

  const months = typeof durationMonths === 'number' && durationMonths > 0 ? durationMonths : 1;
  const feeRate = typeof platformFeePercentage === 'number' && platformFeePercentage >= 0 ? platformFeePercentage / 100 : 0.03;
  const utilBuffer = typeof utilityBufferUsd === 'number' && utilityBufferUsd >= 0 ? utilityBufferUsd : 0;

  const grossSubletIncome = subletPriceUsd * months;
  const platformFeesTotal = Math.round(grossSubletIncome * feeRate * 100) / 100;
  const netSubletIncome = Math.round((grossSubletIncome - platformFeesTotal - (utilBuffer * months)) * 100) / 100;

  const totalRentCost = homeRentUsd * months;
  const netOutofPocketHomeExpense = Math.max(0, Math.round((totalRentCost - netSubletIncome) * 100) / 100);
  const netProfitUsd = Math.round((netSubletIncome - totalRentCost) * 100) / 100;
  const rentCoveragePercentage = Math.round((netSubletIncome / totalRentCost) * 100);

  return {
    valid: true,
    grossSubletIncome,
    platformFeesTotal,
    netSubletIncome,
    totalRentCost,
    netOutofPocketHomeExpense,
    netProfitUsd,
    rentCoveragePercentage,
    isProfitable: netProfitUsd > 0
  };
}

export function calculateNomadSimDataBudget({ durationDays = 30, workHoursPerDay = 8, videoHoursPerDay = 2, isHeavyUsage = false } = {}) {
  if (typeof durationDays !== 'number' || durationDays <= 0 || isNaN(durationDays)) {
    return { valid: false, error: 'Duration days must be a positive number' };
  }

  const safeWorkHours = typeof workHoursPerDay === 'number' && workHoursPerDay >= 0 ? workHoursPerDay : 8;
  const safeVideoHours = typeof videoHoursPerDay === 'number' && videoHoursPerDay >= 0 ? videoHoursPerDay : 2;

  // Base daily data consumption: 0.15 GB/work hour + 1.2 GB/video hour
  const workGbPerDay = safeWorkHours * 0.15;
  const videoGbPerDay = safeVideoHours * 1.2;
  const multiplier = isHeavyUsage ? 1.5 : 1.0;

  const estimatedDailyGb = Math.round((workGbPerDay + videoGbPerDay) * multiplier * 100) / 100;
  const totalGbRequired = Math.round(estimatedDailyGb * durationDays * 100) / 100;

  // Average market rate estimates: eSIM ($4.50/GB) vs Local Physical SIM ($1.80/GB)
  const esimEstimatedCostUsd = Math.round(totalGbRequired * 4.5 * 100) / 100;
  const localSimEstimatedCostUsd = Math.round(totalGbRequired * 1.8 * 100) / 100;

  return {
    valid: true,
    durationDays,
    estimatedDailyGb,
    totalGbRequired,
    esimEstimatedCostUsd,
    localSimEstimatedCostUsd,
    recommendedOption: totalGbRequired > 20 ? 'Local Physical SIM' : 'eSIM'
  };
}

export function calculateNomadCarbonOffsetEstimate({ flightHours = 0, busTrainHours = 0, stayDurationDays = 30, isEcoStay = false } = {}) {
  const flights = typeof flightHours === 'number' && flightHours > 0 ? flightHours : 0;
  const transit = typeof busTrainHours === 'number' && busTrainHours > 0 ? busTrainHours : 0;
  const days = typeof stayDurationDays === 'number' && stayDurationDays > 0 ? stayDurationDays : 0;

  if (flights === 0 && transit === 0 && days === 0) {
    return { valid: false, error: 'Travel duration and hours must be positive numbers' };
  }

  // Emission factors (kg CO2e per unit)
  // Flight: ~90 kg/hr; Bus/Train: ~15 kg/hr; Daily Stay: ~18 kg/day (reduced by 35% if EcoStay)
  const flightEmissions = flights * 90;
  const transitEmissions = transit * 15;
  const stayFactor = isEcoStay ? 11.7 : 18;
  const stayEmissions = days * stayFactor;

  const totalKgCo2 = Math.round((flightEmissions + transitEmissions + stayEmissions) * 100) / 100;
  const totalMetricTons = Math.round((totalKgCo2 / 1000) * 1000) / 1000;
  
  // Standard market offset cost: ~$15.00 per metric ton CO2
  const offsetCostUsd = Math.max(1.00, Math.round(totalMetricTons * 15.0 * 100) / 100);

  return {
    valid: true,
    flightEmissionsKg: flightEmissions,
    transitEmissionsKg: transitEmissions,
    stayEmissionsKg: Math.round(stayEmissions * 100) / 100,
    totalKgCo2,
    totalMetricTons,
    offsetCostUsd,
    ecoStayDiscountApplied: isEcoStay
  };
}

export function calculateNomadVisaIncomeQualification({ monthlyIncomeUsd = 0, targetCountry = 'Spain', dependentsCount = 0 } = {}) {
  if (typeof monthlyIncomeUsd !== 'number' || monthlyIncomeUsd <= 0 || isNaN(monthlyIncomeUsd)) {
    return { valid: false, error: 'Monthly income must be a positive number' };
  }

  const country = (targetCountry || 'Spain').trim();
  const countryThresholds = {
    Spain: 2400,
    Portugal: 3200,
    Greece: 3800,
    Colombia: 1500,
    Thailand: 2000,
    Japan: 6400,
    Croatia: 2700,
    Italy: 2900
  };

  const baseRequirement = countryThresholds[country] || 2500;
  const deps = typeof dependentsCount === 'number' && dependentsCount > 0 ? Math.floor(dependentsCount) : 0;
  const dependentSurcharge = deps * (baseRequirement * 0.20);
  const totalRequiredIncomeUsd = Math.round((baseRequirement + dependentSurcharge) * 100) / 100;

  const incomeMarginUsd = Math.round((monthlyIncomeUsd - totalRequiredIncomeUsd) * 100) / 100;
  const qualifies = incomeMarginUsd >= 0;

  return {
    valid: true,
    country,
    monthlyIncomeUsd,
    dependentsCount: deps,
    baseRequirementUsd: baseRequirement,
    totalRequiredIncomeUsd,
    incomeMarginUsd,
    qualifies,
    statusMessage: qualifies
      ? `Qualifies for ${country} Digital Nomad Visa with a $${incomeMarginUsd.toFixed(2)} monthly surplus buffer.`
      : `Short by $${Math.abs(incomeMarginUsd).toFixed(2)}/month for ${country} Digital Nomad Visa requirements.`
  };
}

export function calculateNomadSchengen90180Limit({ stayDaysPast180 = 0, plannedStayDays = 30 } = {}) {
  if (typeof stayDaysPast180 !== 'number' || stayDaysPast180 < 0 || isNaN(stayDaysPast180)) {
    return { valid: false, error: 'Stay days in past 180 days must be a non-negative number' };
  }
  if (typeof plannedStayDays !== 'number' || plannedStayDays <= 0 || isNaN(plannedStayDays)) {
    return { valid: false, error: 'Planned stay days must be a positive number' };
  }

  const daysUsed = Math.floor(stayDaysPast180);
  const planned = Math.floor(plannedStayDays);
  const remainingAllowedDays = Math.max(0, 90 - daysUsed);
  const isOverstayRisk = (daysUsed + planned) > 90;
  const allowablePlannedDays = Math.min(planned, remainingAllowedDays);

  return {
    valid: true,
    stayDaysPast180: daysUsed,
    plannedStayDays: planned,
    remainingAllowedDays,
    isOverstayRisk,
    allowablePlannedDays,
    statusMessage: isOverstayRisk
      ? `Warning: Planned ${planned} days will exceed 90-day Schengen limit by ${(daysUsed + planned) - 90} day(s).`
      : `Safe: ${remainingAllowedDays} day(s) remaining in 180-day window.`
  };
}

export function calculateNomadColivingVsApartmentCost({
  monthlyApartmentRent = 1500,
  coworkingPassCost = 250,
  utilityCost = 150,
  setupCostOneTime = 300,
  monthlyColivingCost = 1800,
  stayDurationMonths = 3
} = {}) {
  if (typeof monthlyApartmentRent !== 'number' || monthlyApartmentRent <= 0 || isNaN(monthlyApartmentRent)) {
    return { valid: false, error: 'Monthly apartment rent must be a positive number' };
  }
  if (typeof monthlyColivingCost !== 'number' || monthlyColivingCost <= 0 || isNaN(monthlyColivingCost)) {
    return { valid: false, error: 'Monthly coliving cost must be a positive number' };
  }
  if (typeof stayDurationMonths !== 'number' || stayDurationMonths <= 0 || isNaN(stayDurationMonths)) {
    return { valid: false, error: 'Stay duration months must be a positive number' };
  }

  const months = stayDurationMonths;
  const coworking = typeof coworkingPassCost === 'number' && coworkingPassCost >= 0 ? coworkingPassCost : 0;
  const utils = typeof utilityCost === 'number' && utilityCost >= 0 ? utilityCost : 0;
  const setup = typeof setupCostOneTime === 'number' && setupCostOneTime >= 0 ? setupCostOneTime : 0;

  const totalApartmentCost = (monthlyApartmentRent + coworking + utils) * months + setup;
  const totalColivingCost = monthlyColivingCost * months;

  const netSavingsWithColiving = Math.round((totalApartmentCost - totalColivingCost) * 100) / 100;
  const colivingCheaper = netSavingsWithColiving > 0;

  return {
    valid: true,
    stayDurationMonths: months,
    totalApartmentCost: Math.round(totalApartmentCost * 100) / 100,
    totalColivingCost: Math.round(totalColivingCost * 100) / 100,
    netSavingsWithColiving,
    colivingCheaper,
    recommendation: colivingCheaper
      ? `Coliving saves $${Math.abs(netSavingsWithColiving).toFixed(2)} overall compared to apartment + coworking.`
      : `Apartment setup saves $${Math.abs(netSavingsWithColiving).toFixed(2)} overall for a ${months}-month stay.`
  };
}

export function calculateNomadVisaProcessingTimeEstimate({ country = 'General', processingType = 'standard', hasExpeditedFee = false } = {}) {
  const targetCountry = typeof country === 'string' && country.trim() ? country.trim() : 'General';
  const mode = typeof processingType === 'string' ? processingType.toLowerCase().trim() : 'standard';
  
  let baseDays = 30;
  if (targetCountry.toLowerCase() === 'portugal' || targetCountry.toLowerCase() === 'spain') baseDays = 45;
  if (targetCountry.toLowerCase() === 'estonia' || targetCountry.toLowerCase() === 'croatia') baseDays = 20;

  let estimatedDays = baseDays;
  if (mode === 'express' || hasExpeditedFee) {
    estimatedDays = Math.max(5, Math.round(baseDays * 0.4));
  } else if (mode === 'priority') {
    estimatedDays = Math.max(10, Math.round(baseDays * 0.65));
  }

  const estimatedWeeks = Math.round((estimatedDays / 7) * 10) / 10;

  return {
    valid: true,
    country: targetCountry,
    processingType: mode,
    hasExpeditedFee: Boolean(hasExpeditedFee),
    estimatedBusinessDays: estimatedDays,
    estimatedWeeks,
    statusMessage: `Estimated visa processing for ${targetCountry} (${mode}): approx ${estimatedDays} business days (~${estimatedWeeks} weeks).`
  };
}

export function calculateNomadCommunityHubScore({
  internetSpeedMbps = 50,
  coworkingSpacesCount = 5,
  monthlyEventsCount = 10,
  safetyScore = 4.0,
  costOfLivingIndex = 50
} = {}) {
  const speed = typeof internetSpeedMbps === 'number' && internetSpeedMbps > 0 ? internetSpeedMbps : 0;
  const cowork = typeof coworkingSpacesCount === 'number' && coworkingSpacesCount >= 0 ? coworkingSpacesCount : 0;
  const events = typeof monthlyEventsCount === 'number' && monthlyEventsCount >= 0 ? monthlyEventsCount : 0;
  const safety = typeof safetyScore === 'number' && safetyScore >= 1 && safetyScore <= 5 ? safetyScore : 3.0;
  const colIndex = typeof costOfLivingIndex === 'number' && costOfLivingIndex > 0 ? costOfLivingIndex : 50;

  const speedScore = Math.min(10, (speed / 100) * 10);
  const coworkScore = Math.min(10, cowork * 1.5);
  const eventScore = Math.min(10, events * 0.8);
  const safetyScoreWeighted = safety * 2;
  const colScore = Math.max(1, 10 - (colIndex / 15));

  const compositeScore = Math.round(((speedScore * 0.25) + (coworkScore * 0.2) + (eventScore * 0.2) + (safetyScoreWeighted * 0.2) + (colScore * 0.15)) * 10) / 10;
  
  let grade = 'B';
  if (compositeScore >= 8.5) grade = 'A+';
  else if (compositeScore >= 7.5) grade = 'A';
  else if (compositeScore >= 6.0) grade = 'B';
  else grade = 'C';

  return {
    valid: true,
    compositeScore,
    grade,
    breakdown: {
      speedScore: Math.round(speedScore * 10) / 10,
      coworkScore: Math.round(coworkScore * 10) / 10,
      eventScore: Math.round(eventScore * 10) / 10,
      safetyScore: Math.round(safetyScoreWeighted * 10) / 10,
      affordabilityScore: Math.round(colScore * 10) / 10
    }
  };
}

export function calculateNomadFlightLayoverOptimization({
  layoverDurationHours = 4,
  overnightHotelRequired = false,
  transitVisaRequired = false,
  transitVisaCostUsd = 0,
  hotelCostUsd = 0,
  coworkingLoungeAccess = true,
  loungeFeeUsd = 35
} = {}) {
  if (typeof layoverDurationHours !== 'number' || layoverDurationHours < 0 || isNaN(layoverDurationHours)) {
    return { valid: false, error: 'Layover duration must be a non-negative number' };
  }

  const layover = Math.round(layoverDurationHours * 10) / 10;
  const visaCost = transitVisaRequired && typeof transitVisaCostUsd === 'number' && transitVisaCostUsd > 0 ? transitVisaCostUsd : 0;
  const hotelCost = overnightHotelRequired && typeof hotelCostUsd === 'number' && hotelCostUsd > 0 ? hotelCostUsd : 0;
  const loungeCost = coworkingLoungeAccess && typeof loungeFeeUsd === 'number' && loungeFeeUsd > 0 ? loungeFeeUsd : 0;

  const totalExtraCostUsd = Math.round((visaCost + hotelCost + loungeCost) * 100) / 100;

  let frictionScore = 2.0;
  if (layover < 2) frictionScore += 3.0;
  else if (layover > 8) frictionScore += 4.5;
  else if (layover > 4) frictionScore += 2.0;

  if (overnightHotelRequired) frictionScore += 2.0;
  if (transitVisaRequired) frictionScore += 1.5;
  if (coworkingLoungeAccess) frictionScore = Math.max(1.0, frictionScore - 1.5);

  frictionScore = Math.min(10.0, Math.round(frictionScore * 10) / 10);

  return {
    valid: true,
    layoverDurationHours: layover,
    totalExtraCostUsd,
    frictionScore,
    isWorkableLayover: layover >= 3 && coworkingLoungeAccess,
    recommendation: layover > 8 && !overnightHotelRequired
      ? 'Recommend booking a transit hotel or lounge pass for extended layovers.'
      : 'Layover parameters are within optimal comfort thresholds.'
  };
}

export function calculateNomadHealthInsuranceCoverageScore({
  age = 30,
  monthlyPremiumUsd = 120,
  maxDeductibleUsd = 1000,
  includesMedicalEvacuation = true,
  includesAdventureSports = false,
  hasPreExistingConditionCoverage = false
} = {}) {
  if (typeof monthlyPremiumUsd !== 'number' || monthlyPremiumUsd <= 0 || isNaN(monthlyPremiumUsd)) {
    return { valid: false, error: 'Monthly premium must be a positive number' };
  }

  const validAge = typeof age === 'number' && age > 0 ? age : 30;
  const validDeductible = typeof maxDeductibleUsd === 'number' && maxDeductibleUsd >= 0 ? maxDeductibleUsd : 1000;

  let score = 50;
  if (includesMedicalEvacuation) score += 20;
  if (includesAdventureSports) score += 15;
  if (hasPreExistingConditionCoverage) score += 15;
  if (validDeductible <= 500) score += 10;
  else if (validDeductible > 2500) score -= 15;

  score = Math.min(100, Math.max(0, score));

  let riskTier = 'MODERATE';
  if (score >= 80) riskTier = 'EXCELLENT';
  else if (score >= 60) riskTier = 'GOOD';
  else if (score < 40) riskTier = 'HIGH_RISK';

  return {
    valid: true,
    age: validAge,
    monthlyPremiumUsd,
    maxDeductibleUsd: validDeductible,
    coverageScore: score,
    riskTier,
    isEvacuationCovered: Boolean(includesMedicalEvacuation),
    recommendation: score >= 75
      ? 'Comprehensive digital nomad medical insurance plan.'
      : 'Consider upgrading emergency evacuation and adventure sports riders.'
  };
}

export function calculateNomadLuggageWeightAndFee({
  carryOnBaggageKg = 7,
  checkedBaggageKg = 20,
  airlineLimitKg = 23,
  excessFeePerKgUsd = 15,
  includesTechEquipment = true
} = {}) {
  if (typeof checkedBaggageKg !== 'number' || checkedBaggageKg < 0 || isNaN(checkedBaggageKg)) {
    return { valid: false, error: 'Checked baggage weight must be a non-negative number' };
  }
  if (typeof carryOnBaggageKg !== 'number' || carryOnBaggageKg < 0 || isNaN(carryOnBaggageKg)) {
    return { valid: false, error: 'Carry-on baggage weight must be a non-negative number' };
  }

  const carryOn = Math.round(carryOnBaggageKg * 10) / 10;
  const checked = Math.round(checkedBaggageKg * 10) / 10;
  const limit = typeof airlineLimitKg === 'number' && airlineLimitKg > 0 ? airlineLimitKg : 23;
  const feePerKg = typeof excessFeePerKgUsd === 'number' && excessFeePerKgUsd >= 0 ? excessFeePerKgUsd : 15;

  const totalWeightKg = Math.round((carryOn + checked) * 10) / 10;
  const excessKg = Math.max(0, Math.round((checked - limit) * 10) / 10);
  const excessFeeUsd = Math.round(excessKg * feePerKg * 100) / 100;
  const isOverweight = excessKg > 0;

  let recommendation = 'Baggage weight is within airline free limits.';
  if (isOverweight) {
    recommendation = `Checked bag exceeds free limit by ${excessKg} kg. Estimated excess fee is $${excessFeeUsd.toFixed(2)}.`;
  } else if (includesTechEquipment && carryOn > 10) {
    recommendation = 'Carry-on with tech equipment exceeds typical 10kg cabin threshold; distribute items to personal item.';
  }

  return {
    valid: true,
    carryOnBaggageKg: carryOn,
    checkedBaggageKg: checked,
    totalWeightKg,
    airlineLimitKg: limit,
    excessKg,
    excessFeeUsd,
    isOverweight,
    recommendation
  };
}










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

export function calculateNomadCoworkingPassOptimization({
  monthlyPassCostUsd = 250,
  dayPassCostUsd = 25,
  workingDaysPerMonth = 15,
  requiresDedicatedDesk = false,
  requires247Access = true
} = {}) {
  if (typeof monthlyPassCostUsd !== 'number' || monthlyPassCostUsd <= 0 || isNaN(monthlyPassCostUsd)) {
    return { valid: false, error: 'Monthly pass cost must be a positive number' };
  }
  if (typeof dayPassCostUsd !== 'number' || dayPassCostUsd <= 0 || isNaN(dayPassCostUsd)) {
    return { valid: false, error: 'Day pass cost must be a positive number' };
  }

  const days = typeof workingDaysPerMonth === 'number' && workingDaysPerMonth > 0 ? workingDaysPerMonth : 15;
  const dedicatedMultiplier = requiresDedicatedDesk ? 1.35 : 1.0;
  const adjustedMonthlyCost = Math.round(monthlyPassCostUsd * dedicatedMultiplier * 100) / 100;
  const totalDayPassCost = Math.round(dayPassCostUsd * days * 100) / 100;

  const costDifference = Math.round(Math.abs(adjustedMonthlyCost - totalDayPassCost) * 100) / 100;
  const preferMonthly = adjustedMonthlyCost <= totalDayPassCost || requires247Access;

  let recommendation = `Monthly pass saves $${costDifference.toFixed(2)} based on ${days} working days.`;
  if (!preferMonthly) {
    recommendation = `Day passes save $${costDifference.toFixed(2)} for ${days} working days compared to monthly membership.`;
  } else if (requires247Access) {
    recommendation = `Monthly pass recommended for 24/7 access requirement.`;
  }

  return {
    valid: true,
    workingDaysPerMonth: days,
    adjustedMonthlyCost,
    totalDayPassCost,
    preferMonthly,
    costDifference,
    recommendation
  };
}

export function calculateNomadSalaryParity({
  homeAnnualSalaryUsd = 100000,
  homeCostIndex = 100,
  targetCostIndex = 65,
  hasLocalTaxExemption = false
} = {}) {
  if (typeof homeAnnualSalaryUsd !== 'number' || homeAnnualSalaryUsd <= 0 || isNaN(homeAnnualSalaryUsd)) {
    return { valid: false, error: 'Home annual salary must be a positive number' };
  }
  if (typeof homeCostIndex !== 'number' || homeCostIndex <= 0 || isNaN(homeCostIndex)) {
    return { valid: false, error: 'Home cost index must be a positive number' };
  }
  if (typeof targetCostIndex !== 'number' || targetCostIndex <= 0 || isNaN(targetCostIndex)) {
    return { valid: false, error: 'Target cost index must be a positive number' };
  }

  const costRatio = targetCostIndex / homeCostIndex;
  const paritySalaryUsd = Math.round(homeAnnualSalaryUsd * costRatio * 100) / 100;
  const taxMultiplier = hasLocalTaxExemption ? 1.15 : 1.0;
  const effectiveDisposableSalaryUsd = Math.round(homeAnnualSalaryUsd * (1 / costRatio) * taxMultiplier * 100) / 100;
  const purchasingPowerGainPercent = Math.round(((1 / costRatio) * taxMultiplier - 1) * 100 * 10) / 10;

  let recommendation = `Moving to target destination yields a ${purchasingPowerGainPercent}% gain in real purchasing power.`;
  if (purchasingPowerGainPercent < 0) {
    recommendation = `Target location has higher living cost; requires salary of $${paritySalaryUsd.toLocaleString()} USD for parity.`;
  }

  return {
    valid: true,
    homeAnnualSalaryUsd,
    paritySalaryUsd,
    effectiveDisposableSalaryUsd,
    purchasingPowerGainPercent,
    recommendation
  };
}

export function calculateNomadInternetBackupRedundancyScore({
  primarySpeedMbps = 100,
  backupSpeedMbps = 0,
  hasMobileHotspot = false,
  hasUPSPowerBackup = false,
  requiredUptimePercent = 99.0
} = {}) {
  if (typeof primarySpeedMbps !== 'number' || primarySpeedMbps < 0 || isNaN(primarySpeedMbps)) {
    return { valid: false, error: 'Primary internet speed must be a non-negative number' };
  }
  if (typeof backupSpeedMbps !== 'number' || backupSpeedMbps < 0 || isNaN(backupSpeedMbps)) {
    return { valid: false, error: 'Backup internet speed must be a non-negative number' };
  }

  let score = Math.min(50, (primarySpeedMbps / 100) * 50);
  if (backupSpeedMbps > 0) {
    score += Math.min(25, (backupSpeedMbps / 50) * 25);
  }
  if (hasMobileHotspot) {
    score += 15;
  }
  if (hasUPSPowerBackup) {
    score += 10;
  }

  const redundancyScore = Math.round(Math.min(100, score) * 10) / 10;
  const riskTier = redundancyScore >= 80 ? 'Low Risk' : redundancyScore >= 50 ? 'Moderate Risk' : 'High Risk';

  let recommendation = 'Excellent redundancy: Dual connections with power & mobile backup ensure enterprise reliability.';
  if (redundancyScore < 50) {
    recommendation = 'High outage risk: Secure a secondary internet line or high-speed mobile hotspot before critical remote work.';
  } else if (!hasUPSPowerBackup) {
    recommendation = 'Good connectivity, but adding a portable power bank/UPS will prevent drops during local power surges.';
  }

  return {
    valid: true,
    primarySpeedMbps,
    backupSpeedMbps,
    hasMobileHotspot,
    hasUPSPowerBackup,
    requiredUptimePercent,
    redundancyScore,
    riskTier,
    recommendation
  };
}

export function calculateNomadTaxResidencyRiskScore({
  daysInCountry = 120,
  taxResidencyThresholdDays = 183,
  hasPermanentHome = false,
  hasLocalBankOrBusiness = false
} = {}) {
  if (typeof daysInCountry !== 'number' || daysInCountry < 0 || isNaN(daysInCountry)) {
    return { valid: false, error: 'Days in country must be a non-negative number' };
  }
  const days = Math.floor(daysInCountry);
  const threshold = typeof taxResidencyThresholdDays === 'number' && taxResidencyThresholdDays > 0 ? taxResidencyThresholdDays : 183;
  const remainingDays = Math.max(0, threshold - days);
  
  let riskPoints = 0;
  const dayRatio = days / threshold;
  if (dayRatio >= 1.0) riskPoints += 60;
  else if (dayRatio >= 0.75) riskPoints += 45;
  else if (dayRatio >= 0.50) riskPoints += 30;
  else riskPoints += 15;

  if (hasPermanentHome) riskPoints += 20;
  if (hasLocalBankOrBusiness) riskPoints += 20;

  const totalRiskScore = Math.min(100, riskPoints);
  const riskTier = totalRiskScore >= 75 ? 'HIGH' : totalRiskScore >= 45 ? 'MODERATE' : 'LOW';
  const isResidencyTriggered = days >= threshold;

  return {
    valid: true,
    daysInCountry: days,
    taxResidencyThresholdDays: threshold,
    remainingDaysBeforeThreshold: remainingDays,
    totalRiskScore,
    riskTier,
    isResidencyTriggered,
    recommendation: isResidencyTriggered
      ? `Tax residency threshold (${threshold} days) reached or exceeded. Consult an international tax professional.`
      : `Safe: ${remainingDays} days remaining before triggering the ${threshold}-day tax residency threshold.`
  };
}

export function calculateNomadRemoteWorkStipendRoi({
  monthlyStipendUsd = 500,
  monthlyCoworkingExpenseUsd = 300,
  monthlyEquipmentExpenseUsd = 100,
  durationMonths = 12
} = {}) {
  if (typeof monthlyStipendUsd !== 'number' || monthlyStipendUsd <= 0 || isNaN(monthlyStipendUsd)) {
    return { valid: false, error: 'Monthly stipend must be a positive number' };
  }
  if (typeof durationMonths !== 'number' || durationMonths <= 0 || isNaN(durationMonths)) {
    return { valid: false, error: 'Duration months must be a positive number' };
  }

  const coworking = typeof monthlyCoworkingExpenseUsd === 'number' && monthlyCoworkingExpenseUsd >= 0 ? monthlyCoworkingExpenseUsd : 0;
  const equipment = typeof monthlyEquipmentExpenseUsd === 'number' && monthlyEquipmentExpenseUsd >= 0 ? monthlyEquipmentExpenseUsd : 0;

  const totalMonthlyExpenses = coworking + equipment;
  const totalStipendProvided = Math.round(monthlyStipendUsd * durationMonths * 100) / 100;
  const totalExpensesIncurred = Math.round(totalMonthlyExpenses * durationMonths * 100) / 100;
  const netSurplusUsd = Math.round((totalStipendProvided - totalExpensesIncurred) * 100) / 100;
  const coveragePercentage = totalExpensesIncurred > 0 ? Math.round((totalStipendProvided / totalExpensesIncurred) * 100) : 100;

  const isFullyCovered = netSurplusUsd >= 0;

  return {
    valid: true,
    monthlyStipendUsd,
    totalMonthlyExpenses,
    durationMonths,
    totalStipendProvided,
    totalExpensesIncurred,
    netSurplusUsd,
    coveragePercentage,
    isFullyCovered,
    recommendation: isFullyCovered
      ? `Stipend fully covers expenses with a $${netSurplusUsd.toFixed(2)} surplus over ${durationMonths} months.`
      : `Expenses exceed stipend by $${Math.abs(netSurplusUsd).toFixed(2)} over ${durationMonths} months.`
  };
}

export function calculateNomadTimezoneOverlapAndConnectivity({
  teamTimezoneOffsetHours = -5,
  localTimezoneOffsetHours = 7,
  workStartHourLocal = 9,
  workEndHourLocal = 17,
  minOverlapHoursRequired = 3
} = {}) {
  if (typeof teamTimezoneOffsetHours !== 'number' || isNaN(teamTimezoneOffsetHours) || teamTimezoneOffsetHours < -12 || teamTimezoneOffsetHours > 14) {
    return { valid: false, error: 'Team timezone offset must be between -12 and +14 hours' };
  }
  if (typeof localTimezoneOffsetHours !== 'number' || isNaN(localTimezoneOffsetHours) || localTimezoneOffsetHours < -12 || localTimezoneOffsetHours > 14) {
    return { valid: false, error: 'Local timezone offset must be between -12 and +14 hours' };
  }

  const startHour = typeof workStartHourLocal === 'number' && workStartHourLocal >= 0 && workStartHourLocal < 24 ? workStartHourLocal : 9;
  const endHour = typeof workEndHourLocal === 'number' && workEndHourLocal > startHour && workEndHourLocal <= 24 ? workEndHourLocal : 17;
  const reqOverlap = typeof minOverlapHoursRequired === 'number' && minOverlapHoursRequired >= 0 ? minOverlapHoursRequired : 3;

  const localWorkDuration = endHour - startHour;
  
  // Calculate overlap between local work hours converted to UTC and team work hours (09:00 - 17:00 team time converted to UTC)
  // Local work hours in UTC: [startHour - localOffset, endHour - localOffset]
  // Team work hours in UTC: [9 - teamOffset, 17 - teamOffset]
  const localStartUtc = startHour - localTimezoneOffsetHours;
  const localEndUtc = endHour - localTimezoneOffsetHours;
  const teamStartUtc = 9 - teamTimezoneOffsetHours;
  const teamEndUtc = 17 - teamTimezoneOffsetHours;

  const overlapStart = Math.max(localStartUtc, teamStartUtc);
  const overlapEnd = Math.min(localEndUtc, teamEndUtc);
  const overlapHours = Math.max(0, Math.round((overlapEnd - overlapStart) * 10) / 10);
  const meetsRequirement = overlapHours >= reqOverlap;

  let recommendation = `Sufficient team overlap of ${overlapHours} hours/day between UTC${localTimezoneOffsetHours >= 0 ? '+' : ''}${localTimezoneOffsetHours} and UTC${teamTimezoneOffsetHours >= 0 ? '+' : ''}${teamTimezoneOffsetHours}.`;
  if (!meetsRequirement) {
    recommendation = `Only ${overlapHours} hours of overlap with HQ (UTC${teamTimezoneOffsetHours >= 0 ? '+' : ''}${teamTimezoneOffsetHours}). Consider adjusting local working hours to meet the ${reqOverlap}-hour requirement.`;
  }

  return {
    valid: true,
    teamTimezoneOffsetHours,
    localTimezoneOffsetHours,
    localWorkDurationHours: localWorkDuration,
    overlapHours,
    minOverlapHoursRequired: reqOverlap,
    meetsRequirement,
    recommendation
  };
}

export function calculateNomadCoworkingConnectivityScore({
  internetSpeedMbps = 100,
  deskErgonomicsRating = 4,
  backupPowerAvailable = true,
  quietCallBoothsAvailable = true,
  monthlyPassUsd = 150
} = {}) {
  if (typeof internetSpeedMbps !== 'number' || internetSpeedMbps < 0 || isNaN(internetSpeedMbps)) {
    return { valid: false, error: 'Internet speed must be a non-negative number' };
  }

  let score = 0;
  if (internetSpeedMbps >= 200) score += 35;
  else if (internetSpeedMbps >= 100) score += 28;
  else if (internetSpeedMbps >= 50) score += 20;
  else if (internetSpeedMbps >= 25) score += 10;

  const ergo = typeof deskErgonomicsRating === 'number' ? Math.min(5, Math.max(1, deskErgonomicsRating)) : 3;
  score += ergo * 5;

  if (backupPowerAvailable) score += 20;
  if (quietCallBoothsAvailable) score += 20;

  const finalScore = Math.min(100, Math.round(score));

  let suitabilityTier = 'HIGHLY_RECOMMENDED';
  if (finalScore < 50) suitabilityTier = 'BASIC_WIFI_ONLY';
  else if (finalScore < 75) suitabilityTier = 'SUITABLE_FOR_ASYNC';

  let recommendation = 'Excellent coworking hub for video calls & intensive remote work.';
  if (suitabilityTier === 'BASIC_WIFI_ONLY') {
    recommendation = 'Basic connectivity. Not recommended for video calls or power users without backup power.';
  } else if (suitabilityTier === 'SUITABLE_FOR_ASYNC') {
    recommendation = 'Good for async work; confirm backup generator status for critical calls.';
  }

  return {
    valid: true,
    internetSpeedMbps,
    deskErgonomicsRating: ergo,
    backupPowerAvailable: Boolean(backupPowerAvailable),
    quietCallBoothsAvailable: Boolean(quietCallBoothsAvailable),
    monthlyPassUsd: typeof monthlyPassUsd === 'number' && monthlyPassUsd > 0 ? monthlyPassUsd : 0,
    coworkingScore: finalScore,
    suitabilityTier,
    recommendation
  };
}

export function calculateNomadDestinationSafetyAndHealthcareScore({
  safetyScore = 3.5,
  healthcareQualityRating = 4.0,
  hospitalAccessMinutes = 25,
  emergencyServicesAvailable = true,
  speaksEnglishStaff = true
} = {}) {
  if (
    typeof safetyScore !== 'number' || isNaN(safetyScore) || safetyScore < 1 || safetyScore > 5 ||
    typeof healthcareQualityRating !== 'number' || isNaN(healthcareQualityRating) || healthcareQualityRating < 1 || healthcareQualityRating > 5
  ) {
    return { valid: false, error: 'Safety and healthcare ratings must be numbers between 1 and 5' };
  }

  if (typeof hospitalAccessMinutes !== 'number' || hospitalAccessMinutes < 0 || isNaN(hospitalAccessMinutes)) {
    return { valid: false, error: 'Hospital access minutes must be a non-negative number' };
  }

  let score = (safetyScore / 5) * 40 + (healthcareQualityRating / 5) * 35;
  if (emergencyServicesAvailable) score += 15;
  if (speaksEnglishStaff) score += 10;

  if (hospitalAccessMinutes > 45) score -= 10;
  else if (hospitalAccessMinutes <= 15) score += 5;

  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  let safetyTier = 'HIGH_SAFETY';
  if (finalScore < 60) safetyTier = 'HIGH_RISK_EVALUATION_NEEDED';
  else if (finalScore < 80) safetyTier = 'MODERATE_SAFETY';

  let recommendation = 'Destination meets top safety & emergency care standards for digital nomads.';
  if (safetyTier === 'HIGH_RISK_EVALUATION_NEEDED') {
    recommendation = 'Ensure full medical evacuation insurance and local emergency contacts before traveling.';
  } else if (safetyTier === 'MODERATE_SAFETY') {
    recommendation = 'Good baseline safety; register with local embassy and keep emergency contacts handy.';
  }

  return {
    valid: true,
    safetyScore,
    healthcareQualityRating,
    hospitalAccessMinutes,
    emergencyServicesAvailable: Boolean(emergencyServicesAvailable),
    speaksEnglishStaff: Boolean(speaksEnglishStaff),
    compositeSafetyScore: finalScore,
    safetyTier,
    recommendation
  };
}

export function calculateNomadCommunityEventEngagementIndex({
  upcomingEventsCount = 5,
  activeMeetupGroups = 3,
  monthlyActiveNomads = 120,
  meetupHostRating = 4.5
} = {}) {
  if (typeof upcomingEventsCount !== 'number' || upcomingEventsCount < 0 || isNaN(upcomingEventsCount)) {
    return { valid: false, error: 'Upcoming events count must be a non-negative number' };
  }
  if (typeof monthlyActiveNomads !== 'number' || monthlyActiveNomads < 0 || isNaN(monthlyActiveNomads)) {
    return { valid: false, error: 'Monthly active nomads must be a non-negative number' };
  }

  const groups = typeof activeMeetupGroups === 'number' && activeMeetupGroups >= 0 ? activeMeetupGroups : 0;
  const rating = typeof meetupHostRating === 'number' ? Math.min(5, Math.max(1, meetupHostRating)) : 4.0;

  let score = (upcomingEventsCount * 6) + (groups * 10) + Math.min(40, (monthlyActiveNomads / 5)) + (rating * 4);
  score = Math.min(100, Math.max(0, Math.round(score)));

  let communityTier = 'VIBRANT_COMMUNITY';
  if (score < 45) communityTier = 'QUIET_SPOT';
  else if (score < 75) communityTier = 'EMERGING_HUB';

  let recommendation = 'Vibrant nomad community with frequent meetups, workshops, and networking.';
  if (communityTier === 'QUIET_SPOT') {
    recommendation = 'Quiet destination: Limited formal nomad meetups. Great for focused deep work.';
  } else if (communityTier === 'EMERGING_HUB') {
    recommendation = 'Emerging nomad community: Moderate event density and social group activity.';
  }

  return {
    valid: true,
    upcomingEventsCount,
    activeMeetupGroups: groups,
    monthlyActiveNomads,
    meetupHostRating: rating,
    engagementScore: score,
    communityTier,
    recommendation
  };
}

export function calculateNomadCoworkingPassVsWorkspaceCost({
  monthlyDeskPriceUsd = 200,
  privateOfficePriceUsd = 450,
  stayMonths = 3,
  needsPrivateOffice = false
} = {}) {
  if (typeof monthlyDeskPriceUsd !== 'number' || monthlyDeskPriceUsd <= 0 || isNaN(monthlyDeskPriceUsd)) {
    return { valid: false, error: 'Monthly desk price must be a positive number' };
  }
  if (typeof stayMonths !== 'number' || stayMonths <= 0 || isNaN(stayMonths)) {
    return { valid: false, error: 'Stay months must be a positive number' };
  }

  const officePrice = typeof privateOfficePriceUsd === 'number' && privateOfficePriceUsd > 0 ? privateOfficePriceUsd : monthlyDeskPriceUsd * 2;
  const totalDeskCost = Math.round(monthlyDeskPriceUsd * stayMonths * 100) / 100;
  const totalOfficeCost = Math.round(officePrice * stayMonths * 100) / 100;

  const chosenCost = needsPrivateOffice ? totalOfficeCost : totalDeskCost;
  const priceDifference = Math.abs(totalOfficeCost - totalDeskCost);

  return {
    valid: true,
    monthlyDeskPriceUsd,
    privateOfficePriceUsd: officePrice,
    stayMonths,
    needsPrivateOffice,
    totalDeskCost,
    totalOfficeCost,
    chosenCost,
    priceDifference,
    recommendation: needsPrivateOffice
      ? `Private office chosen ($${totalOfficeCost.toFixed(2)} total over ${stayMonths} months). Premium focus & meeting privacy.`
      : `Hot desk chosen ($${totalDeskCost.toFixed(2)} total over ${stayMonths} months). Saves $${priceDifference.toFixed(2)} compared to private office.`
  };
}

export function calculateNomadTravelInsuranceCoverageScore({
  monthlyPremiumUsd = 45,
  medicalCoverageCapUsd = 100000,
  emergencyEvacuationCapUsd = 250000,
  includesAdventureSports = true,
  destinationRiskTier = 'LOW'
} = {}) {
  const premium = typeof monthlyPremiumUsd === 'number' && monthlyPremiumUsd > 0 ? monthlyPremiumUsd : 45;
  const medical = typeof medicalCoverageCapUsd === 'number' && medicalCoverageCapUsd > 0 ? medicalCoverageCapUsd : 100000;
  const evacuation = typeof emergencyEvacuationCapUsd === 'number' && emergencyEvacuationCapUsd > 0 ? emergencyEvacuationCapUsd : 250000;
  const sports = Boolean(includesAdventureSports);
  const tier = (destinationRiskTier || 'LOW').toUpperCase();

  let coverageScore = 50;
  if (medical >= 250000) coverageScore += 20;
  else if (medical >= 100000) coverageScore += 10;

  if (evacuation >= 500000) coverageScore += 20;
  else if (evacuation >= 250000) coverageScore += 10;

  if (sports) coverageScore += 10;

  let riskMultiplier = 1.0;
  if (tier === 'HIGH' || tier === 'CRITICAL') riskMultiplier = 1.5;
  else if (tier === 'MEDIUM') riskMultiplier = 1.2;

  const finalScore = Math.min(100, Math.round(coverageScore / riskMultiplier));
  const isAdequate = finalScore >= 65;

  return {
    valid: true,
    monthlyPremiumUsd: premium,
    medicalCoverageCapUsd: medical,
    emergencyEvacuationCapUsd: evacuation,
    includesAdventureSports: sports,
    destinationRiskTier: tier,
    coverageScore: finalScore,
    isAdequate,
    recommendation: isAdequate
      ? `Insurance policy provides robust coverage (${finalScore}/100) for digital nomads in ${tier} risk destinations.`
      : `Coverage score (${finalScore}/100) is sub-optimal for ${tier} risk destination. Upgrade medical or evacuation limits.`
  };
}

export function calculateNomadWorkspaceErgonomicsIndex({
  dualMonitorAvailable = false,
  standingDeskAvailable = false,
  chairErgonomicRating = 3,
  naturalLightRating = 3,
  noiseDecibels = 45
} = {}) {
  const chair = typeof chairErgonomicRating === 'number' ? Math.max(1, Math.min(5, chairErgonomicRating)) : 3;
  const light = typeof naturalLightRating === 'number' ? Math.max(1, Math.min(5, naturalLightRating)) : 3;
  const noise = typeof noiseDecibels === 'number' && noiseDecibels >= 0 ? noiseDecibels : 45;

  let score = 30;
  if (chair >= 4) score += 25;
  else if (chair === 3) score += 15;

  if (light >= 4) score += 15;
  else if (light === 3) score += 10;

  if (dualMonitorAvailable) score += 15;
  if (standingDeskAvailable) score += 15;

  if (noise <= 40) score += 15;
  else if (noise <= 55) score += 10;
  else if (noise > 70) score -= 15;

  const finalScore = Math.max(0, Math.min(100, score));
  let tier = 'MODERATE';
  if (finalScore >= 80) tier = 'EXCELLENT';
  else if (finalScore < 50) tier = 'POOR';

  return {
    valid: true,
    ergonomicsScore: finalScore,
    tier,
    chairErgonomicRating: chair,
    naturalLightRating: light,
    noiseDecibels: noise,
    dualMonitorAvailable: Boolean(dualMonitorAvailable),
    standingDeskAvailable: Boolean(standingDeskAvailable),
    recommendation: tier === 'EXCELLENT'
      ? `Workspace is highly ergonomic (${finalScore}/100) and well-suited for long-term productivity.`
      : tier === 'MODERATE'
      ? `Workspace has adequate ergonomics (${finalScore}/100). Consider improving seating or lighting for full-day work.`
      : `Workspace ergonomics are poor (${finalScore}/100). Upgrade chair, desk configuration, or reduce ambient noise.`
  };
}

export function calculateNomadCoworkingCommunityDensityScore({
  coworkingCount = 10,
  totalNomadPopulation = 500,
  cityAreaSqKm = 100
} = {}) {
  if (typeof coworkingCount !== 'number' || coworkingCount < 0 || isNaN(coworkingCount)) {
    return { valid: false, error: 'Coworking space count must be a non-negative number' };
  }
  if (typeof totalNomadPopulation !== 'number' || totalNomadPopulation <= 0 || isNaN(totalNomadPopulation)) {
    return { valid: false, error: 'Total nomad population must be a positive number' };
  }
  if (typeof cityAreaSqKm !== 'number' || cityAreaSqKm <= 0 || isNaN(cityAreaSqKm)) {
    return { valid: false, error: 'City area sq km must be a positive number' };
  }

  const coworkingPer100Nomads = Math.round((coworkingCount / totalNomadPopulation) * 100 * 100) / 100;
  const coworkingPer10SqKm = Math.round((coworkingCount / cityAreaSqKm) * 10 * 100) / 100;

  let densityScore = Math.min(100, Math.round((coworkingPer100Nomads * 35) + (coworkingPer10SqKm * 15)));
  densityScore = Math.max(0, densityScore);

  let densityTier = 'MODERATE_DENSITY';
  if (densityScore >= 75) densityTier = 'HIGH_DENSITY';
  else if (densityScore < 40) densityTier = 'LOW_DENSITY';

  return {
    valid: true,
    coworkingCount,
    totalNomadPopulation,
    cityAreaSqKm,
    coworkingPer100Nomads,
    coworkingPer10SqKm,
    densityScore,
    densityTier,
    recommendation: densityTier === 'HIGH_DENSITY'
      ? `Thriving digital nomad hub with high coworking density (${coworkingPer100Nomads} per 100 nomads).`
      : densityTier === 'MODERATE_DENSITY'
      ? `Balanced coworking coverage (${coworkingPer100Nomads} per 100 nomads).`
      : `Emerging destination with limited coworking infrastructure (${coworkingPer100Nomads} per 100 nomads).`
  };
}

export function calculateNomadColivingBudgetOptimization({
  baseMonthlyColivingCost = 1200,
  durationDays = 30,
  includeCoworkingPass = true,
  communityRating = 4.5,
  highSpeedWifiMbps = 150
} = {}) {
  if (typeof baseMonthlyColivingCost !== 'number' || baseMonthlyColivingCost <= 0 || isNaN(baseMonthlyColivingCost)) {
    return { valid: false, error: 'Base monthly coliving cost must be a positive number' };
  }
  if (typeof durationDays !== 'number' || durationDays <= 0 || isNaN(durationDays)) {
    return { valid: false, error: 'Duration days must be a positive number' };
  }

  const dailyRate = baseMonthlyColivingCost / 30;
  const coworkingPerkValue = includeCoworkingPass ? 150 : 0;
  const wifiBonus = highSpeedWifiMbps >= 100 ? 1.1 : highSpeedWifiMbps >= 50 ? 1.0 : 0.9;
  
  const grossCost = dailyRate * durationDays;
  const netEffectiveMonthlyCost = Math.max(0, baseMonthlyColivingCost - coworkingPerkValue);
  const dailyEffectiveCost = Math.round((grossCost / durationDays) * 100) / 100;
  
  const communityValueScore = Math.min(100, Math.round((communityRating / 5.0) * 80 + (wifiBonus * 20)));

  let optimizationTier = 'BALANCED_COLIVING';
  if (dailyEffectiveCost <= 35 && communityValueScore >= 80) optimizationTier = 'PRIME_VALUE_COLIVING';
  else if (dailyEffectiveCost > 70) optimizationTier = 'PREMIUM_COLIVING';

  return {
    valid: true,
    baseMonthlyColivingCost,
    durationDays,
    dailyEffectiveCost,
    netEffectiveMonthlyCost,
    totalGrossCost: Math.round(grossCost * 100) / 100,
    communityValueScore,
    optimizationTier,
    recommendation: optimizationTier === 'PRIME_VALUE_COLIVING'
      ? `High-value coliving setup ($${dailyEffectiveCost}/day) with top community score (${communityValueScore}/100).`
      : optimizationTier === 'PREMIUM_COLIVING'
      ? `Premium coliving option ($${dailyEffectiveCost}/day). Consider shared passes or longer stay for discounts.`
      : `Standard coliving choice ($${dailyEffectiveCost}/day) offering balanced workspace amenities.`
  };
}

export function calculateNomadColivingWorkstationHealthScore({
  wifiSpeedMbps = 150,
  chairErgonomicsRating = 4,
  quietEnvironment = true,
  backupPowerAvailable = true,
  monitorAvailable = false
} = {}) {
  const wifi = Math.max(0, typeof wifiSpeedMbps === 'number' ? wifiSpeedMbps : 0);
  const chair = typeof chairErgonomicsRating === 'number' ? Math.max(1, Math.min(5, chairErgonomicsRating)) : 3;

  let score = (chair / 5) * 40;
  if (wifi >= 200) score += 30;
  else if (wifi >= 100) score += 25;
  else if (wifi >= 50) score += 15;

  if (quietEnvironment) score += 15;
  if (backupPowerAvailable) score += 10;
  if (monitorAvailable) score += 5;

  const finalScore = Math.min(100, Math.round(score));
  const isWorkstationHealthy = finalScore >= 75;

  let healthTier = 'EXCELLENT_WORKSTATION';
  if (finalScore < 50) healthTier = 'SUB_OPTIMAL_WORKSTATION';
  else if (finalScore < 75) healthTier = 'GOOD_WORKSTATION';

  return {
    valid: true,
    wifiSpeedMbps: wifi,
    chairErgonomicsRating: chair,
    quietEnvironment: Boolean(quietEnvironment),
    backupPowerAvailable: Boolean(backupPowerAvailable),
    monitorAvailable: Boolean(monitorAvailable),
    workstationHealthScore: finalScore,
    isWorkstationHealthy,
    healthTier,
    recommendation: isWorkstationHealthy
      ? `Workstation health score (${finalScore}/100) meets top remote work productivity standards.`
      : 'Upgrade chair ergonomics or secure backup Wi-Fi/power for optimal remote work.'
  };
}

export function calculateNomadRemoteWorkstationPowerBackupScore({
  gridReliabilityRating = 4,
  outageFrequencyMonthly = 2,
  hasGeneratorOrUps = true,
  laptopBatteryHours = 6,
  powerStationCapacityWattHours = 250
} = {}) {
  const rating = typeof gridReliabilityRating === 'number' ? Math.min(5, Math.max(1, gridReliabilityRating)) : 3;
  const outages = Math.max(0, typeof outageFrequencyMonthly === 'number' ? outageFrequencyMonthly : 0);
  const batteryHours = Math.max(1, typeof laptopBatteryHours === 'number' ? laptopBatteryHours : 4);
  const powerStationWh = Math.max(0, typeof powerStationCapacityWattHours === 'number' ? powerStationCapacityWattHours : 0);

  let gridScore = rating * 12;
  let outagePenalty = Math.min(30, outages * 5);
  let backupBonus = hasGeneratorOrUps ? 25 : 0;
  let powerStationBonus = Math.min(15, Math.round(powerStationWh / 50) * 3);

  const powerScore = Math.min(100, Math.max(0, Math.round(gridScore - outagePenalty + backupBonus + powerStationBonus)));
  const totalBackupHoursAvailable = Math.round((batteryHours + (powerStationWh / 45)) * 10) / 10;

  let riskTier = 'EXCELLENT_POWER_STABILITY';
  if (powerScore < 45) riskTier = 'HIGH_OUTAGE_RISK';
  else if (powerScore < 70) riskTier = 'MODERATE_OUTAGE_RISK';

  return {
    valid: true,
    gridReliabilityRating: rating,
    outageFrequencyMonthly: outages,
    hasGeneratorOrUps: Boolean(hasGeneratorOrUps),
    laptopBatteryHours: batteryHours,
    powerStationCapacityWattHours: powerStationWh,
    totalBackupHoursAvailable,
    powerScore,
    riskTier,
    recommendation: riskTier === 'EXCELLENT_POWER_STABILITY'
      ? `Workstation has high power resilience (${powerScore}/100) with ~${totalBackupHoursAvailable}h uptime capacity.`
      : riskTier === 'MODERATE_OUTAGE_RISK'
      ? `Moderate outage risk (${powerScore}/100). Keep laptop charged and carry a portable power bank.`
      : `High outage risk (${powerScore}/100). Dedicated UPS or coliving relocation strongly recommended.`
  };
}

export function calculateNomadEsimRoamingDataPackageRoi({
  durationDays = 30,
  estimatedGbNeeded = 15,
  esimPackagePriceUsd = 35.0,
  localSimPriceUsd = 15.0,
  airportSimMarkupPct = 25
} = {}) {
  if (typeof durationDays !== 'number' || durationDays <= 0 || !Number.isInteger(durationDays)) {
    return { valid: false, error: 'Duration days must be a positive integer' };
  }
  if (typeof estimatedGbNeeded !== 'number' || estimatedGbNeeded <= 0) {
    return { valid: false, error: 'Estimated GB needed must be a positive number' };
  }
  if (typeof esimPackagePriceUsd !== 'number' || esimPackagePriceUsd <= 0 || typeof localSimPriceUsd !== 'number' || localSimPriceUsd <= 0) {
    return { valid: false, error: 'SIM package prices must be positive numbers' };
  }

  const esimCostPerGb = Math.round((esimPackagePriceUsd / estimatedGbNeeded) * 100) / 100;
  const localSimCostPerGb = Math.round((localSimPriceUsd / estimatedGbNeeded) * 100) / 100;
  const priceDifferenceUsd = Math.round((esimPackagePriceUsd - localSimPriceUsd) * 100) / 100;
  const isEsimCostEffective = priceDifferenceUsd <= 15.0;

  let recommendation = 'Local SIM card offers lower total cost.';
  if (isEsimCostEffective) {
    recommendation = `eSIM recommended: premium of \$${priceDifferenceUsd.toFixed(2)} is worth airport arrival convenience and zero physical SIM swap.`;
  } else {
    recommendation = `Local SIM recommended: save \$${priceDifferenceUsd.toFixed(2)} compared to global eSIM package.`;
  }

  return {
    valid: true,
    durationDays,
    estimatedGbNeeded,
    esimPackagePriceUsd,
    localSimPriceUsd,
    esimCostPerGb,
    localSimCostPerGb,
    priceDifferenceUsd,
    isEsimCostEffective,
    recommendation
  };
}

export function calculateNomadMultiCityItineraryBudget({
  cities = [],
  contingencyPercentage = 10
} = {}) {
  if (!Array.isArray(cities) || cities.length === 0) {
    throw new Error('Cities array must contain at least one destination.');
  }

  let totalDurationDays = 0;
  let totalAccommodationAndLivingCost = 0;
  let totalTransitFlightCost = 0;
  let mostExpensiveCity = null;
  let maxCityMonthlyCost = -1;
  let mostAffordableCity = null;
  let minCityMonthlyCost = Infinity;

  for (const item of cities) {
    const { city, durationDays, estimatedMonthlyCost, flightToNextCost = 0 } = item;
    if (!city || typeof durationDays !== 'number' || durationDays <= 0 || typeof estimatedMonthlyCost !== 'number' || estimatedMonthlyCost < 0) {
      throw new Error('Invalid city parameters. Each city must have a valid name, positive durationDays, and non-negative estimatedMonthlyCost.');
    }
    const durationMonths = durationDays / 30;
    const livingCost = estimatedMonthlyCost * durationMonths;

    totalDurationDays += durationDays;
    totalAccommodationAndLivingCost += livingCost;
    totalTransitFlightCost += (typeof flightToNextCost === 'number' && flightToNextCost > 0) ? flightToNextCost : 0;

    if (estimatedMonthlyCost > maxCityMonthlyCost) {
      maxCityMonthlyCost = estimatedMonthlyCost;
      mostExpensiveCity = city;
    }
    if (estimatedMonthlyCost < minCityMonthlyCost) {
      minCityMonthlyCost = estimatedMonthlyCost;
      mostAffordableCity = city;
    }
  }

  totalAccommodationAndLivingCost = Math.round(totalAccommodationAndLivingCost * 100) / 100;
  totalTransitFlightCost = Math.round(totalTransitFlightCost * 100) / 100;

  const baseCost = totalAccommodationAndLivingCost + totalTransitFlightCost;
  const safeContingencyPct = Math.max(0, contingencyPercentage);
  const contingencyAmount = Math.round((baseCost * (safeContingencyPct / 100)) * 100) / 100;
  const grandTotalCost = Math.round((baseCost + contingencyAmount) * 100) / 100;
  const averageDailyExpense = totalDurationDays > 0 ? Math.round((grandTotalCost / totalDurationDays) * 100) / 100 : 0;

  return {
    valid: true,
    totalCities: cities.length,
    totalDurationDays,
    totalAccommodationAndLivingCost,
    totalTransitFlightCost,
    contingencyAmount,
    grandTotalCost,
    averageDailyExpense,
    mostExpensiveCity,
    mostAffordableCity
  };
}

export function calculateNomadRemoteWorkConnectivityScore({
  wifiDownloadMbps = 50,
  wifiUploadMbps = 20,
  pingLatencyMs = 25,
  coworkingSpacesCount = 5,
  powerOutageFrequencyMonthly = 0,
  timeZoneOverlapHoursWithHQ = 6
} = {}) {
  if (typeof wifiDownloadMbps !== 'number' || wifiDownloadMbps < 0 ||
      typeof wifiUploadMbps !== 'number' || wifiUploadMbps < 0 ||
      typeof pingLatencyMs !== 'number' || pingLatencyMs < 0) {
    return { valid: false, error: 'Speed and ping parameters must be non-negative numbers' };
  }

  let downloadScore = Math.min(35, Math.round((wifiDownloadMbps / 100) * 35));
  let uploadScore = Math.min(25, Math.round((wifiUploadMbps / 50) * 25));
  let latencyScore = pingLatencyMs <= 30 ? 20 : pingLatencyMs <= 80 ? 12 : pingLatencyMs <= 150 ? 5 : 0;
  let coworkingScore = Math.min(10, (coworkingSpacesCount || 0) * 2);
  let timeZoneScore = Math.min(10, (timeZoneOverlapHoursWithHQ || 0) * 1.5);
  let outagePenalty = Math.min(30, (powerOutageFrequencyMonthly || 0) * 6);

  const rawScore = downloadScore + uploadScore + latencyScore + coworkingScore + timeZoneScore - outagePenalty;
  const connectivityScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  let connectivityTier = 'OPTIMAL_NOMAD_HUB';
  if (connectivityScore < 40) connectivityTier = 'RISKY_INFRASTRUCTURE';
  else if (connectivityScore < 70) connectivityTier = 'VIABLE_WITH_BACKUP';

  return {
    valid: true,
    wifiDownloadMbps,
    wifiUploadMbps,
    pingLatencyMs,
    coworkingSpacesCount,
    powerOutageFrequencyMonthly,
    timeZoneOverlapHoursWithHQ,
    connectivityScore,
    connectivityTier,
    recommendation: connectivityTier === 'OPTIMAL_NOMAD_HUB'
      ? `Destination has excellent remote work infrastructure (${connectivityScore}/100 score).`
      : connectivityTier === 'VIABLE_WITH_BACKUP'
      ? `Viable connectivity (${connectivityScore}/100). Backup mobile hotspot or SIM recommended.`
      : `High infrastructure risk (${connectivityScore}/100). Coliving workspace or power/wifi backup required.`
  };
}

export function calculateNomadColivingCommunitySafetyRating({
  verifiedCommunityMembersCount = 20,
  hasKeycardAccess = true,
  has24SevenSecurity = false,
  verifiedReviewsScore = 4.5,
  neighborhoodSafetyIndex = 80
} = {}) {
  if (typeof verifiedReviewsScore !== 'number' || verifiedReviewsScore < 1 || verifiedReviewsScore > 5) {
    return { valid: false, error: 'Verified reviews score must be a number between 1 and 5' };
  }
  if (typeof neighborhoodSafetyIndex !== 'number' || neighborhoodSafetyIndex < 0 || neighborhoodSafetyIndex > 100) {
    return { valid: false, error: 'Neighborhood safety index must be a number between 0 and 100' };
  }

  let baseScore = (verifiedReviewsScore / 5) * 40 + (neighborhoodSafetyIndex / 100) * 30;
  if (hasKeycardAccess) baseScore += 15;
  if (has24SevenSecurity) baseScore += 15;
  if (verifiedCommunityMembersCount >= 10) baseScore += 5;

  const safetyScore = Math.min(100, Math.max(0, Math.round(baseScore)));

  let safetyTier = 'HIGHLY_SAFE_COLIVING';
  if (safetyScore < 50) safetyTier = 'ELEVATED_SAFETY_RISK';
  else if (safetyScore < 75) safetyTier = 'MODERATE_SAFETY';

  return {
    valid: true,
    verifiedCommunityMembersCount,
    hasKeycardAccess: Boolean(hasKeycardAccess),
    has24SevenSecurity: Boolean(has24SevenSecurity),
    verifiedReviewsScore,
    neighborhoodSafetyIndex,
    safetyScore,
    safetyTier,
    recommendation: safetyTier === 'HIGHLY_SAFE_COLIVING'
      ? `Coliving space demonstrates top-tier security and community safety (${safetyScore}/100 score).`
      : safetyTier === 'MODERATE_SAFETY'
      ? `Moderate coliving safety rating (${safetyScore}/100). Verify lock status and emergency contact procedures.`
      : `Elevated safety risk (${safetyScore}/100). Recommend verified alternative space or extra security precautions.`
  };
}

export function calculateNomadDestinationQualityOfLifeIndex({
  internetSpeedMbps = 50,
  safetyRating = 4.0,
  healthcareRating = 4.0,
  monthlyCostUsd = 2000,
  communityHubScore = 75
} = {}) {
  if (typeof internetSpeedMbps !== 'number' || internetSpeedMbps < 0) {
    return { valid: false, error: 'Internet speed must be a non-negative number' };
  }
  if (typeof safetyRating !== 'number' || safetyRating < 1 || safetyRating > 5) {
    return { valid: false, error: 'Safety rating must be a number between 1 and 5' };
  }

  const internetSubScore = Math.min(100, Math.round((internetSpeedMbps / 100) * 100));
  const safetySubScore = Math.min(100, Math.round((safetyRating / 5) * 100));
  const healthcareSubScore = Math.min(100, Math.round((Math.min(5, Math.max(1, healthcareRating)) / 5) * 100));
  const affordabilitySubScore = Math.min(100, Math.max(20, Math.round(100 - Math.max(0, monthlyCostUsd - 1500) / 25)));
  const communitySubScore = Math.min(100, Math.max(0, Math.round(communityHubScore)));

  const compositeQualityOfLifeScore = Math.round(
    internetSubScore * 0.25 +
    safetySubScore * 0.25 +
    affordabilitySubScore * 0.20 +
    healthcareSubScore * 0.15 +
    communitySubScore * 0.15
  );

  let qolTier = 'MODERATE_QUALITY_OF_LIFE';
  if (compositeQualityOfLifeScore >= 80) qolTier = 'PRIME_NOMAD_DESTINATION';
  else if (compositeQualityOfLifeScore < 60) qolTier = 'CHALLENGING_INFRASTRUCTURE';

  return {
    valid: true,
    compositeQualityOfLifeScore,
    qolTier,
    breakdown: {
      internetSubScore,
      safetySubScore,
      affordabilitySubScore,
      healthcareSubScore,
      communitySubScore
    },
    recommendation: qolTier === 'PRIME_NOMAD_DESTINATION'
      ? `Top-tier digital nomad location (${compositeQualityOfLifeScore}/100 QoL score). Excellent connectivity, safety, and community.`
      : qolTier === 'CHALLENGING_INFRASTRUCTURE'
      ? `Location score (${compositeQualityOfLifeScore}/100) highlights potential connectivity, safety, or cost constraints.`
      : `Balanced nomad destination with solid infrastructure (${compositeQualityOfLifeScore}/100 QoL score).`
  };
}

export function calculateNomadHealthcareAccessAndEvacuationIndex({
  hospitalDensityPer100k = 5.0,
  englishDoctorRatio = 0.8,
  evacuationInsuranceCovered = true,
  emergencyResponseTimeMins = 15
} = {}) {
  if (typeof hospitalDensityPer100k !== 'number' || hospitalDensityPer100k < 0) {
    return { valid: false, error: 'Hospital density per 100k must be a non-negative number' };
  }

  const densityScore = Math.min(40, Math.round((hospitalDensityPer100k / 10) * 40));
  const englishScore = Math.min(30, Math.round(Math.max(0, Math.min(1, englishDoctorRatio)) * 30));
  const responseScore = emergencyResponseTimeMins <= 10 ? 30 : emergencyResponseTimeMins <= 25 ? 20 : 10;

  let totalScore = densityScore + englishScore + responseScore;
  if (!evacuationInsuranceCovered) {
    totalScore = Math.max(0, totalScore - 25);
  }

  const medicalAccessScore = Math.min(100, Math.max(0, Math.round(totalScore)));

  let medicalTier = 'MODERATE_MEDICAL_RESILIENCE';
  if (medicalAccessScore >= 80) medicalTier = 'PREMIUM_MEDICAL_ACCESS';
  else if (medicalAccessScore < 50) medicalTier = 'HIGH_EVACUATION_RISK';

  return {
    valid: true,
    hospitalDensityPer100k,
    englishDoctorRatio,
    evacuationInsuranceCovered: Boolean(evacuationInsuranceCovered),
    emergencyResponseTimeMins,
    medicalAccessScore,
    medicalTier,
    recommendation: medicalTier === 'PREMIUM_MEDICAL_ACCESS'
      ? `Top-tier medical infrastructure (${medicalAccessScore}/100 score) with rapid emergency response.`
      : medicalTier === 'MODERATE_MEDICAL_RESILIENCE'
      ? `Adequate healthcare access (${medicalAccessScore}/100 score). Medical evacuation insurance recommended.`
      : `High medical risk area (${medicalAccessScore}/100 score). Dedicated medical evacuation coverage required.`
  };
}

export function calculateNomadDigitalNomadVisaEligibilityScore({
  monthlyIncomeUsd = 3000,
  minRequiredIncomeUsd = 2500,
  bankSavingsBalanceUsd = 10000,
  hasRemoteProof = true,
  hasHealthInsurance = true
} = {}) {
  if (typeof monthlyIncomeUsd !== 'number' || monthlyIncomeUsd < 0) {
    return { valid: false, error: 'Monthly income must be a non-negative number' };
  }
  if (typeof minRequiredIncomeUsd !== 'number' || minRequiredIncomeUsd <= 0) {
    return { valid: false, error: 'Minimum required income must be a positive number' };
  }

  const incomeRatio = monthlyIncomeUsd / minRequiredIncomeUsd;
  const incomePoints = Math.min(45, Math.round(incomeRatio * 35));
  const proofPoints = hasRemoteProof ? 25 : 0;
  const insurancePoints = hasHealthInsurance ? 15 : 0;
  const savingsPoints = bankSavingsBalanceUsd >= 5000 ? 15 : bankSavingsBalanceUsd >= 2500 ? 10 : 0;

  const eligibilityScore = Math.min(100, Math.max(0, incomePoints + proofPoints + insurancePoints + savingsPoints));

  let eligibilityTier = 'QUALIFIED_FOR_VISA';
  if (eligibilityScore < 50 || monthlyIncomeUsd < minRequiredIncomeUsd || !hasRemoteProof) {
    eligibilityTier = 'INELIGIBLE_FOR_VISA';
  } else if (eligibilityScore < 75) {
    eligibilityTier = 'BORDERLINE_ELIGIBILITY';
  }

  return {
    valid: true,
    monthlyIncomeUsd,
    minRequiredIncomeUsd,
    incomeCoverageRatio: Math.round(incomeRatio * 100) / 100,
    hasRemoteProof: Boolean(hasRemoteProof),
    hasHealthInsurance: Boolean(hasHealthInsurance),
    eligibilityScore,
    eligibilityTier,
    recommendation: eligibilityTier === 'QUALIFIED_FOR_VISA'
      ? `Strong visa application profile (${eligibilityScore}/100 eligibility score). Income exceeds threshold by ${Math.round((incomeRatio - 1) * 100)}%.`
      : eligibilityTier === 'BORDERLINE_ELIGIBILITY'
      ? `Borderline visa eligibility (${eligibilityScore}/100 score). Boost bank savings or secure comprehensive health coverage before applying.`
      : `Ineligible for digital nomad visa (${eligibilityScore}/100 score). Income must meet minimum threshold of $${minRequiredIncomeUsd} with remote work proof.`
  };
}

export function calculateNomadColivingMonthlyLivingCostIndex({
  monthlyRentUsd = 1200,
  coworkingPassUsd = 200,
  estimatedDailyFoodUsd = 25,
  transitPassUsd = 50,
  durationMonths = 1,
  securityDepositMonths = 1
} = {}) {
  if (typeof monthlyRentUsd !== 'number' || monthlyRentUsd <= 0 || isNaN(monthlyRentUsd)) {
    return { valid: false, error: 'Monthly rent must be a positive number' };
  }
  if (typeof durationMonths !== 'number' || durationMonths <= 0 || !Number.isInteger(durationMonths)) {
    return { valid: false, error: 'Duration months must be a positive integer' };
  }

  const rent = Math.round(monthlyRentUsd * 100) / 100;
  const coworking = typeof coworkingPassUsd === 'number' && coworkingPassUsd > 0 ? coworkingPassUsd : 0;
  const food = typeof estimatedDailyFoodUsd === 'number' && estimatedDailyFoodUsd > 0 ? estimatedDailyFoodUsd * 30 : 0;
  const transit = typeof transitPassUsd === 'number' && transitPassUsd > 0 ? transitPassUsd : 0;

  const totalMonthlyLivingCostUsd = Math.round((rent + coworking + food + transit) * 100) / 100;
  const totalStayCostUsd = Math.round(totalMonthlyLivingCostUsd * durationMonths * 100) / 100;
  const depositAmountUsd = Math.round(rent * (securityDepositMonths || 0) * 100) / 100;
  const upfrontCapitalRequiredUsd = Math.round((rent + depositAmountUsd + coworking + transit) * 100) / 100;
  const dailyBurnRateUsd = Math.round((totalMonthlyLivingCostUsd / 30) * 100) / 100;

  let hubCostTier = 'MODERATE_HUB';
  if (totalMonthlyLivingCostUsd > 2500) hubCostTier = 'PREMIUM_EXPENSIVE_HUB';
  else if (totalMonthlyLivingCostUsd < 1200) hubCostTier = 'AFFORDABLE_NOMAD_HUB';

  return {
    valid: true,
    monthlyRentUsd: rent,
    coworkingPassUsd: coworking,
    monthlyFoodEstimateUsd: Math.round(food * 100) / 100,
    transitPassUsd: transit,
    totalMonthlyLivingCostUsd,
    durationMonths,
    totalStayCostUsd,
    depositAmountUsd,
    upfrontCapitalRequiredUsd,
    dailyBurnRateUsd,
    hubCostTier,
    recommendation: hubCostTier === 'AFFORDABLE_NOMAD_HUB'
      ? `Affordable nomad hub! Estimated monthly living cost is $${totalMonthlyLivingCostUsd.toFixed(2)} ($${dailyBurnRateUsd.toFixed(2)}/day).`
      : hubCostTier === 'MODERATE_HUB'
      ? `Balanced nomad destination ($${totalMonthlyLivingCostUsd.toFixed(2)}/month). Upfront capital needed: $${upfrontCapitalRequiredUsd.toFixed(2)}.`
      : `Premium expensive hub ($${totalMonthlyLivingCostUsd.toFixed(2)}/month). High daily burn rate ($${dailyBurnRateUsd.toFixed(2)}/day).`
  };
}

export function calculateNomadColivingSpaceReviewAuthenticityScore({
  verifiedStayReviewsCount = 15,
  unverifiedReviewsCount = 3,
  averageRating = 4.7,
  ratingStandardDeviation = 0.4,
  accountAgeDaysAverage = 180
} = {}) {
  if (typeof verifiedStayReviewsCount !== 'number' || verifiedStayReviewsCount < 0) {
    return { valid: false, error: 'Verified stay reviews count must be a non-negative number' };
  }
  if (typeof unverifiedReviewsCount !== 'number' || unverifiedReviewsCount < 0) {
    return { valid: false, error: 'Unverified reviews count must be a non-negative number' };
  }

  const totalReviews = verifiedStayReviewsCount + unverifiedReviewsCount;
  if (totalReviews === 0) {
    return { valid: false, error: 'Total reviews count cannot be zero' };
  }

  const verifiedRatio = verifiedStayReviewsCount / totalReviews;
  const rating = typeof averageRating === 'number' ? Math.min(5, Math.max(1, averageRating)) : 4.5;
  const stdDev = typeof ratingStandardDeviation === 'number' && ratingStandardDeviation >= 0 ? ratingStandardDeviation : 0.4;
  const avgAge = typeof accountAgeDaysAverage === 'number' && accountAgeDaysAverage >= 0 ? accountAgeDaysAverage : 100;

  let verifiedPoints = verifiedRatio * 45;
  let agePoints = Math.min(25, (avgAge / 180) * 25);
  let variancePoints = stdDev > 0.1 && stdDev < 1.5 ? 20 : 5; // extreme low/high stdDev suspicious
  let ratingPoints = rating >= 4.9 && verifiedRatio < 0.3 ? 5 : 10;

  const authenticityScore = Math.min(100, Math.max(0, Math.round(verifiedPoints + agePoints + variancePoints + ratingPoints)));

  let trustTier = 'VERIFIED_HIGH_AUTHENTICITY';
  if (authenticityScore < 50 || verifiedRatio < 0.4) {
    trustTier = 'SUSPICIOUS_REVIEW_PATTERN';
  } else if (authenticityScore < 75) {
    trustTier = 'MODERATE_REVIEW_TRUST';
  }

  return {
    valid: true,
    totalReviews,
    verifiedStayReviewsCount,
    unverifiedReviewsCount,
    verifiedRatio: Math.round(verifiedRatio * 100) / 100,
    averageRating: rating,
    authenticityScore,
    trustTier,
    recommendation: trustTier === 'VERIFIED_HIGH_AUTHENTICITY'
      ? `High review authenticity (${authenticityScore}/100 score, ${Math.round(verifiedRatio * 100)}% verified stay proof).`
      : trustTier === 'SUSPICIOUS_REVIEW_PATTERN'
      ? `Suspicious review pattern (${authenticityScore}/100 score). Low proportion of verified stay receipts.`
      : `Moderate review trust level (${authenticityScore}/100 score). Check individual nomad stay feedback.`
  };
}

export function calculateNomadColivingReservationDepositRefundAudit({
  securityDepositUsd = 500,
  daysNoticeGivenBeforeCheckin = 14,
  requiredNoticeDaysForFullRefund = 30,
  damageOrCleaningDeductionUsd = 0,
  cancellationFeePercent = 10
} = {}) {
  if (typeof securityDepositUsd !== 'number' || securityDepositUsd <= 0 || isNaN(securityDepositUsd)) {
    return { valid: false, error: 'Security deposit must be a positive number' };
  }
  if (typeof daysNoticeGivenBeforeCheckin !== 'number' || daysNoticeGivenBeforeCheckin < 0 || isNaN(daysNoticeGivenBeforeCheckin)) {
    return { valid: false, error: 'Days notice given must be a non-negative number' };
  }

  const reqNotice = typeof requiredNoticeDaysForFullRefund === 'number' && requiredNoticeDaysForFullRefund > 0 ? requiredNoticeDaysForFullRefund : 30;
  const damageFee = typeof damageOrCleaningDeductionUsd === 'number' && damageOrCleaningDeductionUsd >= 0 ? damageOrCleaningDeductionUsd : 0;
  const feePct = typeof cancellationFeePercent === 'number' && cancellationFeePercent >= 0 && cancellationFeePercent <= 100 ? cancellationFeePercent : 10;

  const meetsFullNotice = daysNoticeGivenBeforeCheckin >= reqNotice;
  
  let noticePenaltyUsd = 0;
  if (!meetsFullNotice) {
    const noticeShortfallRatio = (reqNotice - daysNoticeGivenBeforeCheckin) / reqNotice;
    noticePenaltyUsd = Math.round((securityDepositUsd * (feePct / 100) * noticeShortfallRatio) * 100) / 100;
  }

  const totalDeductionsUsd = Math.min(securityDepositUsd, Math.round((noticePenaltyUsd + damageFee) * 100) / 100);
  const netRefundUsd = Math.max(0, Math.round((securityDepositUsd - totalDeductionsUsd) * 100) / 100);
  const refundPercentage = Math.round((netRefundUsd / securityDepositUsd) * 100);

  return {
    valid: true,
    securityDepositUsd,
    daysNoticeGivenBeforeCheckin,
    requiredNoticeDaysForFullRefund: reqNotice,
    noticePenaltyUsd,
    damageOrCleaningDeductionUsd: damageFee,
    totalDeductionsUsd,
    netRefundUsd,
    refundPercentage,
    meetsFullNotice,
    recommendation: meetsFullNotice && damageFee === 0
      ? `Full deposit refund of $${netRefundUsd.toFixed(2)} (${refundPercentage}%) approved.`
      : `Net deposit refund: $${netRefundUsd.toFixed(2)} after $${totalDeductionsUsd.toFixed(2)} in total deductions.`
  };
}

export function calculateNomadTaxResidencyPhysicalPresenceAudit({
  daysInCountry = 120,
  taxThresholdDays = 183,
  isSchengenZone = false,
  schengenDays180Window = 45
} = {}) {
  if (typeof daysInCountry !== 'number' || daysInCountry < 0 || isNaN(daysInCountry)) {
    return { valid: false, error: 'Days in country must be a non-negative number' };
  }
  if (typeof taxThresholdDays !== 'number' || taxThresholdDays <= 0 || isNaN(taxThresholdDays)) {
    return { valid: false, error: 'Tax threshold days must be a positive number' };
  }

  const daysRemainingUntilTaxResidency = Math.max(0, taxThresholdDays - daysInCountry);
  const taxResidencyRatio = Math.min(1.0, Math.round((daysInCountry / taxThresholdDays) * 100) / 100);
  const isTaxResidencyTriggered = daysInCountry >= taxThresholdDays;

  let schengenStatus = { isApplicable: false };
  if (isSchengenZone) {
    const sDays = typeof schengenDays180Window === 'number' && schengenDays180Window >= 0 ? schengenDays180Window : 0;
    const remainingSchengenDays = Math.max(0, 90 - sDays);
    schengenStatus = {
      isApplicable: true,
      schengenDaysUsed180Window: sDays,
      remainingSchengenDays,
      isSchengenLimitExceeded: sDays > 90
    };
  }

  let taxRiskTier = 'LOW_TAX_EXPOSURE';
  if (isTaxResidencyTriggered) {
    taxRiskTier = 'TAX_RESIDENCY_TRIGGERED';
  } else if (daysInCountry >= taxThresholdDays - 30) {
    taxRiskTier = 'APPROACHING_TAX_RESIDENCY';
  } else if (daysInCountry >= Math.round(taxThresholdDays / 2)) {
    taxRiskTier = 'MODERATE_TAX_MONITORING';
  }

  return {
    valid: true,
    daysInCountry,
    taxThresholdDays,
    daysRemainingUntilTaxResidency,
    taxResidencyRatio,
    isTaxResidencyTriggered,
    schengenStatus,
    taxRiskTier,
    recommendation: isTaxResidencyTriggered
      ? `Tax residency threshold triggered (${daysInCountry}/${taxThresholdDays} days). Consult local tax advisor for physical presence liabilities.`
      : taxRiskTier === 'APPROACHING_TAX_RESIDENCY'
      ? `Approaching tax residency limit! Only ${daysRemainingUntilTaxResidency} days remaining before 183-day tax threshold.`
      : `Low tax exposure (${daysInCountry}/${taxThresholdDays} days). ${daysRemainingUntilTaxResidency} safe days remaining.`
  };
}

export function calculateNomadVisaExemptTravelWindow({
  allowedDaysInWindow = 90,
  rollingWindowDays = 180,
  daysUsedInCurrentWindow = 45,
  plannedStayDays = 30
} = {}) {
  if (typeof allowedDaysInWindow !== 'number' || allowedDaysInWindow <= 0 || !Number.isInteger(allowedDaysInWindow)) {
    return { valid: false, error: 'Allowed days in window must be a positive integer' };
  }
  if (typeof rollingWindowDays !== 'number' || rollingWindowDays <= 0 || !Number.isInteger(rollingWindowDays)) {
    return { valid: false, error: 'Rolling window days must be a positive integer' };
  }
  if (typeof daysUsedInCurrentWindow !== 'number' || daysUsedInCurrentWindow < 0 || !Number.isInteger(daysUsedInCurrentWindow)) {
    return { valid: false, error: 'Days used in current window must be a non-negative integer' };
  }
  if (typeof plannedStayDays !== 'number' || plannedStayDays <= 0 || !Number.isInteger(plannedStayDays)) {
    return { valid: false, error: 'Planned stay days must be a positive integer' };
  }

  const daysRemaining = Math.max(0, allowedDaysInWindow - daysUsedInCurrentWindow);
  const isPlannedStayCompliant = plannedStayDays <= daysRemaining;
  const daysOverstay = isPlannedStayCompliant ? 0 : plannedStayDays - daysRemaining;
  const cooldownRequiredDays = isPlannedStayCompliant ? 0 : rollingWindowDays - allowedDaysInWindow;

  let complianceStatus = 'FULL_VISA_EXEMPT_COMPLIANT';
  if (!isPlannedStayCompliant) {
    complianceStatus = 'OVERSTAY_RISK_EXCEEDED';
  } else if (daysRemaining <= 15) {
    complianceStatus = 'WARNING_LOW_DAYS_REMAINING';
  }

  return {
    valid: true,
    allowedDaysInWindow,
    rollingWindowDays,
    daysUsedInCurrentWindow,
    plannedStayDays,
    daysRemaining,
    isPlannedStayCompliant,
    daysOverstay,
    cooldownRequiredDays,
    complianceStatus,
    recommendation: isPlannedStayCompliant
      ? `Visa-exempt stay compliant: ${daysRemaining} days remaining in current ${rollingWindowDays}-day rolling window.`
      : `Overstay risk detected! Planned stay exceeds limit by ${daysOverstay} days. Cooldown or visa application required.`
  };
}

export function calculateNomadRemoteWorkTaxTieBreakerScore({
  hasPermanentHomeHomeCountry = true,
  hasPermanentHomeHostCountry = false,
  familyAndFinancialCenter = 'home',
  daysInHostCountryAnnual = 120,
  daysInHomeCountryAnnual = 245,
  isHostCountryCitizen = false
} = {}) {
  if (typeof daysInHostCountryAnnual !== 'number' || daysInHostCountryAnnual < 0 || isNaN(daysInHostCountryAnnual)) {
    return { valid: false, error: 'Days in host country must be a non-negative number' };
  }
  if (typeof daysInHomeCountryAnnual !== 'number' || daysInHomeCountryAnnual < 0 || isNaN(daysInHomeCountryAnnual)) {
    return { valid: false, error: 'Days in home country must be a non-negative number' };
  }

  let tieBreakerScoreHome = 0;
  let tieBreakerScoreHost = 0;

  if (hasPermanentHomeHomeCountry) tieBreakerScoreHome += 30;
  if (hasPermanentHomeHostCountry) tieBreakerScoreHost += 30;

  const center = String(familyAndFinancialCenter).toLowerCase().trim();
  if (center === 'home') tieBreakerScoreHome += 35;
  else if (center === 'host') tieBreakerScoreHost += 35;
  else { tieBreakerScoreHome += 15; tieBreakerScoreHost += 15; }

  if (daysInHomeCountryAnnual > daysInHostCountryAnnual) tieBreakerScoreHome += 25;
  else if (daysInHostCountryHostCountry > daysInHomeCountryAnnual) tieBreakerScoreHost += 25;

  if (isHostCountryCitizen) tieBreakerScoreHost += 10;
  else tieBreakerScoreHome += 10;

  let primaryTaxResidency = 'HOME_COUNTRY';
  let taxTreatyTier = 'SAFE_SINGLE_TAX_RESIDENCY';

  if (tieBreakerScoreHost > tieBreakerScoreHome + 15) {
    primaryTaxResidency = 'HOST_COUNTRY';
    taxTreatyTier = 'HOST_TAX_RESIDENCY_ESTABLISHED';
  } else if (Math.abs(tieBreakerScoreHome - tieBreakerScoreHost) <= 15) {
    primaryTaxResidency = 'DUAL_RESIDENCY_RISK';
    taxTreatyTier = 'HIGH_DUAL_TAXATION_EXPOSURE';
  }

  return {
    valid: true,
    tieBreakerScoreHome,
    tieBreakerScoreHost,
    daysInHomeCountryAnnual,
    daysInHostCountryAnnual,
    primaryTaxResidency,
    taxTreatyTier,
    recommendation: taxTreatyTier === 'HIGH_DUAL_TAXATION_EXPOSURE'
      ? `High dual taxation risk! OECD tie-breaker scores are balanced (Home: ${tieBreakerScoreHome}, Host: ${tieBreakerScoreHost}). Consult cross-border tax specialist.`
      : primaryTaxResidency === 'HOST_COUNTRY'
      ? `Host country tax residency established under tie-breaker rules (Host score: ${tieBreakerScoreHost}).`
      : `Home country primary tax residency maintained (Home score: ${tieBreakerScoreHome}).`
  };
}

export function calculateNomadEmergencyMedicalEvacuationCoverageScore({
  medicalEvacuationLimitUsd = 100000,
  inpatientMedicalLimitUsd = 250000,
  deductibleUsd = 250,
  includesAdventureSports = false,
  isPreExistingConditionsCovered = false
} = {}) {
  if (typeof medicalEvacuationLimitUsd !== 'number' || medicalEvacuationLimitUsd <= 0 || isNaN(medicalEvacuationLimitUsd)) {
    return { valid: false, error: 'Medical evacuation limit must be a positive number' };
  }
  if (typeof inpatientMedicalLimitUsd !== 'number' || inpatientMedicalLimitUsd <= 0 || isNaN(inpatientMedicalLimitUsd)) {
    return { valid: false, error: 'Inpatient medical limit must be a positive number' };
  }

  const deductible = typeof deductibleUsd === 'number' && deductibleUsd >= 0 ? deductibleUsd : 250;
  
  let score = 0;
  if (medicalEvacuationLimitUsd >= 250000) score += 35;
  else if (medicalEvacuationLimitUsd >= 100000) score += 25;
  else score += 10;

  if (inpatientMedicalLimitUsd >= 500000) score += 35;
  else if (inpatientMedicalLimitUsd >= 250000) score += 25;
  else score += 15;

  if (deductible <= 100) score += 10;
  else if (deductible <= 250) score += 5;

  if (includesAdventureSports) score += 10;
  if (isPreExistingConditionsCovered) score += 10;

  const evacuationScore = Math.min(100, Math.max(0, Math.round(score)));

  let riskLevel = 'LOW_RISK';
  if (evacuationScore < 45) riskLevel = 'HIGH_RISK';
  else if (evacuationScore < 70) riskLevel = 'MODERATE_RISK';

  return {
    valid: true,
    medicalEvacuationLimitUsd,
    inpatientMedicalLimitUsd,
    deductibleUsd: deductible,
    includesAdventureSports: Boolean(includesAdventureSports),
    isPreExistingConditionsCovered: Boolean(isPreExistingConditionsCovered),
    evacuationScore,
    riskLevel,
    recommendation: riskLevel === 'LOW_RISK'
      ? `Emergency medical evacuation coverage is robust (${evacuationScore}/100 score).`
      : riskLevel === 'MODERATE_RISK'
      ? `Moderate medical coverage (${evacuationScore}/100 score). Consider raising evacuation or inpatient limits.`
      : `High financial risk (${evacuationScore}/100 score). Medical evacuation limit ($${medicalEvacuationLimitUsd}) is insufficient for overseas emergency air repatriation.`
  };
}

export function calculateNomadColivingSecurityAndPrivacyScore({
  hasSmartLockKeylessEntry = true,
  has247CctvSecurity = true,
  privateRoomLockLevel = 'digital_pin',
  wifiEncryptedWpa3 = true,
  soundproofDbRating = 45
} = {}) {
  let score = 0;

  if (hasSmartLockKeylessEntry) score += 20;
  if (has247CctvSecurity) score += 20;

  const lock = (privateRoomLockLevel || 'standard').toLowerCase();
  if (lock.includes('digital') || lock.includes('biometric')) score += 25;
  else if (lock.includes('key')) score += 15;

  if (wifiEncryptedWpa3) score += 20;
  
  if (soundproofDbRating >= 45) score += 15;
  else if (soundproofDbRating >= 35) score += 10;

  const securityScore = Math.min(100, Math.max(0, Math.round(score)));

  let tier = 'PREMIUM_SECURE_COLIVING';
  if (securityScore < 50) tier = 'ELEVATED_SECURITY_RISK';
  else if (securityScore < 75) tier = 'STANDARD_SECURITY_COLIVING';

  return {
    valid: true,
    hasSmartLockKeylessEntry: Boolean(hasSmartLockKeylessEntry),
    has247CctvSecurity: Boolean(has247CctvSecurity),
    privateRoomLockLevel: lock,
    wifiEncryptedWpa3: Boolean(wifiEncryptedWpa3),
    soundproofDbRating,
    securityScore,
    tier,
    recommendation: tier === 'PREMIUM_SECURE_COLIVING'
      ? `High-tier security and privacy (${securityScore}/100 score).`
      : tier === 'STANDARD_SECURITY_COLIVING'
      ? `Standard coliving security (${securityScore}/100 score).`
      : `Elevated security risk (${securityScore}/100 score). Upgrade door lock and Wi-Fi encryption.`
  };
}

export function calculateNomadTravelInsuranceAndEmergencyFund({
  tripDurationDays = 30,
  monthlyLivingCostUsd = 2500,
  destinationRiskTier = 'moderate',
  hasPreExistingHealthCondition = false
} = {}) {
  if (typeof tripDurationDays !== 'number' || tripDurationDays <= 0 || isNaN(tripDurationDays)) {
    return { valid: false, error: 'Trip duration days must be a positive number' };
  }
  if (typeof monthlyLivingCostUsd !== 'number' || monthlyLivingCostUsd <= 0 || isNaN(monthlyLivingCostUsd)) {
    return { valid: false, error: 'Monthly living cost must be a positive number' };
  }

  const riskMultiplierMap = { low: 1.0, moderate: 1.25, high: 1.6 };
  const riskMultiplier = riskMultiplierMap[(destinationRiskTier || 'moderate').toLowerCase()] || 1.25;

  const baseEmergencyFundMonths = 2.0 * riskMultiplier + (hasPreExistingHealthCondition ? 0.5 : 0);
  const recommendedEmergencyFundUsd = Math.round((monthlyLivingCostUsd * baseEmergencyFundMonths) * 100) / 100;

  const dailyInsuranceBaseUsd = 3.5 * riskMultiplier;
  const estimatedInsuranceCostUsd = Math.round((dailyInsuranceBaseUsd * tripDurationDays) * 100) / 100;

  let reserveReadinessTier = 'OPTIMAL_RESERVE';
  if (recommendedEmergencyFundUsd > 10000) {
    reserveReadinessTier = 'HIGH_BUFFER_RECOMMENDED';
  }

  return {
    valid: true,
    tripDurationDays,
    monthlyLivingCostUsd,
    destinationRiskTier,
    hasPreExistingHealthCondition: Boolean(hasPreExistingHealthCondition),
    recommendedEmergencyFundUsd,
    estimatedInsuranceCostUsd,
    reserveReadinessTier,
    recommendation: `Recommended emergency reserve: $${recommendedEmergencyFundUsd.toFixed(2)} (Estimated ${tripDurationDays}-day insurance premium: $${estimatedInsuranceCostUsd.toFixed(2)}).`
  };
}

export function calculateNomadColivingCommunityMatchScore({
  userBudgetUsd = 1500,
  communityMonthlyPriceUsd = 1400,
  userWorkTimezoneOffset = 0,
  communityPrimaryTimezoneOffset = 0,
  sharedInterests = [],
  communityTags = [],
  quietHoursRequired = true,
  communityEnforcesQuietHours = true
} = {}) {
  if (typeof userBudgetUsd !== 'number' || userBudgetUsd <= 0 || isNaN(userBudgetUsd)) {
    return { valid: false, error: 'User budget must be a positive number' };
  }
  if (typeof communityMonthlyPriceUsd !== 'number' || communityMonthlyPriceUsd <= 0 || isNaN(communityMonthlyPriceUsd)) {
    return { valid: false, error: 'Community monthly price must be a positive number' };
  }

  const budgetRatio = userBudgetUsd / communityMonthlyPriceUsd;
  let budgetScore = 100;
  if (budgetRatio < 1.0) {
    budgetScore = Math.max(0, 100 - (1.0 - budgetRatio) * 200);
  } else if (budgetRatio > 1.5) {
    budgetScore = 90;
  }

  const tzDiff = Math.abs(userWorkTimezoneOffset - communityPrimaryTimezoneOffset);
  const timezoneScore = Math.max(0, 100 - tzDiff * 12.5);

  const userInterests = Array.isArray(sharedInterests) ? sharedInterests.map(i => String(i).toLowerCase().trim()) : [];
  const commTags = Array.isArray(communityTags) ? communityTags.map(t => String(t).toLowerCase().trim()) : [];

  let interestScore = 50;
  if (userInterests.length > 0 && commTags.length > 0) {
    const common = userInterests.filter(i => commTags.includes(i));
    interestScore = Math.min(100, Math.round((common.length / userInterests.length) * 100));
  }

  let quietScore = 100;
  if (quietHoursRequired && !communityEnforcesQuietHours) {
    quietScore = 30;
  }

  const overallMatchScore = Math.round((budgetScore * 0.30) + (timezoneScore * 0.25) + (interestScore * 0.30) + (quietScore * 0.15));

  let matchTier = 'HIGH_COMPATIBILITY';
  if (overallMatchScore < 50) {
    matchTier = 'LOW_COMPATIBILITY';
  } else if (overallMatchScore < 75) {
    matchTier = 'MODERATE_COMPATIBILITY';
  }

  return {
    valid: true,
    userBudgetUsd,
    communityMonthlyPriceUsd,
    overallMatchScore,
    matchTier,
    breakdown: {
      budgetScore: Math.round(budgetScore),
      timezoneScore: Math.round(timezoneScore),
      interestScore: Math.round(interestScore),
      quietScore: Math.round(quietScore)
    },
    recommendation: overallMatchScore >= 75
      ? `Strong community match (${overallMatchScore}%) with price $${communityMonthlyPriceUsd}/mo.`
      : `Moderate coliving match (${overallMatchScore}%). Check quiet hours or timezone overlap.`
  };
}

export function calculateNomadCoworkingPassSavingsIndex({
  dailyDeskPassUsd = 25,
  monthlyMembershipPassUsd = 250,
  estimatedDaysPerMonth = 15,
  includesFreeCoffeeAndPerks = true,
  perkMonthlyValueUsd = 30
} = {}) {
  if (typeof dailyDeskPassUsd !== 'number' || dailyDeskPassUsd <= 0 || isNaN(dailyDeskPassUsd)) {
    return { valid: false, error: 'Daily desk pass price must be a positive number' };
  }
  if (typeof monthlyMembershipPassUsd !== 'number' || monthlyMembershipPassUsd <= 0 || isNaN(monthlyMembershipPassUsd)) {
    return { valid: false, error: 'Monthly membership pass price must be a positive number' };
  }
  if (typeof estimatedDaysPerMonth !== 'number' || estimatedDaysPerMonth <= 0 || isNaN(estimatedDaysPerMonth)) {
    return { valid: false, error: 'Estimated days per month must be a positive number' };
  }

  const payPerDayTotalUsd = Math.round((dailyDeskPassUsd * estimatedDaysPerMonth) * 100) / 100;
  const perkBonus = includesFreeCoffeeAndPerks ? Math.max(0, perkMonthlyValueUsd) : 0;
  const netMonthlyMembershipCostUsd = Math.max(0, Math.round((monthlyMembershipPassUsd - perkBonus) * 100) / 100);

  const monthlySavingsUsd = Math.round((payPerDayTotalUsd - netMonthlyMembershipCostUsd) * 100) / 100;
  const isMonthlyPassBetter = monthlySavingsUsd > 0;
  const breakEvenDays = Math.ceil(netMonthlyMembershipCostUsd / dailyDeskPassUsd);

  let recommendationTier = 'MONTHLY_MEMBERSHIP_RECOMMENDED';
  if (!isMonthlyPassBetter) {
    recommendationTier = 'DAY_PASS_COST_EFFECTIVE';
  } else if (monthlySavingsUsd >= 100) {
    recommendationTier = 'HIGH_SAVINGS_MONTHLY_MEMBERSHIP';
  }

  return {
    valid: true,
    dailyDeskPassUsd,
    monthlyMembershipPassUsd,
    estimatedDaysPerMonth,
    payPerDayTotalUsd,
    netMonthlyMembershipCostUsd,
    monthlySavingsUsd,
    isMonthlyPassBetter,
    breakEvenDays,
    recommendationTier,
    recommendation: isMonthlyPassBetter
      ? `Monthly pass recommended! Saves $${monthlySavingsUsd.toFixed(2)}/mo compared to day passes (Break-even at ${breakEvenDays} days).`
      : `Day passes recommended! You save $${Math.abs(monthlySavingsUsd).toFixed(2)}/mo based on ${estimatedDaysPerMonth} working days.`
  };
}

export function calculateNomadCrossBorderTaxLiabilityIndex(stayRecords, taxResidencyThresholdDays = 183) {
  if (!Array.isArray(stayRecords) || stayRecords.length === 0) {
    return {
      valid: false,
      error: 'Stay records must be a non-empty array',
      totalStayDays: 0,
      taxRiskScore: 0,
      taxRiskTier: 'INVALID_INPUT'
    };
  }

  let totalStayDays = 0;
  let totalForeignIncomeUsd = 0;
  const flaggedResidencyCountries = [];
  let dtaProtectedCount = 0;

  for (const record of stayRecords) {
    if (!record || typeof record.countryName !== 'string' || typeof record.daysStayed !== 'number' || record.daysStayed < 0) {
      return {
        valid: false,
        error: 'Each stay record must contain valid countryName and non-negative daysStayed',
        totalStayDays: 0,
        taxRiskScore: 0,
        taxRiskTier: 'INVALID_INPUT'
      };
    }

    const income = typeof record.foreignIncomeUsd === 'number' && record.foreignIncomeUsd >= 0 ? record.foreignIncomeUsd : 0;
    totalStayDays += record.daysStayed;
    totalForeignIncomeUsd += income;

    if (record.daysStayed >= taxResidencyThresholdDays) {
      flaggedResidencyCountries.push({
        countryName: record.countryName,
        daysStayed: record.daysStayed,
        incomeUsd: income,
        dtaProtected: Boolean(record.dtaAgreementActive)
      });
    }

    if (record.dtaAgreementActive) {
      dtaProtectedCount++;
    }
  }

  const isResidencyTriggered = flaggedResidencyCountries.length > 0;
  let taxRiskScore = Math.min(100, Math.round((totalStayDays / 365) * 40 + (isResidencyTriggered ? 45 : 10) + (flaggedResidencyCountries.length * 15)));

  if (dtaProtectedCount > 0 && isResidencyTriggered) {
    taxRiskScore = Math.max(0, taxRiskScore - 15);
  }

  let taxRiskTier = 'LOW_TAX_RESIDENCY_RISK';
  if (isResidencyTriggered || taxRiskScore >= 80) {
    taxRiskTier = 'CRITICAL_TAX_RESIDENCY_TRIGGERED';
  } else if (taxRiskScore >= 50) {
    taxRiskTier = 'ELEVATED_TAX_MONITORING_REQUIRED';
  }

  return {
    valid: true,
    totalStayDays,
    totalForeignIncomeUsd,
    taxResidencyThresholdDays,
    flaggedResidencyCountriesCount: flaggedResidencyCountries.length,
    flaggedResidencyCountries,
    isResidencyTriggered,
    taxRiskScore,
    taxRiskTier,
    recommendation: isResidencyTriggered
      ? `Tax residency threshold (${taxResidencyThresholdDays} days) exceeded in ${flaggedResidencyCountries.map(c => c.countryName).join(', ')}. Consult a cross-border tax specialist.`
      : `Tax residency clear across all visited destinations. ${totalStayDays} total days tracked across ${stayRecords.length} countries.`
  };
}

export function calculateNomadCommunityEventEngagementScore({
  attendeesCount = 25,
  maxCapacity = 30,
  discussionThreadsCount = 8,
  verifiedNomadsCount = 18,
  isHostVerified = true
} = {}) {
  if (typeof attendeesCount !== 'number' || attendeesCount < 0 || isNaN(attendeesCount)) {
    return { valid: false, error: 'Attendees count must be a non-negative number' };
  }
  if (typeof maxCapacity !== 'number' || maxCapacity <= 0 || isNaN(maxCapacity)) {
    return { valid: false, error: 'Max capacity must be a positive number' };
  }

  const occupancyPct = Math.min(100, Math.round((attendeesCount / maxCapacity) * 100 * 10) / 10);
  const verifiedPct = attendeesCount > 0 ? Math.round((verifiedNomadsCount / attendeesCount) * 100 * 10) / 10 : 0;

  const occupancyScore = Math.min(40, Math.round(occupancyPct * 0.4));
  const discussionScore = Math.min(30, discussionThreadsCount * 3.75);
  const verificationScore = Math.min(20, Math.round(verifiedPct * 0.2));
  const hostBonus = isHostVerified ? 10 : 0;

  const engagementScore = Math.min(100, Math.round(occupancyScore + discussionScore + verificationScore + hostBonus));

  let engagementTier = 'HIGH_ENGAGEMENT_EVENT';
  if (engagementScore < 50) {
    engagementTier = 'LOW_ENGAGEMENT_EVENT';
  } else if (engagementScore < 80) {
    engagementTier = 'MODERATE_ENGAGEMENT_EVENT';
  }

  return {
    valid: true,
    attendeesCount,
    maxCapacity,
    occupancyPct,
    verifiedPct,
    discussionThreadsCount,
    isHostVerified: Boolean(isHostVerified),
    engagementScore,
    engagementTier,
    recommendation: engagementScore >= 80
      ? `High community engagement event (${engagementScore}/100 score, ${occupancyPct}% full with ${discussionThreadsCount} discussion threads).`
      : `Moderate community event engagement (${engagementScore}/100 score). Promote event to local nomad network.`
  };
}

export function calculateNomadVisaDurationAndOverstayRiskScore({
  stayRecords = [],
  targetZoneDaysLimit = 90,
  rollingWindowDays = 180,
  dailyOverstayFineUsd = 50
} = {}) {
  if (!Array.isArray(stayRecords)) {
    return { valid: false, error: 'Stay records must be an array' };
  }
  if (typeof targetZoneDaysLimit !== 'number' || targetZoneDaysLimit <= 0 || isNaN(targetZoneDaysLimit)) {
    return { valid: false, error: 'Target zone days limit must be a positive number' };
  }
  if (typeof rollingWindowDays !== 'number' || rollingWindowDays <= 0 || isNaN(rollingWindowDays)) {
    return { valid: false, error: 'Rolling window days must be a positive number' };
  }

  let totalDaysInZone = 0;
  for (const record of stayRecords) {
    if (record && typeof record.daysStayed === 'number' && record.daysStayed > 0) {
      totalDaysInZone += record.daysStayed;
    }
  }

  const daysRemaining = Math.max(0, targetZoneDaysLimit - totalDaysInZone);
  const overstayDays = Math.max(0, totalDaysInZone - targetZoneDaysLimit);
  const utilizationPct = Math.min(100, Math.round((totalDaysInZone / targetZoneDaysLimit) * 100 * 10) / 10);
  const estimatedFineRiskUsd = overstayDays * dailyOverstayFineUsd;

  let riskTier = 'SAFE';
  if (overstayDays > 0) {
    riskTier = 'OVERSTAY_VIOLATION';
  } else if (daysRemaining <= 7) {
    riskTier = 'HIGH_RISK';
  } else if (daysRemaining <= 20) {
    riskTier = 'WARNING';
  }

  return {
    valid: true,
    totalDaysInZone,
    targetZoneDaysLimit,
    rollingWindowDays,
    daysRemaining,
    overstayDays,
    utilizationPct,
    estimatedFineRiskUsd,
    riskTier,
    recommendation: riskTier === 'OVERSTAY_VIOLATION'
      ? `CRITICAL: Overstayed by ${overstayDays} days! Estimated potential fine: $${estimatedFineRiskUsd}. Exit zone immediately.`
      : riskTier === 'HIGH_RISK'
      ? `WARNING: Only ${daysRemaining} days remaining in visa zone (${utilizationPct}% used). Prepare departure plan.`
      : `Visa status safe (${daysRemaining} days remaining out of ${targetZoneDaysLimit} allowed).`
  };
}

export function calculateNomadMultiCurrencyFxAndAtmFeeAudit({
  monthlyForeignSpendUsd = 2000,
  fxMarkupPercentage = 3.0,
  fixedAtmFeeUsd = 5.0,
  monthlyAtmWithdrawals = 4,
  multiCurrencyCardDiscountPercentage = 2.0
} = {}) {
  if (typeof monthlyForeignSpendUsd !== 'number' || monthlyForeignSpendUsd <= 0) {
    return { valid: false, error: 'Monthly foreign spend must be a positive number' };
  }
  if (typeof fxMarkupPercentage !== 'number' || fxMarkupPercentage < 0) {
    return { valid: false, error: 'FX markup percentage must be non-negative' };
  }
  if (typeof fixedAtmFeeUsd !== 'number' || fixedAtmFeeUsd < 0) {
    return { valid: false, error: 'Fixed ATM fee must be non-negative' };
  }
  if (typeof monthlyAtmWithdrawals !== 'number' || monthlyAtmWithdrawals < 0) {
    return { valid: false, error: 'Monthly ATM withdrawals must be non-negative' };
  }

  const monthlyFxFeeUsd = Math.round((monthlyForeignSpendUsd * (fxMarkupPercentage / 100)) * 100) / 100;
  const monthlyAtmTotalFeeUsd = Math.round((fixedAtmFeeUsd * monthlyAtmWithdrawals) * 100) / 100;
  const totalMonthlyFeeUsd = Math.round((monthlyFxFeeUsd + monthlyAtmTotalFeeUsd) * 100) / 100;
  const annualTotalFeeUsd = Math.round((totalMonthlyFeeUsd * 12) * 100) / 100;

  const monthlyOptimizedFxCostUsd = Math.round(
    (monthlyForeignSpendUsd * (Math.max(0, fxMarkupPercentage - multiCurrencyCardDiscountPercentage) / 100)) * 100
  ) / 100;
  const monthlySavingsUsd = Math.round((totalMonthlyFeeUsd - monthlyOptimizedFxCostUsd) * 100) / 100;
  const annualSavingsUsd = Math.round((monthlySavingsUsd * 12) * 100) / 100;

  let feeRiskTier = 'OPTIMIZED_FX';
  if (totalMonthlyFeeUsd >= 100 || fxMarkupPercentage >= 3.5) {
    feeRiskTier = 'HIGH_FX_DRAIN';
  } else if (totalMonthlyFeeUsd >= 40 || fxMarkupPercentage >= 1.5) {
    feeRiskTier = 'MODERATE_FX_DRAIN';
  }

  return {
    valid: true,
    monthlyForeignSpendUsd,
    fxMarkupPercentage,
    monthlyFxFeeUsd,
    monthlyAtmTotalFeeUsd,
    totalMonthlyFeeUsd,
    annualTotalFeeUsd,
    monthlyOptimizedFxCostUsd,
    monthlySavingsUsd,
    annualSavingsUsd,
    feeRiskTier,
    recommendation: feeRiskTier === 'HIGH_FX_DRAIN'
      ? `High currency conversion drain ($${totalMonthlyFeeUsd}/mo, $${annualTotalFeeUsd}/yr). Switch to borderless multi-currency card to save $${annualSavingsUsd}/yr.`
      : feeRiskTier === 'MODERATE_FX_DRAIN'
      ? `Moderate FX fee overhead ($${totalMonthlyFeeUsd}/mo). Use local currency billing to save up to $${annualSavingsUsd}/yr.`
      : `Optimized foreign transaction fee profile ($${totalMonthlyFeeUsd}/mo total fees).`
  };
}

export function calculateNomadStartupRunwayExtension({
  currentMonthlyBurnUsd = 10000,
  currentCashUsd = 100000,
  targetDestinationMonthlyCostUsd = 3000,
  relocationCostUsd = 2000,
  teamSize = 1
} = {}) {
  if (typeof currentMonthlyBurnUsd !== 'number' || currentMonthlyBurnUsd <= 0 || isNaN(currentMonthlyBurnUsd)) {
    return { valid: false, error: 'Current monthly burn must be a positive number' };
  }
  if (typeof currentCashUsd !== 'number' || currentCashUsd < 0 || isNaN(currentCashUsd)) {
    return { valid: false, error: 'Current cash must be a non-negative number' };
  }
  if (typeof targetDestinationMonthlyCostUsd !== 'number' || targetDestinationMonthlyCostUsd <= 0 || isNaN(targetDestinationMonthlyCostUsd)) {
    return { valid: false, error: 'Target destination monthly cost must be a positive number' };
  }
  if (typeof relocationCostUsd !== 'number' || relocationCostUsd < 0 || isNaN(relocationCostUsd)) {
    return { valid: false, error: 'Relocation cost must be a non-negative number' };
  }
  if (typeof teamSize !== 'number' || teamSize < 1 || isNaN(teamSize)) {
    return { valid: false, error: 'Team size must be at least 1' };
  }

  const currentRunwayMonths = Math.round((currentCashUsd / currentMonthlyBurnUsd) * 10) / 10;
  
  const totalRelocationCost = relocationCostUsd * teamSize;
  const newCashAfterRelocation = currentCashUsd - totalRelocationCost;

  if (newCashAfterRelocation <= 0) {
    return {
      valid: true,
      isFeasible: false,
      message: 'Relocation costs exceed current cash reserves.'
    };
  }

  const targetMonthlyBurn = targetDestinationMonthlyCostUsd * teamSize;
  const newRunwayMonths = Math.round((newCashAfterRelocation / targetMonthlyBurn) * 10) / 10;
  
  const runwayExtensionMonths = Math.round((newRunwayMonths - currentRunwayMonths) * 10) / 10;
  
  let recommendation = '';
  if (runwayExtensionMonths > 6) {
    recommendation = 'Highly Recommended: Significant runway extension achieved.';
  } else if (runwayExtensionMonths > 0) {
    recommendation = 'Favorable: Moderate runway extension achieved.';
  } else {
    recommendation = 'Not Recommended: Relocation reduces or does not meaningfully extend runway.';
  }

  return {
    valid: true,
    isFeasible: true,
    currentRunwayMonths,
    newRunwayMonths,
    runwayExtensionMonths,
    totalRelocationCost,
    targetMonthlyBurn,
    recommendation
  };
}

export function calculateNomadColivingLeaseCancellationRiskScore({
  monthlyRentUsd = 1500,
  depositUsd = 1500,
  noticePeriodDays = 14,
  requiredNoticeDays = 30,
  policyTier = 'MODERATE',
  hostEarlyTerminationClause = false
} = {}) {
  if (typeof monthlyRentUsd !== 'number' || monthlyRentUsd <= 0 || isNaN(monthlyRentUsd)) {
    return { valid: false, error: 'Monthly rent must be a positive number' };
  }
  if (typeof depositUsd !== 'number' || depositUsd < 0 || isNaN(depositUsd)) {
    return { valid: false, error: 'Deposit must be a non-negative number' };
  }
  if (typeof noticePeriodDays !== 'number' || noticePeriodDays < 0 || isNaN(noticePeriodDays)) {
    return { valid: false, error: 'Notice period days must be a non-negative number' };
  }

  const tier = (policyTier || 'MODERATE').toUpperCase();
  let baseRisk = 30;

  if (tier === 'STRICT') baseRisk += 30;
  else if (tier === 'FLEXIBLE') baseRisk -= 15;

  if (noticePeriodDays < requiredNoticeDays) {
    const shortageDays = requiredNoticeDays - noticePeriodDays;
    baseRisk += Math.min(30, shortageDays * 1.5);
  }

  if (hostEarlyTerminationClause) {
    baseRisk += 20;
  }

  const riskScore = Math.min(100, Math.max(0, Math.round(baseRisk)));

  let penaltyPct = 0.25;
  if (tier === 'STRICT') penaltyPct = 0.75;
  else if (tier === 'FLEXIBLE') penaltyPct = 0.0;

  if (noticePeriodDays < requiredNoticeDays) {
    penaltyPct = Math.min(1.0, penaltyPct + 0.25);
  }

  const financialExposureUsd = Math.round((depositUsd * penaltyPct) * 100) / 100;

  let riskTier = 'LOW_CANCELLATION_RISK';
  if (riskScore >= 70) riskTier = 'HIGH_CANCELLATION_RISK';
  else if (riskScore >= 45) riskTier = 'MODERATE_CANCELLATION_RISK';

  let recommendation = 'Flexible lease agreement with minimal cancellation financial exposure.';
  if (riskTier === 'HIGH_CANCELLATION_RISK') {
    recommendation = `High lease cancellation risk (${riskScore}/100). Potential exposure: $${financialExposureUsd}. Require standard 30-day notice or flexible terms.`;
  } else if (riskTier === 'MODERATE_CANCELLATION_RISK') {
    recommendation = `Moderate cancellation risk (${riskScore}/100). Review notice requirements to minimize deposit forfeiture ($${financialExposureUsd}).`;
  }

  return {
    valid: true,
    monthlyRentUsd,
    depositUsd,
    noticePeriodDays,
    requiredNoticeDays,
    policyTier: tier,
    hostEarlyTerminationClause: Boolean(hostEarlyTerminationClause),
    riskScore,
    riskTier,
    financialExposureUsd,
    recommendation
  };
}

export function calculateNomadTaxResidencyAndPhysicalPresenceAudit({
  primaryCountryDays = 120,
  targetCountryDays = 90,
  schengenZoneDaysCount = 45,
  taxResidencyThresholdDays = 183,
  schengenLimitDays = 90,
} = {}) {
  if (typeof primaryCountryDays !== 'number' || primaryCountryDays < 0 ||
      typeof targetCountryDays !== 'number' || targetCountryDays < 0) {
    return { valid: false, error: 'Stay duration days must be non-negative numbers' };
  }

  const isTaxResidencyTriggered = targetCountryDays >= taxResidencyThresholdDays;
  const isSchengenOverstayRisk = schengenZoneDaysCount > schengenLimitDays;

  let riskScore = 10;
  if (isTaxResidencyTriggered) riskScore += 50;
  else if (targetCountryDays >= taxResidencyThresholdDays * 0.75) riskScore += 25;

  if (isSchengenOverstayRisk) riskScore += 40;
  else if (schengenZoneDaysCount >= schengenLimitDays * 0.8) riskScore += 20;

  riskScore = Math.min(100, Math.max(0, Math.round(riskScore)));

  let riskTier = 'LOW_TAX_AND_VISA_RISK';
  if (riskScore >= 70) riskTier = 'HIGH_TAX_AND_VISA_RISK';
  else if (riskScore >= 40) riskTier = 'MODERATE_TAX_AND_VISA_RISK';

  let recommendation = 'Stay durations comply with 183-day tax residency and Schengen 90/180 rules.';
  if (riskTier === 'HIGH_TAX_AND_VISA_RISK') {
    recommendation = `High tax/visa risk (${riskScore}/100). Target stay (${targetCountryDays} days) triggers or approaches tax residency or Schengen limits.`;
  } else if (riskTier === 'MODERATE_TAX_AND_VISA_RISK') {
    recommendation = `Moderate tax/visa risk (${riskScore}/100). Monitor total stay days closely to prevent unintentional tax exposure.`;
  }

  return {
    valid: true,
    primaryCountryDays,
    targetCountryDays,
    schengenZoneDaysCount,
    taxResidencyThresholdDays,
    isTaxResidencyTriggered,
    isSchengenOverstayRisk,
    riskScore,
    riskTier,
    recommendation
  };
}

export function calculateNomadColivingCostSharingIndex({
  monthlyRentUsd = 3000,
  numberOfNomads = 4,
  privateRoomPremiumRatio = 0.2,
  sharedUtilitiesUsd = 400
} = {}) {
  if (typeof monthlyRentUsd !== 'number' || monthlyRentUsd <= 0 ||
      typeof numberOfNomads !== 'number' || numberOfNomads <= 0) {
    return { valid: false, error: 'Monthly rent and number of nomads must be positive numbers' };
  }

  const rent = Math.max(0, monthlyRentUsd);
  const nomads = Math.max(1, Math.round(numberOfNomads));
  const utilities = Math.max(0, typeof sharedUtilitiesUsd === 'number' ? sharedUtilitiesUsd : 0);
  const premiumRatio = Math.max(0, Math.min(0.5, typeof privateRoomPremiumRatio === 'number' ? privateRoomPremiumRatio : 0.2));

  const totalMonthlyCost = rent + utilities;
  const basePerPersonRent = rent / nomads;
  const privateRoomPremiumUsd = basePerPersonRent * premiumRatio;
  const sharedUtilitiesPerPerson = utilities / nomads;
  const perPersonCostUsd = Math.round((basePerPersonRent + sharedUtilitiesPerPerson) * 100) / 100;
  const perPersonWithPremiumUsd = Math.round((basePerPersonRent + privateRoomPremiumUsd + sharedUtilitiesPerPerson) * 100) / 100;

  const costEfficiencyScore = Math.min(100, Math.max(0, Math.round((1 - (perPersonCostUsd / 2500)) * 100)));

  return {
    valid: true,
    totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
    numberOfNomads: nomads,
    basePerPersonRent: Math.round(basePerPersonRent * 100) / 100,
    sharedUtilitiesPerPerson: Math.round(sharedUtilitiesPerPerson * 100) / 100,
    perPersonCostUsd,
    perPersonWithPremiumUsd,
    costEfficiencyScore,
    recommendation: costEfficiencyScore >= 50
      ? 'High coliving cost efficiency. Group sharing provides substantial monthly savings.'
      : 'Moderate coliving cost efficiency. Consider adding more co-tenants or seeking alternative hub options.'
  };
}

export function calculateNomadInternetSlaAndBackupRisk({
  primarySpeedMbps = 100,
  hasBackupConnection = true,
  hasPowerGeneratorBackup = true,
  monthlyOutageHours = 2,
  averageLatencyMs = 25
} = {}) {
  if (typeof primarySpeedMbps !== 'number' || primarySpeedMbps < 0 || isNaN(primarySpeedMbps)) {
    return { valid: false, error: 'Primary speed Mbps must be a non-negative number' };
  }

  const speed = Math.max(0, primarySpeedMbps);
  const outage = Math.max(0, typeof monthlyOutageHours === 'number' ? monthlyOutageHours : 0);
  const latency = Math.max(0, typeof averageLatencyMs === 'number' ? averageLatencyMs : 25);

  const totalMonthlyHours = 720;
  const uptimePercentage = Math.max(0, Math.min(100, Math.round(((totalMonthlyHours - outage) / totalMonthlyHours) * 10000) / 100));

  let score = 50;
  if (speed >= 100) score += 20;
  else if (speed >= 30) score += 10;

  if (hasBackupConnection) score += 15;
  if (hasPowerGeneratorBackup) score += 15;

  if (latency <= 30) score += 10;
  else if (latency > 100) score -= 15;

  if (outage > 10) score -= 25;
  else if (outage > 5) score -= 10;

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  let riskTier = 'EXCELLENT_SLA';
  if (finalScore < 40) riskTier = 'HIGH_OUTAGE_RISK';
  else if (finalScore < 70) riskTier = 'MODERATE_OUTAGE_RISK';

  return {
    valid: true,
    primarySpeedMbps: speed,
    hasBackupConnection,
    hasPowerGeneratorBackup,
    monthlyOutageHours: outage,
    averageLatencyMs: latency,
    uptimePercentage,
    reliabilityScore: finalScore,
    riskTier,
    recommendation: finalScore >= 70
      ? 'Internet SLA is robust. Excellent for remote engineering calls and video streams.'
      : 'Network risk identified. Ensure a secondary 5G mobile hotspot is available.'
  };
}

export function calculateNomadColivingUtilityAndWifiCostSplit({
  totalMonthlyUtilitiesUsd = 300,
  highSpeedWifiBillUsd = 100,
  occupantsCount = 4,
  heavyBandwidthUserCount = 1
} = {}) {
  if (typeof totalMonthlyUtilitiesUsd !== 'number' || totalMonthlyUtilitiesUsd < 0 || isNaN(totalMonthlyUtilitiesUsd)) {
    return { valid: false, error: 'Total monthly utilities USD must be a non-negative number' };
  }
  if (typeof highSpeedWifiBillUsd !== 'number' || highSpeedWifiBillUsd < 0 || isNaN(highSpeedWifiBillUsd)) {
    return { valid: false, error: 'High speed wifi bill USD must be a non-negative number' };
  }
  if (typeof occupantsCount !== 'number' || occupantsCount <= 0 || !Number.isInteger(occupantsCount)) {
    return { valid: false, error: 'Occupants count must be a positive integer' };
  }

  const utilTotal = Math.round(totalMonthlyUtilitiesUsd * 100) / 100;
  const wifiTotal = Math.round(highSpeedWifiBillUsd * 100) / 100;
  const grandTotal = Math.round((utilTotal + wifiTotal) * 100) / 100;

  const equalPerPersonShare = Math.round((grandTotal / occupantsCount) * 100) / 100;
  
  const wifiPerPersonShare = Math.round((wifiTotal / occupantsCount) * 100) / 100;
  const utilityPerPersonShare = Math.round((utilTotal / occupantsCount) * 100) / 100;

  return {
    valid: true,
    totalMonthlyUtilitiesUsd: utilTotal,
    highSpeedWifiBillUsd: wifiTotal,
    grandTotalUsd: grandTotal,
    occupantsCount,
    equalPerPersonShare,
    utilityPerPersonShare,
    wifiPerPersonShare,
    recommendation: `Fair coliving utility split: $${equalPerPersonShare.toFixed(2)} per person for ${occupantsCount} occupants ($${wifiPerPersonShare.toFixed(2)} WiFi + $${utilityPerPersonShare.toFixed(2)} utilities).`
  };
}

export function calculateNomadCoworkingSlaAndPowerBackupScore({
  primarySpeedMbps = 100,
  backupSpeedMbps = 30,
  hasGeneratorPowerBackup = true,
  averagePowerOutageHoursPerMonth = 2,
  dailyDeskRateUsd = 20
} = {}) {
  if (typeof primarySpeedMbps !== 'number' || primarySpeedMbps <= 0 || isNaN(primarySpeedMbps)) {
    return { valid: false, error: 'Primary speed Mbps must be a positive number' };
  }
  if (typeof dailyDeskRateUsd !== 'number' || dailyDeskRateUsd <= 0 || isNaN(dailyDeskRateUsd)) {
    return { valid: false, error: 'Daily desk rate USD must be a positive number' };
  }

  const outage = Math.max(0, typeof averagePowerOutageHoursPerMonth === 'number' ? averagePowerOutageHoursPerMonth : 0);
  const backupSpeed = Math.max(0, typeof backupSpeedMbps === 'number' ? backupSpeedMbps : 0);

  let reliabilityScore = 100;
  if (outage > 0 && !hasGeneratorPowerBackup) {
    reliabilityScore -= Math.min(50, outage * 10);
  }
  if (backupSpeed < 20) {
    reliabilityScore -= 15;
  }
  if (primarySpeedMbps < 50) {
    reliabilityScore -= 20;
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(reliabilityScore)));

  let slaTier = 'PREMIUM_ENTERPRISE_READY';
  if (finalScore < 60) {
    slaTier = 'HIGH_RISK_UNRELIABLE';
  } else if (finalScore < 85) {
    slaTier = 'STANDARD_MODERATE_RISK';
  }

  return {
    valid: true,
    primarySpeedMbps,
    backupSpeedMbps: backupSpeed,
    hasGeneratorPowerBackup,
    monthlyOutageHours: outage,
    reliabilityScore: finalScore,
    slaTier,
    recommendation: finalScore >= 85
      ? `Coworking space is enterprise-ready with high uptime (${finalScore}/100 score).`
      : `Warning: Risk of power/connectivity downtime detected (${finalScore}/100 score).`
  };
}







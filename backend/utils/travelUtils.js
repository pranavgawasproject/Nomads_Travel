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








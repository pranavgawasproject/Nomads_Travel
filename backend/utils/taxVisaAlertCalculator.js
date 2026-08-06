/**
 * taxVisaAlertCalculator.js
 * Utility engine to calculate 183-day tax residency thresholds, visa stay durations,
 * overstay risks, and overall compliance scores for digital nomads.
 */

/**
 * Calculates 183-day tax threshold status for each country visited in a given period.
 * @param {Array<{ country: string, days: number }>} stays 
 * @returns {{ countryBreakdown: Object, overallRisk: string, maxDaysSpent: number, highestRiskCountry: string|null }}
 */
export function calculate183DayTaxThreshold(stays = []) {
  if (!Array.isArray(stays) || stays.length === 0) {
    return {
      countryBreakdown: {},
      overallRisk: 'SAFE',
      maxDaysSpent: 0,
      highestRiskCountry: null
    };
  }

  const breakdown = {};
  let maxDaysSpent = 0;
  let highestRiskCountry = null;
  let overallRisk = 'SAFE';

  for (const stay of stays) {
    if (!stay || !stay.country || typeof stay.days !== 'number' || stay.days <= 0) {
      continue;
    }
    const country = stay.country.trim().toUpperCase();
    breakdown[country] = (breakdown[country] || 0) + stay.days;
  }

  for (const [country, totalDays] of Object.entries(breakdown)) {
    const daysRemaining = 183 - totalDays;
    const exposurePercentage = Math.min(100, Number(((totalDays / 183) * 100).toFixed(1)));
    
    let status = 'SAFE';
    if (totalDays >= 183) {
      status = 'CRITICAL_TAX_LIABILITY';
    } else if (totalDays >= 150) {
      status = 'WARNING';
    }

    if (totalDays > maxDaysSpent) {
      maxDaysSpent = totalDays;
      highestRiskCountry = country;
    }

    if (status === 'CRITICAL_TAX_LIABILITY') {
      overallRisk = 'CRITICAL_TAX_LIABILITY';
    } else if (status === 'WARNING' && overallRisk !== 'CRITICAL_TAX_LIABILITY') {
      overallRisk = 'WARNING';
    }

    breakdown[country] = {
      totalDaysSpent: totalDays,
      daysRemaining: Math.max(0, daysRemaining),
      exposurePercentage,
      status
    };
  }

  return {
    countryBreakdown: breakdown,
    overallRisk,
    maxDaysSpent,
    highestRiskCountry
  };
}

/**
 * Calculates visa remaining days and overstay risk.
 * @param {string|Date} entryDate 
 * @param {number} maxDaysAllowed 
 * @param {string|Date} [currentDate] 
 * @returns {{ remainingDays: number, status: string, exitDeadline: string }}
 */
export function calculateVisaExpiryWindow(entryDate, maxDaysAllowed, currentDate = new Date()) {
  const entry = new Date(entryDate);
  const current = new Date(currentDate);

  if (isNaN(entry.getTime()) || typeof maxDaysAllowed !== 'number' || maxDaysAllowed <= 0) {
    throw new Error('Invalid entryDate or maxDaysAllowed');
  }

  const exitDeadlineDate = new Date(entry.getTime() + maxDaysAllowed * 24 * 60 * 60 * 1000);
  const diffTime = exitDeadlineDate.getTime() - current.getTime();
  const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let status = 'VALID';
  if (remainingDays <= 0) {
    status = 'OVERSTAY_EXPIRED';
  } else if (remainingDays <= 14) {
    status = 'EXPIRING_SOON';
  }

  return {
    remainingDays,
    status,
    exitDeadline: exitDeadlineDate.toISOString().split('T')[0]
  };
}

/**
 * Assesses overall nomad compliance score based on stays and active visa.
 * @param {Array<{ country: string, days: number }>} stays 
 * @param {{ entryDate: string, maxDaysAllowed: number }} [visaDetails] 
 * @returns {{ score: number, taxRisk: string, visaStatus: string, recommendations: Array<string> }}
 */
export function assessNomadComplianceScore(stays = [], visaDetails = null) {
  const taxAssessment = calculate183DayTaxThreshold(stays);
  let score = 100;
  const recommendations = [];

  if (taxAssessment.overallRisk === 'CRITICAL_TAX_LIABILITY') {
    score -= 40;
    recommendations.push(`Consult a tax professional: Exceeded 183 days threshold in ${taxAssessment.highestRiskCountry}.`);
  } else if (taxAssessment.overallRisk === 'WARNING') {
    score -= 20;
    recommendations.push(`Nearing tax residency limit in ${taxAssessment.highestRiskCountry}. Plan relocation soon.`);
  }

  let visaStatus = 'UNKNOWN';
  if (visaDetails && visaDetails.entryDate && visaDetails.maxDaysAllowed) {
    const visaResult = calculateVisaExpiryWindow(visaDetails.entryDate, visaDetails.maxDaysAllowed);
    visaStatus = visaResult.status;
    if (visaStatus === 'OVERSTAY_EXPIRED') {
      score -= 50;
      recommendations.push('URGENT: Visa overstayed! Initiate emergency exit or renewal protocol.');
    } else if (visaStatus === 'EXPIRING_SOON') {
      score -= 25;
      recommendations.push(`Visa expiring in ${visaResult.remainingDays} days. Prepare onward travel documents.`);
    }
  }

  return {
    score: Math.max(0, score),
    taxRisk: taxAssessment.overallRisk,
    visaStatus,
    recommendations
  };
}

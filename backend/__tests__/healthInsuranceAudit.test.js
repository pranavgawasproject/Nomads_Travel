import { calculateNomadHealthInsuranceAndGlobalCoverageAudit } from '../utils/travelUtils.js';

describe('calculateNomadHealthInsuranceAndGlobalCoverageAudit', () => {
  test('calculates comprehensive global health coverage tier correctly', () => {
    const result = calculateNomadHealthInsuranceAndGlobalCoverageAudit({
      annualCoverageLimitUsd: 500000,
      deductibleUsd: 250,
      destinationCountry: 'Spain',
      includesAdventureSports: true,
      hasDirectBillingHospitalNetwork: true,
      hasRepatriationCoverage: true,
      tripDurationDays: 90
    });

    expect(result.valid).toBe(true);
    expect(result.auditTier).toBe('COMPREHENSIVE_GLOBAL_COVERAGE');
    expect(result.coverageScore).toBe(100);
    expect(result.annualCoverageLimitUsd).toBe(500000);
  });

  test('identifies critical underinsured risk when repatriation coverage is missing', () => {
    const result = calculateNomadHealthInsuranceAndGlobalCoverageAudit({
      annualCoverageLimitUsd: 50000,
      deductibleUsd: 1500,
      destinationCountry: 'Indonesia',
      includesAdventureSports: false,
      hasDirectBillingHospitalNetwork: false,
      hasRepatriationCoverage: false,
      tripDurationDays: 60
    });

    expect(result.valid).toBe(true);
    expect(result.auditTier).toBe('CRITICAL_UNDERINSURED_RISK');
    expect(result.coverageScore).toBeLessThan(50);
  });

  test('returns error for invalid non-positive annual coverage limit', () => {
    const result = calculateNomadHealthInsuranceAndGlobalCoverageAudit({
      annualCoverageLimitUsd: -100
    });

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Annual coverage limit USD must be a positive number');
  });
});

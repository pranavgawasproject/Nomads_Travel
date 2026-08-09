import { calculateNomadHealthInsuranceAndGlobalCoverageAudit, calculateNomadColivingAndCoworkingPassBundleOptimizationAudit } from '../utils/travelUtils.js';

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

describe('calculateNomadColivingAndCoworkingPassBundleOptimizationAudit', () => {
  test('calculates included coliving workspace optimal strategy correctly', () => {
    const result = calculateNomadColivingAndCoworkingPassBundleOptimizationAudit({
      colivingRentUsd: 1200,
      includesDedicatedDeskInColiving: true,
      coworkingPassMonthlyUsd: 250,
      dailyDropInRateUsd: 25,
      expectedWorkDaysPerMonth: 20
    });

    expect(result.valid).toBe(true);
    expect(result.workspaceStrategyTier).toBe('INCLUDED_COLIVING_WORKSPACE_OPTIMAL');
    expect(result.totalMonthlySpendUsd).toBe(1200);
    expect(result.monthlySavingsUsd).toBe(250);
  });

  test('recommends coworking pass bundle when external pass is cheaper than daily drop-in', () => {
    const result = calculateNomadColivingAndCoworkingPassBundleOptimizationAudit({
      colivingRentUsd: 1000,
      includesDedicatedDeskInColiving: false,
      coworkingPassMonthlyUsd: 200,
      dailyDropInRateUsd: 20,
      expectedWorkDaysPerMonth: 15
    });

    expect(result.valid).toBe(true);
    expect(result.workspaceStrategyTier).toBe('COWORKING_PASS_BUNDLE_RECOMMENDED');
    expect(result.totalMonthlySpendUsd).toBe(1200);
    expect(result.monthlySavingsUsd).toBe(100);
  });

  test('returns error for invalid non-positive coliving rent', () => {
    const result = calculateNomadColivingAndCoworkingPassBundleOptimizationAudit({
      colivingRentUsd: -50
    });

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Coliving rent USD must be a positive number');
  });
});


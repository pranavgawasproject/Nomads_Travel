import { calculateNomadDualTaxResidencyAndTreatyTieBreakerAudit } from '../utils/travelUtils.js';

describe('calculateNomadDualTaxResidencyAndTreatyTieBreakerAudit', () => {
  test('evaluates safe single tax residency correctly', () => {
    const res = calculateNomadDualTaxResidencyAndTreatyTieBreakerAudit({
      countryStaysList: [
        { countryName: 'United States', daysSpentInYear: 250, hasPermanentHome: true, centerOfVitalInterestsScore: 90, isNational: true },
        { countryName: 'Spain', daysSpentInYear: 60, hasPermanentHome: false, centerOfVitalInterestsScore: 20, isNational: false }
      ],
      annualGlobalIncomeUsd: 150000.0
    });

    expect(res.valid).toBe(true);
    expect(res.isDualResidencyRisk).toBe(false);
    expect(res.auditTier).toBe('SAFE_SINGLE_TAX_RESIDENCY');
    expect(res.tieBreakerWinnerCountry).toBe('United States');
  });

  test('evaluates dual tax residency risk protected by OECD treaty tie-breaker', () => {
    const res = calculateNomadDualTaxResidencyAndTreatyTieBreakerAudit({
      countryStaysList: [
        { countryName: 'United States', daysSpentInYear: 160, hasPermanentHome: true, centerOfVitalInterestsScore: 85, isNational: true },
        { countryName: 'United Kingdom', daysSpentInYear: 190, hasPermanentHome: true, centerOfVitalInterestsScore: 30, isNational: false }
      ],
      annualGlobalIncomeUsd: 200000.0
    });

    expect(res.valid).toBe(true);
    expect(res.isDualResidencyRisk).toBe(true);
    expect(res.treatyProtectionEligible).toBe(true);
    expect(res.auditTier).toBe('DUAL_RESIDENCY_PROTECTED_BY_TREATY');
  });

  test('handles invalid input parameters gracefully', () => {
    const res = calculateNomadDualTaxResidencyAndTreatyTieBreakerAudit({
      countryStaysList: []
    });

    expect(res.valid).toBe(false);
    expect(res.error).toBe('Country stays list must be a non-empty array');
  });
});

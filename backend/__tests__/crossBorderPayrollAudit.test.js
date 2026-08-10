import { calculateNomadCrossBorderRemotePayrollAndSocialSecurityAudit } from '../utils/travelUtils.js';

describe('calculateNomadCrossBorderRemotePayrollAndSocialSecurityAudit', () => {
  test('evaluates Totalization Agreement exemption correctly for long stays with CoC', () => {
    const res = calculateNomadCrossBorderRemotePayrollAndSocialSecurityAudit({
      annualSalaryUsd: 120000.0,
      stayDurationDays: 120,
      homeCountryName: 'United States',
      hostCountryName: 'Portugal',
      hasTotalizationAgreement: true,
      hasA1OrCertificateOfCoverage: true
    });

    expect(res.valid).toBe(true);
    expect(res.isExemptFromHostSocialSecurity).toBe(true);
    expect(res.socialSecurityRiskTier).toBe('EXEMPT_TOTALIZATION_AGREEMENT_IN_PLACE');
    expect(res.doubleTaxationSavingsUsd).toBeGreaterThan(0);
    expect(res.recommendations[0]).toContain('Social Security compliant!');
  });

  test('identifies critical dual social security contribution risk when stay exceeds 183 days without CoC', () => {
    const res = calculateNomadCrossBorderRemotePayrollAndSocialSecurityAudit({
      annualSalaryUsd: 150000.0,
      stayDurationDays: 200,
      hasTotalizationAgreement: false,
      hasA1OrCertificateOfCoverage: false
    });

    expect(res.valid).toBe(true);
    expect(res.isExemptFromHostSocialSecurity).toBe(false);
    expect(res.socialSecurityRiskTier).toBe('CRITICAL_DUAL_SOCIAL_SECURITY_CONTRIBUTION_RISK');
    expect(res.auditScore).toBeLessThan(60);
  });

  test('handles invalid salary or duration gracefully', () => {
    const res = calculateNomadCrossBorderRemotePayrollAndSocialSecurityAudit({
      annualSalaryUsd: -50000
    });

    expect(res.valid).toBe(false);
    expect(res.error).toBe('Annual salary USD must be a positive number');
  });
});

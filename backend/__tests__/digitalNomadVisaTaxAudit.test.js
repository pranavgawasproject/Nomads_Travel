import { calculateNomadDigitalNomadVisaTaxExemptionAndLocalWithholdingAudit } from '../utils/travelUtils.js';

describe('calculateNomadDigitalNomadVisaTaxExemptionAndLocalWithholdingAudit', () => {
  test('evaluates valid Digital Nomad Visa tax exemption savings correctly', () => {
    const res = calculateNomadDigitalNomadVisaTaxExemptionAndLocalWithholdingAudit({
      monthlyRemoteIncomeUsd: 6000.0,
      hostCountryName: 'Spain',
      hasDigitalNomadVisa: true,
      visaDurationDays: 180,
      foreignClientIncomePct: 100.0,
      localStandardIncomeTaxRatePct: 24.0,
      specialDnvTaxRatePct: 15.0
    });

    expect(res.valid).toBe(true);
    expect(res.hostCountryName).toBe('Spain');
    expect(res.annualIncomeUsd).toBe(72000.0);
    expect(res.taxExemptionStatus).toBe('FULLY_TAX_EXEMPT_DIGITAL_NOMAD');
    expect(res.effectiveTaxRatePct).toBe(15.0);
    expect(res.annualTaxSavingsUsd).toBe(6480.0);
    expect(res.auditScore).toBe(100);
    expect(res.recommendations.length).toBeGreaterThan(0);
  });

  test('flags double taxation exposure when staying >183 days without Digital Nomad Visa', () => {
    const res = calculateNomadDigitalNomadVisaTaxExemptionAndLocalWithholdingAudit({
      monthlyRemoteIncomeUsd: 5000.0,
      hostCountryName: 'Portugal',
      hasDigitalNomadVisa: false,
      visaDurationDays: 200,
      foreignClientIncomePct: 100.0
    });

    expect(res.valid).toBe(true);
    expect(res.taxExemptionStatus).toBe('CRITICAL_DOUBLE_TAXATION_EXPOSURE');
    expect(res.auditScore).toBeLessThan(60);
    expect(res.annualTaxSavingsUsd).toBe(0);
  });

  test('handles invalid monthly income cleanly', () => {
    const res = calculateNomadDigitalNomadVisaTaxExemptionAndLocalWithholdingAudit({
      monthlyRemoteIncomeUsd: -500
    });

    expect(res.valid).toBe(false);
    expect(res.error).toBe('Monthly remote income USD must be a positive number');
  });
});

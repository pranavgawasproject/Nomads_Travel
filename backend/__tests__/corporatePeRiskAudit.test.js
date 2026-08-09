import { calculateNomadCorporatePermanentEstablishmentRiskAudit } from '../utils/travelUtils.js';

describe('calculateNomadCorporatePermanentEstablishmentRiskAudit', () => {
  test('evaluates safe stays within threshold correctly', () => {
    const res = calculateNomadCorporatePermanentEstablishmentRiskAudit({
      remoteWorkerStays: [
        { country: 'PORTUGAL', durationDays: 45, role: 'ENGINEER', generatesRevenue: false },
        { country: 'SPAIN', durationDays: 30, role: 'DESIGNER', generatesRevenue: false }
      ],
      companyJurisdiction: 'US',
      peThresholdDays: 90
    });

    expect(res.valid).toBe(true);
    expect(res.peRiskTier).toBe('LOW_PE_RISK');
    expect(res.flaggedJurisdictions.length).toEqual(0);
  });

  test('identifies critical PE risk when duration threshold and executive role with revenue generation is present', () => {
    const res = calculateNomadCorporatePermanentEstablishmentRiskAudit({
      remoteWorkerStays: [
        { country: 'GERMANY', durationDays: 120, role: 'EXECUTIVE', generatesRevenue: true },
        { country: 'UK', durationDays: 100, role: 'VP_SALES', generatesRevenue: true }
      ],
      companyJurisdiction: 'US',
      peThresholdDays: 90
    });

    expect(res.valid).toBe(true);
    expect(res.peRiskTier).toBe('CRITICAL_PE_RISK');
    expect(res.flaggedJurisdictions.length).toBeGreaterThanOrEqual(2);
  });

  test('returns error for empty worker stays input', () => {
    const res = calculateNomadCorporatePermanentEstablishmentRiskAudit({
      remoteWorkerStays: []
    });

    expect(res.valid).toBe(false);
    expect(res.peRiskTier).toBe('INELIGIBLE');
  });
});

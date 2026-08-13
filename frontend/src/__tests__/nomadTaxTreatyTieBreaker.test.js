import assert from 'node:assert';
import { calculateNomadTaxTreatyTieBreakerRisk } from '../lib/nomadCostCalculator.js';

console.log('\n--- Testing calculateNomadTaxTreatyTieBreakerRisk ---');

// Test 1: Single residency treaty safe (permanent home in primary country only)
const res1 = calculateNomadTaxTreatyTieBreakerRisk({
  primaryCountryName: 'Portugal',
  secondaryCountryName: 'US',
  primaryCountryDaysCount: 200,
  secondaryCountryDaysCount: 100,
  hasPermanentHomePrimary: true,
  hasPermanentHomeSecondary: false
});

assert.strictEqual(res1.valid, true);
assert.strictEqual(res1.tieBreakerResultCountry, 'Portugal');
assert.strictEqual(res1.treatyArticle4Step, 'PERMANENT_HOME_TEST');
assert.strictEqual(res1.complianceTier, 'TREATY_TIE_BREAKER_CLAIM_RECOMMENDED');
console.log('✓ Test 1 Passed: Permanent Home test tie-breaker verified');

// Test 2: Dual residency triggered with Center of Vital Interests tie-breaker
const res2 = calculateNomadTaxTreatyTieBreakerRisk({
  primaryCountryName: 'Spain',
  secondaryCountryName: 'UK',
  primaryCountryDaysCount: 190,
  secondaryCountryDaysCount: 185,
  hasPermanentHomePrimary: true,
  hasPermanentHomeSecondary: true,
  centerOfVitalInterestsLocation: 'Primary',
  annualGlobalIncomeUsd: 150000
});

assert.strictEqual(res2.valid, true);
assert.strictEqual(res2.isDualResidentTriggered, true);
assert.strictEqual(res2.tieBreakerResultCountry, 'Spain');
assert.strictEqual(res2.treatyArticle4Step, 'CENTER_OF_VITAL_INTERESTS_TEST');
assert.strictEqual(res2.complianceTier, 'DUAL_RESIDENCY_DOUBLE_TAXATION_RISK');
assert.strictEqual(res2.doubleTaxationExposureUsd, 82500.0);
console.log('✓ Test 2 Passed: Center of Vital Interests tie-breaker verified');

// Test 3: Habitual Abode tie-breaker step
const res3 = calculateNomadTaxTreatyTieBreakerRisk({
  primaryCountryName: 'France',
  secondaryCountryName: 'Germany',
  primaryCountryDaysCount: 190,
  secondaryCountryDaysCount: 190,
  hasPermanentHomePrimary: true,
  hasPermanentHomeSecondary: true,
  centerOfVitalInterestsLocation: 'Balanced',
  habitualAbodeDaysPrimary: 220,
  habitualAbodeDaysSecondary: 145
});

assert.strictEqual(res3.valid, true);
assert.strictEqual(res3.tieBreakerResultCountry, 'France');
assert.strictEqual(res3.treatyArticle4Step, 'HABITUAL_ABODE_TEST');
console.log('✓ Test 3 Passed: Habitual Abode tie-breaker verified');

// Test 4: Invalid negative input handling
const res4 = calculateNomadTaxTreatyTieBreakerRisk({
  primaryCountryDaysCount: -10
});

assert.strictEqual(res4.valid, false);
assert.strictEqual(res4.complianceTier, 'INVALID_INPUT');
console.log('✓ Test 4 Passed: Invalid negative input handled cleanly');

console.log('All calculateNomadTaxTreatyTieBreakerRisk tests passed successfully!\n');

import assert from 'node:assert';
import { calculateNomadSubstantialPresenceTestRisk } from '../lib/nomadCostCalculator.js';

console.log('\n--- Testing calculateNomadSubstantialPresenceTestRisk ---');

// Test 1: Full SPT tax residency triggered
const res1 = calculateNomadSubstantialPresenceTestRisk({
  currentYearUsDaysCount: 140,
  priorYearUsDaysCount: 120,
  twoYearsPriorUsDaysCount: 120,
  hasCloserConnectionToForeignCountry: false,
  annualGlobalIncomeUsd: 150000,
  usTaxRatePct: 24.0
});

assert.strictEqual(res1.valid, true);
assert.strictEqual(res1.meetsSubstantialPresenceTest, true);
assert.strictEqual(res1.usTaxResidencyStatus, 'US_TAX_RESIDENT_TRIGGERED');
assert.strictEqual(res1.complianceTier, 'DUAL_TAX_RESIDENCY_TRIGGERED');
assert.strictEqual(res1.sptWeightedDaysCount, 200);
assert.strictEqual(res1.estimatedUsTaxExposureUsd, 36000);
console.log('✓ Test 1 Passed: Substantial Presence Test tax residency trigger verified');

// Test 2: Qualifies for IRS Form 8840 Closer Connection Exception (< 183 current days & foreign tax home)
const res2 = calculateNomadSubstantialPresenceTestRisk({
  currentYearUsDaysCount: 140,
  priorYearUsDaysCount: 120,
  twoYearsPriorUsDaysCount: 120,
  hasCloserConnectionToForeignCountry: true,
  annualGlobalIncomeUsd: 150000
});

assert.strictEqual(res2.valid, true);
assert.strictEqual(res2.meetsSubstantialPresenceTest, true);
assert.strictEqual(res2.qualifiesForForm8840CloserConnection, true);
assert.strictEqual(res2.usTaxResidencyStatus, 'EXEMPT_VIA_FORM_8840');
assert.strictEqual(res2.complianceTier, 'FORM_8840_CLOSER_CONNECTION_QUALIFIED');
assert.strictEqual(res2.estimatedUsTaxExposureUsd, 0);
console.log('✓ Test 2 Passed: Form 8840 Closer Connection Exception verified cleanly');

// Test 3: Low US days, no SPT risk
const res3 = calculateNomadSubstantialPresenceTestRisk({
  currentYearUsDaysCount: 30,
  priorYearUsDaysCount: 30,
  twoYearsPriorUsDaysCount: 30
});

assert.strictEqual(res3.valid, true);
assert.strictEqual(res3.meetsSubstantialPresenceTest, false);
assert.strictEqual(res3.usTaxResidencyStatus, 'NON_RESIDENT_ALIEN');
assert.strictEqual(res3.complianceTier, 'NO_US_TAX_RESIDENCY_RISK');
console.log('✓ Test 3 Passed: Low US presence non-resident alien status verified');

// Test 4: Invalid input handling
const res4 = calculateNomadSubstantialPresenceTestRisk({
  currentYearUsDaysCount: -10
});

assert.strictEqual(res4.valid, false);
assert.strictEqual(res4.complianceTier, 'INVALID_INPUT');
console.log('✓ Test 4 Passed: Handles invalid negative day counts cleanly');

console.log('All calculateNomadSubstantialPresenceTestRisk tests passed successfully!\n');

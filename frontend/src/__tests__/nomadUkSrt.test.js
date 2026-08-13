import assert from 'node:assert';
import { calculateNomadUkStatutoryResidenceTestRisk } from '../lib/nomadCostCalculator.js';

console.log('\n--- Testing calculateNomadUkStatutoryResidenceTestRisk ---');

// Test 1: Automatic Overseas Test (Exempt)
const res1 = calculateNomadUkStatutoryResidenceTestRisk({
  daysInUkCurrentTaxYear: 30,
  daysInUkPriorYear1: 0,
  daysInUkPriorYear2: 0,
  daysInUkPriorYear3: 0,
  annualGlobalIncomeGbp: 120000
});

assert.strictEqual(res1.valid, true);
assert.strictEqual(res1.isUkTaxResident, false);
assert.strictEqual(res1.complianceTier, 'AUTOMATIC_OVERSEAS_EXEMPT');
assert.strictEqual(res1.estimatedUkTaxExposureGbp, 0);
console.log('✓ Test 1 Passed: Automatic Overseas Test exemption verified');

// Test 2: Automatic UK Test (183+ days in UK)
const res2 = calculateNomadUkStatutoryResidenceTestRisk({
  daysInUkCurrentTaxYear: 190,
  daysInUkPriorYear1: 30,
  daysInUkPriorYear2: 30,
  daysInUkPriorYear3: 30,
  annualGlobalIncomeGbp: 100000,
  ukIncomeTaxRatePct: 40.0
});

assert.strictEqual(res2.valid, true);
assert.strictEqual(res2.isUkTaxResident, true);
assert.strictEqual(res2.srtTestCategory, 'AUTOMATIC_UK_TEST');
assert.strictEqual(res2.complianceTier, 'UK_TAX_RESIDENCY_TRIGGERED');
assert.strictEqual(res2.estimatedUkTaxExposureGbp, 40000);
console.log('✓ Test 2 Passed: Automatic UK Test residency triggered');

// Test 3: Sufficient Ties Test residency triggered
const res3 = calculateNomadUkStatutoryResidenceTestRisk({
  daysInUkCurrentTaxYear: 100,
  daysInUkPriorYear1: 100, // 90-day tie
  daysInUkPriorYear2: 0,
  daysInUkPriorYear3: 0,
  hasUkFamily: true, // Family tie
  hasUkAccommodation: true, // Accommodation tie
  ukWorkDaysCount: 45 // Work tie (>40 days)
});

assert.strictEqual(res3.valid, true);
assert.strictEqual(res3.isUkTaxResident, true);
assert.strictEqual(res3.srtTestCategory, 'SUFFICIENT_TIES_TEST');
assert.strictEqual(res3.tiesCount, 4);
console.log('✓ Test 3 Passed: Sufficient Ties Test UK residency verified');

// Test 4: Invalid input handling
const res4 = calculateNomadUkStatutoryResidenceTestRisk({
  daysInUkCurrentTaxYear: -5
});

assert.strictEqual(res4.valid, false);
assert.strictEqual(res4.complianceTier, 'INVALID_INPUT');
console.log('✓ Test 4 Passed: Invalid negative day count handled cleanly');

console.log('All calculateNomadUkStatutoryResidenceTestRisk tests passed successfully!\n');

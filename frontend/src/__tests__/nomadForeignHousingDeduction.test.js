import assert from 'assert';
import { calculateNomadForeignHousingDeductionAudit } from '../lib/nomadCostCalculator.js';

console.log('\n--- Testing calculateNomadForeignHousingDeductionAudit ---');

// Test 1: Full Foreign Housing Deduction qualified in London
const res1 = calculateNomadForeignHousingDeductionAudit({
  annualForeignEarnedIncomeUsd: 140000,
  actualForeignHousingExpensesUsd: 35000,
  localityName: 'London',
  qualifyingForeignDaysCount: 340,
  feieMaximumExclusionLimitUsd: 126500,
  usEffectiveTaxRatePct: 24.0
});

assert.strictEqual(res1.valid, true);
assert.strictEqual(res1.complianceTier, 'FULL_FOREIGN_HOUSING_DEDUCTION_QUALIFIED');
assert.strictEqual(res1.baseHousingThresholdUsd, 20240); // 16% of 126500
assert.strictEqual(res1.eligibleHousingDeductionUsd, 14760); // 35000 - 20240
assert.strictEqual(res1.estimatedTaxSavingsUsd, 3542.40); // 24% of 14760
console.log('✓ Test 1 Passed: Full foreign housing deduction verified');

// Test 2: Expenses below base threshold ineligible
const res2 = calculateNomadForeignHousingDeductionAudit({
  annualForeignEarnedIncomeUsd: 90000,
  actualForeignHousingExpensesUsd: 15000,
  localityName: 'Bali',
  qualifyingForeignDaysCount: 350
});

assert.strictEqual(res2.valid, true);
assert.strictEqual(res2.complianceTier, 'BELOW_BASE_HOUSING_THRESHOLD_INELIGIBLE');
assert.strictEqual(res2.eligibleHousingDeductionUsd, 0);
console.log('✓ Test 2 Passed: Below base housing threshold ineligible verified');

// Test 3: Locality cap exceeded (capped at max locality limit)
const res3 = calculateNomadForeignHousingDeductionAudit({
  annualForeignEarnedIncomeUsd: 250000,
  actualForeignHousingExpensesUsd: 80000,
  localityName: 'Tokyo',
  qualifyingForeignDaysCount: 345
});

assert.strictEqual(res3.valid, true);
assert.strictEqual(res3.complianceTier, 'LOCALITY_CAP_EXCEEDED_PARTIAL_DEDUCTION');
assert.strictEqual(res3.maxLocalityCapUsd, 55000);
assert.strictEqual(res3.eligibleHousingDeductionUsd, 34760); // 55000 - 20240 cap
console.log('✓ Test 3 Passed: Locality cap partial deduction verified');

// Test 4: Physical presence test failed (< 330 days)
const res4 = calculateNomadForeignHousingDeductionAudit({
  annualForeignEarnedIncomeUsd: 120000,
  actualForeignHousingExpensesUsd: 30000,
  localityName: 'Zurich',
  qualifyingForeignDaysCount: 200
});

assert.strictEqual(res4.valid, true);
assert.strictEqual(res4.complianceTier, 'FEIE_PHYSICAL_PRESENCE_INELIGIBLE');
assert.strictEqual(res4.eligibleHousingDeductionUsd, 0);
console.log('✓ Test 4 Passed: Physical presence test failure handled cleanly');

// Test 5: Invalid input handling
const res5 = calculateNomadForeignHousingDeductionAudit({ annualForeignEarnedIncomeUsd: 0 });
assert.strictEqual(res5.valid, false);
console.log('✓ Test 5 Passed: Invalid input handling verified');

console.log('All calculateNomadForeignHousingDeductionAudit tests passed successfully!\n');

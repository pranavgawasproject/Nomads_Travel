import { calculateNomadMonthlyBudgetAndVisaRunCost } from '../lib/nomadCostCalculator.js';

console.log('--- Testing calculateNomadMonthlyBudgetAndVisaRunCost ---');

// Test 1: Standard 3-month stay within visa limits (e.g. Chiang Mai)
const test1 = calculateNomadMonthlyBudgetAndVisaRunCost({
  cityName: 'Chiang Mai',
  monthlyHousingUsd: 400,
  monthlyCoworkingUsd: 120,
  monthlyFoodUsd: 250,
  monthlyTransportUsd: 60,
  monthlySimAndTechUsd: 30,
  monthlyHealthInsuranceUsd: 90,
  stayDurationMonths: 3,
  visaMaxStayDays: 90,
  isCoLivingOption: true
});

if (
  test1.valid &&
  test1.cityName === 'Chiang Mai' &&
  test1.borderRunsRequiredCount === 0 &&
  test1.totalVisaExpensesUsd === 0 &&
  test1.coLivingSavingsUsd === 180 &&
  test1.budgetTier === 'BUDGET_FRIENDLY_HUB'
) {
  console.log('✓ Test 1 Passed: Budget friendly nomad stay verified cleanly');
} else {
  console.error('✗ Test 1 Failed:', test1);
  process.exit(1);
}

// Test 2: Extended 7-month stay exceeding visa limit and triggering tax residency warning
const test2 = calculateNomadMonthlyBudgetAndVisaRunCost({
  cityName: 'Lisbon',
  monthlyHousingUsd: 1400,
  monthlyCoworkingUsd: 250,
  monthlyFoodUsd: 600,
  monthlyTransportUsd: 100,
  monthlySimAndTechUsd: 50,
  monthlyHealthInsuranceUsd: 120,
  stayDurationMonths: 7,
  visaMaxStayDays: 90,
  visaBorderRunFlightCostUsd: 180,
  visaExtensionFeeUsd: 60
});

if (
  test2.valid &&
  test2.cityName === 'Lisbon' &&
  test2.borderRunsRequiredCount === 2 &&
  test2.totalVisaExpensesUsd === 480 &&
  test2.taxResidencyRiskWarning === true &&
  test2.budgetTier === 'PREMIUM_GLOBAL_HUB'
) {
  console.log('✓ Test 2 Passed: Correctly flags border runs required and 183-day tax residency risk');
} else {
  console.error('✗ Test 2 Failed:', test2);
  process.exit(1);
}

// Test 3: Invalid Input Validation
const test3 = calculateNomadMonthlyBudgetAndVisaRunCost({
  cityName: '',
  monthlyHousingUsd: 0
});

if (!test3.valid && test3.budgetTier === 'INVALID_INPUT') {
  console.log('✓ Test 3 Passed: Handles empty input validation cleanly');
} else {
  console.error('✗ Test 3 Failed:', test3);
  process.exit(1);
}

console.log('All calculateNomadMonthlyBudgetAndVisaRunCost tests passed successfully!\n');

import {
  calculateNomadMonthlyBudgetAndVisaRunCost,
  calculateNomadFeieTaxExclusionCompliance,
  calculateNomadSchengenRollingWindowCompliance,
  calculateNomadDigitalNomadVisaIncomeTaxOptimization,
  calculateNomadPermanentEstablishmentRisk
} from '../lib/nomadCostCalculator.js';

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

console.log('--- Testing calculateNomadFeieTaxExclusionCompliance ---');

// Test 4: Fully qualified FEIE exclusion (335 foreign days out of 365)
const feieTest1 = calculateNomadFeieTaxExclusionCompliance({
  annualEarnedIncomeUsd: 110000,
  daysInForeignCountriesCount: 335,
  foreignHousingExpenseUsd: 22000,
  usEffectiveTaxRatePct: 25.0
});

if (
  feieTest1.valid &&
  feieTest1.meetsPhysicalPresenceTest === true &&
  feieTest1.eligibleExclusionUsd === 110000 &&
  feieTest1.estimatedTaxSavingsUsd === 27500 &&
  feieTest1.complianceTier === 'QUALIFIED_FULL_FEIE_EXCLUSION'
) {
  console.log('✓ Test 4 Passed: Fully qualified FEIE exclusion verified cleanly');
} else {
  console.error('✗ Test 4 Failed:', feieTest1);
  process.exit(1);
}

// Test 5: Insufficient foreign days warning (310 days abroad out of 365)
const feieTest2 = calculateNomadFeieTaxExclusionCompliance({
  annualEarnedIncomeUsd: 120000,
  daysInForeignCountriesCount: 310
});

if (
  feieTest2.valid &&
  feieTest2.meetsPhysicalPresenceTest === false &&
  feieTest2.daysNeededForQualificationCount === 20 &&
  feieTest2.eligibleExclusionUsd === 0 &&
  feieTest2.complianceTier === 'INSUFFICIENT_FOREIGN_PRESENCE_RISK'
) {
  console.log('✓ Test 5 Passed: Correctly flags insufficient foreign days and days needed abroad');
} else {
  console.error('✗ Test 5 Failed:', feieTest2);
  process.exit(1);
}

console.log('All calculateNomadFeieTaxExclusionCompliance tests passed successfully!\n');

console.log('--- Testing calculateNomadSchengenRollingWindowCompliance ---');

// Test 6: Compliant 60-day Schengen stay with 15 past days
const schengenTest1 = calculateNomadSchengenRollingWindowCompliance({
  plannedSchengenDaysCount: 60,
  past180DaysSchengenCount: 15
});

if (
  schengenTest1.valid &&
  schengenTest1.totalDaysInWindow === 75 &&
  schengenTest1.daysRemainingAllowed === 75 &&
  schengenTest1.overstayDaysCount === 0 &&
  schengenTest1.complianceTier === 'FULL_SCHENGEN_COMPLIANT'
) {
  console.log('✓ Test 6 Passed: Fully compliant Schengen stay verified');
} else {
  console.error('✗ Test 6 Failed:', schengenTest1);
  process.exit(1);
}

// Test 7: Overstay violation (planned 60 days, 45 past days in window = 105 days total)
const schengenTest2 = calculateNomadSchengenRollingWindowCompliance({
  plannedSchengenDaysCount: 60,
  past180DaysSchengenCount: 45
});

if (
  schengenTest2.valid &&
  schengenTest2.totalDaysInWindow === 105 &&
  schengenTest2.overstayDaysCount === 15 &&
  schengenTest2.estimatedFineEur === 750 &&
  schengenTest2.complianceTier === 'SCHENGEN_90_180_OVERSTAY_VIOLATION'
) {
  console.log('✓ Test 7 Passed: Correctly flags Schengen 90/180-day overstay violation');
} else {
  console.error('✗ Test 7 Failed:', schengenTest2);
  process.exit(1);
}

console.log('All calculateNomadSchengenRollingWindowCompliance tests passed successfully!\n');

console.log('--- Testing calculateNomadDigitalNomadVisaIncomeTaxOptimization ---');

// Test 8: Qualified Spain DNV tax optimization
const dnvTest1 = calculateNomadDigitalNomadVisaIncomeTaxOptimization({
  annualRemoteIncomeUsd: 80000,
  destinationCountry: 'Spain',
  stayMonths: 12,
  homeCountryTaxRatePct: 30.0
});

if (
  dnvTest1.valid &&
  dnvTest1.destinationCountry === 'Spain' &&
  dnvTest1.meetsMinimumIncomeRequirement === true &&
  dnvTest1.baselineHomeTaxUsd === 24000 &&
  dnvTest1.dnvTaxUsd === 19200 &&
  dnvTest1.annualTaxSavingsUsd === 4800 &&
  dnvTest1.complianceTier === 'QUALIFIED_DNV_TAX_OPTIMIZED'
) {
  console.log('✓ Test 8 Passed: Qualified DNV tax savings calculated correctly');
} else {
  console.error('✗ Test 8 Failed:', dnvTest1);
  process.exit(1);
}

// Test 9: Zero-tax Dubai DNV for foreign source income
const dnvTest2 = calculateNomadDigitalNomadVisaIncomeTaxOptimization({
  annualRemoteIncomeUsd: 100000,
  destinationCountry: 'Dubai',
  isForeignSourceIncome: true,
  homeCountryTaxRatePct: 35.0
});

if (
  dnvTest2.valid &&
  dnvTest2.destinationCountry === 'Dubai' &&
  dnvTest2.meetsMinimumIncomeRequirement === true &&
  dnvTest2.dnvTaxUsd === 0 &&
  dnvTest2.annualTaxSavingsUsd === 35000 &&
  dnvTest2.complianceTier === 'ZERO_TAX_FOREIGN_INCOME_EXEMPT'
) {
  console.log('✓ Test 9 Passed: Zero-tax Dubai DNV exemption verified cleanly');
} else {
  console.error('✗ Test 9 Failed:', dnvTest2);
  process.exit(1);
}

console.log('All calculateNomadDigitalNomadVisaIncomeTaxOptimization tests passed successfully!\n');

console.log('--- Testing calculateNomadPermanentEstablishmentRisk ---');

// Test 10: High PE risk (contract signing authority + 120-day stay in Portugal)
const peTest1 = calculateNomadPermanentEstablishmentRisk({
  employeeName: 'Sarah Jenkins',
  employerHomeCountry: 'US',
  hostCountry: 'Portugal',
  stayDaysCount: 120,
  hasContractSigningAuthority: true,
  isExecutiveOrManager: true,
  companyAnnualRevenueUsd: 10000000
});

if (
  peTest1.valid &&
  peTest1.peRiskScore >= 60 &&
  peTest1.maxRecommendedSafeDaysCount === 30 &&
  peTest1.daysExceedingSafeLimitCount === 90 &&
  peTest1.complianceTier === 'HIGH_CORPORATE_PE_TAX_NEXUS_RISK'
) {
  console.log('✓ Test 10 Passed: High PE risk for signing authority verified cleanly');
} else {
  console.error('✗ Test 10 Failed:', peTest1);
  process.exit(1);
}

// Test 11: Low PE risk (45-day stay, no signing authority)
const peTest2 = calculateNomadPermanentEstablishmentRisk({
  employeeName: 'Alex Rivera',
  hostCountry: 'Spain',
  stayDaysCount: 45,
  hasContractSigningAuthority: false,
  isExecutiveOrManager: false
});

if (
  peTest2.valid &&
  peTest2.peRiskScore < 30 &&
  peTest2.maxRecommendedSafeDaysCount === 90 &&
  peTest2.complianceTier === 'LOW_PE_RISK_COMPLIANT'
) {
  console.log('✓ Test 11 Passed: Low PE risk for short stay verified cleanly');
} else {
  console.error('✗ Test 11 Failed:', peTest2);
  process.exit(1);
}

console.log('All calculateNomadPermanentEstablishmentRisk tests passed successfully!\n');

"use client";

import { useState } from "react";
import { Calculator, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, Building, Briefcase } from "lucide-react";
import { type City, type CostOfLiving, type VisaInfo } from "@/lib/supabase";

interface NomadBudgetCalculatorProps {
  city: City;
  cost: CostOfLiving | null;
  visa: VisaInfo | null;
}

export function NomadBudgetCalculator({ city, cost, visa }: NomadBudgetCalculatorProps) {
  const [months, setMonths] = useState<number>(3);
  const [isCoLiving, setIsCoLiving] = useState<boolean>(false);
  const [includeCoworking, setIncludeCoworking] = useState<boolean>(true);

  // Cost estimates based on database values or fallbacks
  const baseHousing = cost?.housing ?? Math.round(city.cost_usd * 0.4);
  const effectiveHousing = isCoLiving ? Math.round(baseHousing * 0.85) : baseHousing;
  const coLivingSavingsMonthly = baseHousing - effectiveHousing;

  const coworkingCost = includeCoworking ? (cost?.coworking ?? 150) : 0;
  const foodCost = cost?.food ?? Math.round(city.cost_usd * 0.25);
  const transportCost = cost?.transport ?? 50;
  const internetCost = cost?.internet ?? 30;
  const entertainmentCost = cost?.entertainment ?? 100;
  const healthCost = cost?.health ?? 80;
  const visaMiscCost = (cost?.visa ?? 40) + (cost?.misc ?? 60);

  const baseMonthlyTotal =
    effectiveHousing +
    coworkingCost +
    foodCost +
    transportCost +
    internetCost +
    entertainmentCost +
    healthCost +
    visaMiscCost;

  const totalDays = months * 30;
  const maxTouristDays = visa?.tourist_days ?? 90;

  let borderRunsCount = 0;
  let totalBorderRunExpense = 0;
  const borderRunUnitCost = 270; // Flight + extension fee estimate

  if (totalDays > maxTouristDays) {
    const excessDays = totalDays - maxTouristDays;
    borderRunsCount = Math.ceil(excessDays / maxTouristDays);
    totalBorderRunExpense = borderRunsCount * borderRunUnitCost;
  }

  const totalTripBudget = Math.round(baseMonthlyTotal * months + totalBorderRunExpense);
  const amortizedMonthlyCost = Math.round(totalTripBudget / months);
  const totalCoLivingSavings = coLivingSavingsMonthly * months;

  const isTaxResidencyTriggered = totalDays >= (visa?.tax_residency_days ?? 183);

  let budgetBadge = "Moderate Cost Hub";
  let budgetColor = "text-amber-600 bg-amber-500/10 border-amber-500/20";
  if (amortizedMonthlyCost < 1200) {
    budgetBadge = "Budget Friendly Hub";
    budgetColor = "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
  } else if (amortizedMonthlyCost > 2200) {
    budgetBadge = "Premium Nomad Hub";
    budgetColor = "text-accent bg-accent/10 border-accent/20";
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-forest">
            <Calculator className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Live Workation Planner</span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight">
            Nomad Budget & Stay Calculator
          </h2>
          <p className="text-sm text-muted-foreground">
            Custom trip expenses, visa runs, and tax threshold analysis for {city.name}.
          </p>
        </div>
        <div className={`inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border px-3 py-1 text-xs font-semibold ${budgetColor}`}>
          <Sparkles className="h-3.5 w-3.5" />
          {budgetBadge}
        </div>
      </div>

      {/* Input Controls */}
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {/* Months Slider */}
        <div className="rounded-2xl border border-border bg-secondary/30 p-4">
          <label className="flex items-center justify-between text-xs font-semibold text-foreground/80">
            <span>Planned Stay</span>
            <span className="font-mono text-sm font-bold text-forest">{months} {months === 1 ? "month" : "months"}</span>
          </label>
          <input
            type="range"
            min="1"
            max="12"
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value, 10))}
            className="mt-3 w-full accent-forest cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>1 mo (30d)</span>
            <span>6 mo (180d)</span>
            <span>12 mo (360d)</span>
          </div>
        </div>

        {/* Co-living Toggle */}
        <div className="rounded-2xl border border-border bg-secondary/30 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
              <Building className="h-4 w-4 text-forest" />
              Co-Living Shared Housing
            </span>
            <input
              type="checkbox"
              checked={isCoLiving}
              onChange={(e) => setIsCoLiving(e.target.checked)}
              className="h-4 w-4 rounded accent-forest cursor-pointer"
            />
          </div>
          <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
            15% estimated accommodation discount + social community perks.
          </p>
        </div>

        {/* Coworking Toggle */}
        <div className="rounded-2xl border border-border bg-secondary/30 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
              <Briefcase className="h-4 w-4 text-forest" />
              Coworking Hot Desk
            </span>
            <input
              type="checkbox"
              checked={includeCoworking}
              onChange={(e) => setIncludeCoworking(e.target.checked)}
              className="h-4 w-4 rounded accent-forest cursor-pointer"
            />
          </div>
          <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
            Includes desk + high-speed fiber internet in budget.
          </p>
        </div>
      </div>

      {/* Output Metric Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Amortized Cost</div>
          <div className="mt-1 font-serif text-2xl font-bold text-forest">${amortizedMonthlyCost.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
          <div className="mt-1 text-[11px] text-muted-foreground">Includes visa & runs</div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Trip Budget</div>
          <div className="mt-1 font-serif text-2xl font-bold text-foreground">${totalTripBudget.toLocaleString()}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">For {months} months stay</div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Border Runs</div>
          <div className="mt-1 font-serif text-2xl font-bold text-foreground">{borderRunsCount}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">{borderRunsCount > 0 ? `~$${totalBorderRunExpense} total cost` : "None required"}</div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Co-Living Savings</div>
          <div className="mt-1 font-serif text-2xl font-bold text-emerald-600">${totalCoLivingSavings.toLocaleString()}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">{isCoLiving ? "Applied (15% off)" : "Toggle co-living above"}</div>
        </div>
      </div>

      {/* Dynamic Alerts */}
      <div className="mt-6 space-y-3">
        {/* Visa Run Notice */}
        {borderRunsCount > 0 && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-semibold">Visa Border Run Notice: </span>
              Your planned stay of {months} months ({totalDays} days) exceeds {city.country}&apos;s {maxTouristDays}-day tourist limit. Budget approximately <span className="font-bold">${totalBorderRunExpense}</span> for {borderRunsCount} border run(s) or apply for a formal visa.
            </div>
          </div>
        )}

        {/* Digital Nomad Visa Option */}
        {visa?.has_dn_visa && (
          <div className="flex items-start gap-3 rounded-2xl border border-forest/20 bg-forest/10 p-4 text-xs text-forest">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-forest mt-0.5" />
            <div>
              <span className="font-semibold">{city.country} Digital Nomad Visa Available: </span>
              {visa.dn_visa_duration ? `Valid for ${visa.dn_visa_duration}` : "Available for long-term remote workers"}
              {visa.dn_visa_cost ? ` (~${visa.dn_visa_cost})` : ""}.
              {visa.min_income ? ` Minimum income requirement: ${visa.min_income}.` : ""}
              {visa.tax_notes ? ` Note: ${visa.tax_notes}.` : ""}
            </div>
          </div>
        )}

        {/* Tax Residency Warning */}
        {isTaxResidencyTriggered && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-900 dark:text-red-200">
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <div>
              <span className="font-semibold">Tax Residency Alert: </span>
              Staying {totalDays} days in {city.country} meets or exceeds the 183-day international tax residency threshold. Consult a qualified tax professional regarding local foreign income tax compliance.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

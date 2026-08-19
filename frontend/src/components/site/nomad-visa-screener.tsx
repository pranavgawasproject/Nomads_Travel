"use client";

import { useState } from "react";
import { Sparkles, DollarSign, CheckCircle2, AlertCircle, ShieldCheck, Search, Filter } from "lucide-react";
import { type VisaInfo } from "@/lib/supabase";

interface NomadVisaScreenerProps {
  initialCountries: VisaInfo[];
}

export function NomadVisaScreener({ initialCountries }: NomadVisaScreenerProps) {
  const [monthlyIncomeUsd, setMonthlyIncomeUsd] = useState<number>(3000);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [onlyDnv, setOnlyDnv] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Helper to parse income minimum string into USD numerical value
  const parseMinIncomeUsd = (incomeStr?: string | null): number | null => {
    if (!incomeStr || incomeStr === "N/A" || incomeStr === "Varies" || incomeStr === "Proof of funds" || incomeStr === "Proof of income") return null;

    const cleanStr = incomeStr.replace(/,/g, "");
    const isYearly = cleanStr.includes("/yr") || cleanStr.includes("/year");

    const matchUsd = cleanStr.match(/\$(\d+)/);
    const matchEuro = cleanStr.match(/€(\d+)/);
    const matchYen = cleanStr.match(/¥(\d+)/);
    const matchReais = cleanStr.match(/R\$(\d+)/);
    const matchCzk = cleanStr.match(/CZK\s*(\d+)/i);
    const matchRm = cleanStr.match(/RM\s*(\d+)/i);
    const matchRand = cleanStr.match(/R\s*(\d+)/i);
    const matchNumber = cleanStr.match(/(\d+)/);

    let val: number | null = null;

    if (matchUsd) val = parseInt(matchUsd[1], 10);
    else if (matchEuro) val = Math.round(parseInt(matchEuro[1], 10) * 1.08);
    else if (matchYen) val = Math.round(parseInt(matchYen[1], 10) / 155);
    else if (matchCzk) val = Math.round(parseInt(matchCzk[1], 10) / 23);
    else if (matchRm) val = Math.round(parseInt(matchRm[1], 10) / 4.4);
    else if (matchRand) val = Math.round(parseInt(matchRand[1], 10) / 18);
    else if (matchReais) val = Math.round(parseInt(matchReais[1], 10) / 5.5);
    else if (matchNumber) val = parseInt(matchNumber[1], 10);

    if (val && isYearly) {
      val = Math.round(val / 12);
    }

    return val;
  };

  const countriesWithEligibility = initialCountries.map((country) => {
    const requiredIncome = parseMinIncomeUsd(country.min_income);
    let status: "eligible" | "near" | "short" | "no_dnv" = "no_dnv";

    if (!country.has_dn_visa) {
      status = "no_dnv";
    } else if (!requiredIncome) {
      status = "eligible"; // Proof of funds or no fixed minimum listed
    } else if (monthlyIncomeUsd >= requiredIncome) {
      status = "eligible";
    } else if (monthlyIncomeUsd >= requiredIncome * 0.8) {
      status = "near";
    } else {
      status = "short";
    }

    return {
      ...country,
      requiredIncomeUsd: requiredIncome,
      status,
    };
  });

  const filteredCountries = countriesWithEligibility.filter((c) => {
    if (searchQuery && !c.country.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (onlyDnv && !c.has_dn_visa) {
      return false;
    }
    return true;
  });

  const eligibleCount = filteredCountries.filter((c) => c.status === "eligible" && c.has_dn_visa).length;
  const totalDnvCount = filteredCountries.filter((c) => c.has_dn_visa).length;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-forest">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Interactive Visa Intelligence</span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight">
            Digital Nomad Visa Qualification & Income Screener
          </h2>
          <p className="text-sm text-muted-foreground">
            Instantly match your monthly income against official digital nomad visa thresholds worldwide.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-2xl border border-forest/20 bg-forest/10 px-4 py-2 text-xs font-semibold text-forest self-start sm:self-auto">
          <ShieldCheck className="h-4 w-4" />
          <span>Qualify for {eligibleCount} of {totalDnvCount} Nomad Visas</span>
        </div>
      </div>

      {/* Control Panel */}
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {/* Income Slider */}
        <div className="rounded-2xl border border-border bg-secondary/30 p-4">
          <label className="flex items-center justify-between text-xs font-semibold text-foreground/80">
            <span>Your Monthly Remote Income</span>
            <span className="font-mono text-sm font-bold text-forest">${monthlyIncomeUsd.toLocaleString()}/mo</span>
          </label>
          <input
            type="range"
            min="1000"
            max="10000"
            step="250"
            value={monthlyIncomeUsd}
            onChange={(e) => setMonthlyIncomeUsd(parseInt(e.target.value, 10))}
            className="mt-3 w-full accent-forest cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>$1,000</span>
            <span>$3,500</span>
            <span>$10,000+</span>
          </div>
        </div>

        {/* Quick Search */}
        <div className="rounded-2xl border border-border bg-secondary/30 p-4 flex flex-col justify-between">
          <label className="text-xs font-semibold text-foreground/80">Search Country</label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Spain, Thailand, Japan…"
              className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="rounded-2xl border border-border bg-secondary/30 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
              <Filter className="h-4 w-4 text-forest" />
              Dedicated Nomad Visas Only
            </span>
            <input
              type="checkbox"
              checked={onlyDnv}
              onChange={(e) => setOnlyDnv(e.target.checked)}
              className="h-4 w-4 rounded accent-forest cursor-pointer"
            />
          </div>
          <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
            Hide tourist-stay-only countries and show only official remote worker visas.
          </p>
        </div>
      </div>

      {/* Results Table */}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3.5 font-medium">Country</th>
              <th className="px-5 py-3.5 font-medium">Qualification Status</th>
              <th className="px-5 py-3.5 font-medium">Min. Income Req.</th>
              <th className="px-5 py-3.5 font-medium">Visa Duration</th>
              <th className="px-5 py-3.5 font-medium">Application Fee</th>
              <th className="px-5 py-3.5 font-medium">Processing Time</th>
              <th className="px-5 py-3.5 font-medium">Application Method</th>
              <th className="px-5 py-3.5 font-medium">Tax Residency Rule</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredCountries.map((c) => (
              <tr key={c.id || c.country} className="transition-colors hover:bg-secondary/30">
                <td className="px-5 py-4 font-serif text-base font-semibold">
                  {c.flag} {c.country}
                </td>
                <td className="px-5 py-4">
                  {c.status === "eligible" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Income Qualified
                    </span>
                  ) : c.status === "near" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-600">
                      <AlertCircle className="h-3.5 w-3.5" /> Near Target Income
                    </span>
                  ) : c.status === "short" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                      Higher Income Needed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                      Tourist Stay ({c.tourist_days}d)
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 font-mono text-xs font-semibold text-foreground/80">
                  {c.has_dn_visa ? (c.min_income || "Varies") : "N/A (Tourist)"}
                </td>
                <td className="px-5 py-4 text-foreground/80 text-xs">
                  {c.has_dn_visa ? c.dn_visa_duration : `${c.tourist_days} days tourist`}
                </td>
                <td className="px-5 py-4 text-foreground/80 text-xs">
                  {c.has_dn_visa ? c.dn_visa_cost : "N/A"}
                </td>
                <td className="px-5 py-4 text-xs text-muted-foreground">
                  {c.has_dn_visa ? (c.processing_time || "2-4 weeks") : "Instant"}
                </td>
                <td className="px-5 py-4 text-xs text-muted-foreground">
                  {c.has_dn_visa ? (c.application_method || "Online Portal") : "Entry Visa"}
                </td>
                <td className="px-5 py-4 text-xs text-muted-foreground">
                  {c.tax_residency_days ? `${c.tax_residency_days}d residency` : "183d rule"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

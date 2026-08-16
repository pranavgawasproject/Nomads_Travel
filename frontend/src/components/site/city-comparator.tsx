"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeftRight, 
  Wifi, 
  DollarSign, 
  ShieldCheck, 
  Smile, 
  Footprints, 
  Moon, 
  Wind,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  TrendingDown
} from "lucide-react";
import { supabase, type City, type CostOfLiving, type VisaInfo } from "@/lib/supabase";
import { cityPhotos } from "@/lib/city-images";

interface CityComparatorProps {
  initialCities: City[];
  defaultCityAId?: string;
  defaultCityBId?: string;
}

const costCategories: { key: keyof CostOfLiving; label: string }[] = [
  { key: "housing", label: "Housing / Rent" },
  { key: "coworking", label: "Coworking Desk" },
  { key: "food", label: "Food & Groceries" },
  { key: "transport", label: "Transport" },
  { key: "internet", label: "Internet & Mobile" },
  { key: "entertainment", label: "Entertainment" },
  { key: "health", label: "Health Insurance" },
  { key: "visa", label: "Visa Expenses" },
  { key: "misc", label: "Miscellaneous" },
];

const scoreMetrics: { key: keyof City; label: string; icon: typeof Wifi }[] = [
  { key: "cost_score", label: "Affordability", icon: DollarSign },
  { key: "internet_score", label: "Internet Speed", icon: Wifi },
  { key: "safety_score", label: "Safety", icon: ShieldCheck },
  { key: "fun_score", label: "Fun & Culture", icon: Smile },
  { key: "walkability_score", label: "Walkability", icon: Footprints },
  { key: "nightlife_score", label: "Nightlife", icon: Moon },
  { key: "air_score", label: "Air Quality", icon: Wind },
];

export function CityComparator({
  initialCities,
  defaultCityAId = "lisbon",
  defaultCityBId = "chiangmai",
}: CityComparatorProps) {
  const [cityAId, setCityAId] = useState<string>(defaultCityAId);
  const [cityBId, setCityBId] = useState<string>(defaultCityBId);

  const [costA, setCostA] = useState<CostOfLiving | null>(null);
  const [costB, setCostB] = useState<CostOfLiving | null>(null);

  const [visaA, setVisaA] = useState<VisaInfo | null>(null);
  const [visaB, setVisaB] = useState<VisaInfo | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const cityA = initialCities.find((c) => c.id === cityAId) || initialCities[0];
  const cityB = initialCities.find((c) => c.id === cityBId) || initialCities[1] || initialCities[0];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [resCostA, resCostB, resVisaA, resVisaB] = await Promise.all([
          supabase.from("cost_of_living").select("*").eq("city_id", cityA.id).maybeSingle(),
          supabase.from("cost_of_living").select("*").eq("city_id", cityB.id).maybeSingle(),
          supabase.from("visa_info").select("*").eq("country", cityA.country).maybeSingle(),
          supabase.from("visa_info").select("*").eq("country", cityB.country).maybeSingle(),
        ]);

        setCostA(resCostA.data as CostOfLiving | null);
        setCostB(resCostB.data as CostOfLiving | null);
        setVisaA(resVisaA.data as VisaInfo | null);
        setVisaB(resVisaB.data as VisaInfo | null);
      } catch (err) {
        console.error("Error loading comparator details:", err);
      } finally {
        setLoading(false);
      }
    }

    if (cityA && cityB) {
      loadData();
    }
  }, [cityA?.id, cityB?.id, cityA?.country, cityB?.country]);

  const handleSwap = () => {
    const temp = cityAId;
    setCityAId(cityBId);
    setCityBId(temp);
  };

  const costTotalA = costA
    ? costCategories.reduce((sum, item) => sum + Number(costA[item.key] || 0), 0)
    : Number(cityA?.cost_usd || 0);

  const costTotalB = costB
    ? costCategories.reduce((sum, item) => sum + Number(costB[item.key] || 0), 0)
    : Number(cityB?.cost_usd || 0);

  const diffUsd = Math.abs(costTotalA - costTotalB);
  const cheaperCity = costTotalA < costTotalB ? cityA : cityB;
  const pricierCity = costTotalA < costTotalB ? cityB : cityA;
  const pctSavings = pricierCity ? Math.round((diffUsd / (costTotalA < costTotalB ? costTotalB : costTotalA)) * 100) : 0;

  const photoA = cityA?.image || cityPhotos[cityA?.id];
  const photoB = cityB?.image || cityPhotos[cityB?.id];

  return (
    <div className="space-y-10">
      {/* Selector Header Bar */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* City A Selector */}
          <div className="flex-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-forest">
              Select Destination A
            </label>
            <select
              value={cityAId}
              onChange={(e) => setCityAId(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-forest"
            >
              {initialCities.map((c) => (
                <option key={`a-${c.id}`} value={c.id}>
                  {c.flag} {c.name}, {c.country} (${c.cost_usd}/mo)
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center md:pt-6">
            <button
              onClick={handleSwap}
              type="button"
              className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-secondary hover:bg-secondary/80 text-foreground transition-transform hover:scale-105 active:scale-95"
              title="Swap cities"
            >
              <ArrowLeftRight className="h-5 w-5 text-forest" />
            </button>
          </div>

          {/* City B Selector */}
          <div className="flex-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-accent">
              Select Destination B
            </label>
            <select
              value={cityBId}
              onChange={(e) => setCityBId(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {initialCities.map((c) => (
                <option key={`b-${c.id}`} value={c.id}>
                  {c.flag} {c.name}, {c.country} (${c.cost_usd}/mo)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Savings Highlight Badge */}
        {cityAId !== cityBId && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/20 text-emerald-600">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider">Financial Advantage</div>
                <div className="text-sm font-semibold">
                  Living in <span className="underline">{cheaperCity.name}</span> saves you ~${diffUsd.toLocaleString()}/mo ({pctSavings}% savings) compared to {pricierCity.name}.
                </div>
              </div>
            </div>
            <div className="font-mono text-base font-bold whitespace-nowrap">
              +${(diffUsd * 12).toLocaleString()}/yr Saved
            </div>
          </div>
        )}
      </div>

      {/* Hero Cards Comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* City A Card */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
          <div className="relative h-44 w-full overflow-hidden">
            {photoA ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${photoA}')` }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <span className="text-3xl">{cityA.flag}</span>
              <h2 className="font-serif text-3xl font-semibold tracking-tight">{cityA.name}</h2>
              <p className="text-xs text-white/80">{cityA.country} · {cityA.continent}</p>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border bg-secondary/30 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Est. Monthly Budget</div>
                <div className="font-serif text-xl font-bold text-forest">${costTotalA.toLocaleString()}</div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/30 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Internet Speed</div>
                <div className="font-serif text-xl font-bold text-foreground">{cityA.internet_mbps} Mbps</div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/30 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Overall Score</div>
                <div className="font-serif text-xl font-bold text-amber-500">★ {Number(cityA.overall_score).toFixed(1)} / 5</div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/30 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Visa Ease</div>
                <div className="font-serif text-xl font-bold text-foreground">{cityA.visa_difficulty}</div>
              </div>
            </div>
            <Link
              href={`/destinations/${cityA.id}`}
              className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/80"
            >
              Explore {cityA.name} Guide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* City B Card */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
          <div className="relative h-44 w-full overflow-hidden">
            {photoB ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${photoB}')` }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <span className="text-3xl">{cityB.flag}</span>
              <h2 className="font-serif text-3xl font-semibold tracking-tight">{cityB.name}</h2>
              <p className="text-xs text-white/80">{cityB.country} · {cityB.continent}</p>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border bg-secondary/30 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Est. Monthly Budget</div>
                <div className="font-serif text-xl font-bold text-accent">${costTotalB.toLocaleString()}</div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/30 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Internet Speed</div>
                <div className="font-serif text-xl font-bold text-foreground">{cityB.internet_mbps} Mbps</div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/30 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Overall Score</div>
                <div className="font-serif text-xl font-bold text-amber-500">★ {Number(cityB.overall_score).toFixed(1)} / 5</div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/30 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Visa Ease</div>
                <div className="font-serif text-xl font-bold text-foreground">{cityB.visa_difficulty}</div>
              </div>
            </div>
            <Link
              href={`/destinations/${cityB.id}`}
              className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/80"
            >
              Explore {cityB.name} Guide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Side-by-Side Monthly Cost Breakdown Table */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-forest">Granular Living Costs</span>
            <h3 className="font-serif text-2xl font-semibold tracking-tight">Monthly Expense Breakdown</h3>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Expense Category</th>
                <th className="px-4 py-3 font-medium text-forest">{cityA.flag} {cityA.name}</th>
                <th className="px-4 py-3 font-medium text-accent">{cityB.flag} {cityB.name}</th>
                <th className="px-4 py-3 font-medium text-right">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {costCategories.map((cat) => {
                const valA = costA ? Number(costA[cat.key] || 0) : 0;
                const valB = costB ? Number(costB[cat.key] || 0) : 0;
                const delta = valA - valB;

                return (
                  <tr key={cat.key} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-foreground/90">{cat.label}</td>
                    <td className="px-4 py-3.5 font-mono text-sm font-semibold text-foreground/80">${valA}</td>
                    <td className="px-4 py-3.5 font-mono text-sm font-semibold text-foreground/80">${valB}</td>
                    <td className="px-4 py-3.5 text-right font-mono text-xs font-semibold">
                      {delta === 0 ? (
                        <span className="text-muted-foreground">Equal</span>
                      ) : delta < 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {cityA.name} is ${Math.abs(delta)} cheaper
                        </span>
                      ) : (
                        <span className="text-indigo-600 dark:text-indigo-400">
                          {cityB.name} is ${delta} cheaper
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-secondary/40 font-bold">
                <td className="px-4 py-4 font-serif text-base">Estimated Total / Month</td>
                <td className="px-4 py-4 font-serif text-lg text-forest">${costTotalA.toLocaleString()}</td>
                <td className="px-4 py-4 font-serif text-lg text-accent">${costTotalB.toLocaleString()}</td>
                <td className="px-4 py-4 text-right font-mono text-sm font-bold text-foreground">
                  ${diffUsd.toLocaleString()} / mo difference
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Lifestyle Score Radar Bars */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="border-b border-border pb-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">Nomad Quality Metrics</span>
          <h3 className="font-serif text-2xl font-semibold tracking-tight">Lifestyle & Work Scores</h3>
        </div>

        <div className="mt-6 space-y-6">
          {scoreMetrics.map((m) => {
            const scoreA = Number(cityA[m.key] || 0);
            const scoreB = Number(cityB[m.key] || 0);

            return (
              <div key={m.key} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2 text-foreground">
                    <m.icon className="h-4 w-4 text-forest" />
                    {m.label}
                  </span>
                  <div className="flex gap-4 font-mono text-xs">
                    <span className="text-forest font-bold">{cityA.name}: {scoreA.toFixed(1)}/5</span>
                    <span className="text-accent font-bold">{cityB.name}: {scoreB.toFixed(1)}/5</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Bar A */}
                  <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-forest transition-all duration-500"
                      style={{ width: `${(scoreA / 5) * 100}%` }}
                    />
                  </div>

                  {/* Bar B */}
                  <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${(scoreB / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Digital Nomad Visa Rules Side-by-Side */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="border-b border-border pb-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-forest">Visa Intelligence</span>
          <h3 className="font-serif text-2xl font-semibold tracking-tight">Nomad Visa Eligibility Comparison</h3>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Country A */}
          <div className="rounded-2xl border border-border bg-secondary/30 p-5">
            <h4 className="font-serif text-lg font-semibold flex items-center gap-2">
              <span>{cityA.flag}</span> Visa Rules for {cityA.country}
            </h4>
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Tourist Stay Limit</span>
                <span className="font-semibold text-foreground">{visaA ? `${visaA.tourist_days} days` : "Varies"}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Digital Nomad Visa</span>
                <span className="font-semibold text-foreground">
                  {visaA?.has_dn_visa ? "Available" : "Not Offered"}
                </span>
              </div>
              {visaA?.has_dn_visa && (
                <>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Min. Income Req.</span>
                    <span className="font-semibold text-forest">{visaA.min_income || "Proof of funds"}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Visa Duration</span>
                    <span className="font-semibold text-foreground">{visaA.dn_visa_duration}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Visa Cost</span>
                    <span className="font-semibold text-foreground">{visaA.dn_visa_cost}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between pt-1">
                <span className="text-muted-foreground">Tax Residency Rule</span>
                <span className="font-semibold text-foreground">
                  {visaA?.tax_residency_days ? `${visaA.tax_residency_days}d residency` : "183-day rule"}
                </span>
              </div>
            </div>
          </div>

          {/* Country B */}
          <div className="rounded-2xl border border-border bg-secondary/30 p-5">
            <h4 className="font-serif text-lg font-semibold flex items-center gap-2">
              <span>{cityB.flag}</span> Visa Rules for {cityB.country}
            </h4>
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Tourist Stay Limit</span>
                <span className="font-semibold text-foreground">{visaB ? `${visaB.tourist_days} days` : "Varies"}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Digital Nomad Visa</span>
                <span className="font-semibold text-foreground">
                  {visaB?.has_dn_visa ? "Available" : "Not Offered"}
                </span>
              </div>
              {visaB?.has_dn_visa && (
                <>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Min. Income Req.</span>
                    <span className="font-semibold text-accent">{visaB.min_income || "Proof of funds"}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Visa Duration</span>
                    <span className="font-semibold text-foreground">{visaB.dn_visa_duration}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Visa Cost</span>
                    <span className="font-semibold text-foreground">{visaB.dn_visa_cost}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between pt-1">
                <span className="text-muted-foreground">Tax Residency Rule</span>
                <span className="font-semibold text-foreground">
                  {visaB?.tax_residency_days ? `${visaB.tax_residency_days}d residency` : "183-day rule"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

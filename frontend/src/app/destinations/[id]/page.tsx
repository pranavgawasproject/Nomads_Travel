import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Wifi,
  DollarSign,
  ShieldCheck,
  Smile,
  Footprints,
  Moon,
  Wind,
} from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { supabase, type City, type CostOfLiving, type VisaInfo, type Listing } from "@/lib/supabase";
import { cityPhotos, cityGradient } from "@/lib/city-images";
import { cn } from "@/lib/utils";

export const revalidate = 300;

const scoreRows: { key: keyof City; label: string; icon: typeof Wifi }[] = [
  { key: "cost_score", label: "Affordability", icon: DollarSign },
  { key: "internet_score", label: "Internet", icon: Wifi },
  { key: "safety_score", label: "Safety", icon: ShieldCheck },
  { key: "fun_score", label: "Fun & culture", icon: Smile },
  { key: "walkability_score", label: "Walkability", icon: Footprints },
  { key: "nightlife_score", label: "Nightlife", icon: Moon },
  { key: "air_score", label: "Air quality", icon: Wind },
];

const costRows: { key: keyof CostOfLiving; label: string }[] = [
  { key: "housing", label: "Housing" },
  { key: "coworking", label: "Coworking" },
  { key: "food", label: "Food & groceries" },
  { key: "transport", label: "Transport" },
  { key: "internet", label: "Internet" },
  { key: "entertainment", label: "Entertainment" },
  { key: "health", label: "Health & insurance" },
  { key: "visa", label: "Visa costs" },
  { key: "misc", label: "Miscellaneous" },
];

export default async function CityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let city: any = null;
  let cost: any = null;
  let visa: any = null;
  let listings: any = null;

  try {
    const [cityRes, costRes] = await Promise.all([
      supabase.from("cities").select("*").eq("id", id).maybeSingle(),
      supabase.from("cost_of_living").select("*").eq("city_id", id).maybeSingle(),
    ]);
    city = cityRes.data;
    cost = costRes.data;

    if (city) {
      const [visaRes, listingsRes] = await Promise.all([
        supabase
          .from("visa_info")
          .select("*")
          .eq("country", city.country)
          .maybeSingle(),
        supabase
          .from("listings")
          .select("id, company_name, company_type, city, country, starting_price, ratings, total_reviews, images")
          .eq("city", city.name)
          .eq("is_public", true)
          .order("ratings", { ascending: false })
          .limit(6),
      ]);
      visa = visaRes.data;
      listings = listingsRes.data;
    }
  } catch (error) {
    console.error("Error fetching city detail data:", error);
  }

  if (!city) notFound();

  const typedCity = city as City;
  const typedCost = cost as CostOfLiving | null;
  const typedVisa = visa as VisaInfo | null;
  const typedListings = (listings ?? []) as Listing[];


  const photo = cityPhotos[typedCity.id];
  const [gradient] = cityGradient(typedCity.id);
  const monthlyTotal = typedCost
    ? costRows.reduce((sum, r) => sum + (typedCost[r.key] as number), 0)
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1 pt-24 sm:pt-28">
        {/* Header */}
        <section className="relative overflow-hidden">
          <div className="relative h-64 sm:h-80">
            {photo ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${photo}')` }}
                aria-hidden
              />
            ) : (
              <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} aria-hidden />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10" />
          </div>

          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="relative -mt-24 pb-10 text-white">
              <Link
                href="/destinations"
                className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> All destinations
              </Link>
              <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight sm:text-6xl">
                {typedCity.flag} {typedCity.name}
              </h1>
              <p className="mt-2 text-lg text-white/85">
                {typedCity.country} · {typedCity.continent}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Stat label="Overall score" value={Number(typedCity.overall_score).toFixed(1)} />
                <Stat label="Cost / month" value={`$${typedCity.cost_usd.toLocaleString()}`} />
                <Stat label="Avg temp" value={`${typedCity.avg_temp}°C`} />
                <Stat label="Visa difficulty" value={typedCity.visa_difficulty} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            {/* Scores */}
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight">
                Lifestyle scores
              </h2>
              <div className="mt-6 space-y-4">
                {scoreRows.map((row) => {
                  const value = Number(typedCity[row.key] ?? 0);
                  return (
                    <div key={row.label}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-foreground/80">
                          <row.icon className="h-4 w-4 text-forest" />
                          {row.label}
                        </span>
                        <span className="font-medium tabular-nums">{value.toFixed(1)} / 5</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-forest"
                          style={{ width: `${(value / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {typedVisa && (
                <div className="mt-10 rounded-3xl border border-border bg-card p-6">
                  <h3 className="font-serif text-xl font-semibold">
                    Visa for {typedVisa.flag} {typedVisa.country}
                  </h3>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                    <InfoBlock label="Tourist stay" value={`${typedVisa.tourist_days} days`} />
                    <InfoBlock
                      label="Nomad visa"
                      value={typedVisa.has_dn_visa ? "Available" : "Not offered"}
                    />
                    {typedVisa.has_dn_visa && (
                      <>
                        <InfoBlock label="Cost" value={typedVisa.dn_visa_cost} />
                        <InfoBlock label="Duration" value={typedVisa.dn_visa_duration} />
                      </>
                    )}
                  </div>
                  <Link
                    href="/visa"
                    className="mt-4 inline-block text-sm font-medium text-forest hover:text-forest/80"
                  >
                    See all countries' visa rules →
                  </Link>
                </div>
              )}
            </div>

            {/* Cost breakdown */}
            {typedCost && (
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                <h2 className="font-serif text-2xl font-semibold tracking-tight">
                  Monthly cost breakdown
                </h2>
                <div className="mt-6 space-y-3">
                  {costRows.map((row) => {
                    const value = typedCost[row.key] as number;
                    const max = Math.max(...costRows.map((r) => typedCost[r.key] as number));
                    return (
                      <div key={row.label} className="flex items-center gap-3">
                        <span className="w-36 shrink-0 text-sm text-foreground/80">
                          {row.label}
                        </span>
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-sunset"
                            style={{ width: `${(value / max) * 100}%` }}
                          />
                        </div>
                        <span className="w-14 shrink-0 text-right text-sm font-medium tabular-nums">
                          ${value}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                  <span className="text-sm text-muted-foreground">Estimated total</span>
                  <span className="font-serif text-2xl font-semibold text-forest">
                    ${monthlyTotal?.toLocaleString()}
                  </span>
                </div>

                {(typedCost.tip1 || typedCost.tip2 || typedCost.tip3) && (
                  <ul className="mt-6 space-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
                    {[typedCost.tip1, typedCost.tip2, typedCost.tip3]
                      .filter(Boolean)
                      .map((tip) => (
                        <li key={tip} className="flex gap-2">
                          <span className="text-accent">·</span> {tip}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Workspaces in this city */}
          {typedListings.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-semibold tracking-tight">
                  Workspaces & stays in {typedCity.name}
                </h2>
                <Link
                  href={`/workspaces?city=${encodeURIComponent(typedCity.name)}`}
                  className="text-sm font-medium text-forest hover:text-forest/80"
                >
                  View all →
                </Link>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {typedListings.map((l) => (
                  <div
                    key={l.id}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
                      {l.company_type}
                    </span>
                    <h3 className="mt-3 font-serif text-lg font-semibold">{l.company_name}</h3>
                    {l.starting_price && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        From {l.starting_price}
                      </p>
                    )}
                    {l.ratings > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        ★ {Number(l.ratings).toFixed(1)} ({l.total_reviews} reviews)
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 backdrop-blur-md">
      <div className="text-[10px] uppercase tracking-wider text-white/70">{label}</div>
      <div className="font-serif text-lg font-semibold">{value}</div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}

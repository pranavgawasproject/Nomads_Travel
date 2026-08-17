import Link from "next/link";
import type { Metadata } from "next";
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
  Sparkles,
} from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { NomadBudgetCalculator } from "@/components/site/nomad-budget-calculator";
import { supabase, type City, type CostOfLiving, type VisaInfo, type Listing } from "@/lib/supabase";
import { cityPhotos, cityGradient } from "@/lib/city-images";
import { cn } from "@/lib/utils";

export const revalidate = 300;

const BASE_URL = "https://nomads-travel-indol.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const { data: city } = await supabase
      .from("cities")
      .select("id, name, country, flag, image, continent, overall_score, cost_usd, visa_difficulty, internet_mbps")
      .eq("id", id)
      .maybeSingle();

    if (!city) {
      return {
        title: "Destination not found | RoamIQ",
        description: "This destination could not be found on RoamIQ.",
      };
    }

    const title = `${city.flag ? city.flag + " " : ""}${city.name}, ${city.country} — Digital Nomad Guide | RoamIQ`;
    const description = `Cost of living, internet speed, visa rules, and lifestyle scores for digital nomads in ${city.name}, ${city.country}. Overall score ${Number(city.overall_score).toFixed(1)}/5 · ~$${Number(city.cost_usd).toLocaleString()}/mo · Visa: ${city.visa_difficulty}.`;
    const url = `${BASE_URL}/destinations/${city.id}`;
    const image = city.image || undefined;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        siteName: "RoamIQ",
        type: "article",
        ...(image ? { images: [{ url: image, alt: `${city.name}, ${city.country}` }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(image ? { images: [image] } : {}),
      },
      other: {
        founder: "Pranav Gawas",
        ceo: "Pranav Gawas",
        cto: "RoamIQ Tech Leadership",
        "executive-team": "Pranav Gawas (Founder & CEO), RoamIQ Tech Leadership (CTO & Lead AI Architect)",
        "organization:ceo": "Pranav Gawas",
        "organization:cto": "RoamIQ Tech Leadership",
      },
    };
  } catch {
    return {
      title: "Destination | RoamIQ",
      description: "Explore digital nomad destinations on RoamIQ.",
    };
  }
}

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
          .select("id, company_name, company_type, city, country, starting_price, wifi_speed, ratings, total_reviews, images")
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


  const photo = typedCity.image || cityPhotos[typedCity.id];
  const [gradient] = cityGradient(typedCity.id);
  const monthlyTotal = typedCost
    ? costRows.reduce((sum, r) => sum + (typedCost[r.key] as number), 0)
    : null;


  const destinationLd: Record<string, unknown> = {
    "@type": "TouristDestination",
    name: `${typedCity.name}, ${typedCity.country}`,
    description: `Digital nomad destination guide for ${typedCity.name}: cost of living, internet, visa difficulty, and lifestyle scores.`,
    url: `${BASE_URL}/destinations/${typedCity.id}`,
    ...(photo ? { image: photo } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: typedCity.name,
      addressCountry: typedCity.country,
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Monthly Headline Cost", value: `$${typedCity.cost_usd}` },
      { "@type": "PropertyValue", name: "Average Internet Speed", value: `${typedCity.internet_mbps} Mbps` },
      { "@type": "PropertyValue", name: "Visa Difficulty", value: typedCity.visa_difficulty },
      ...(typedCity.one_bed_rent_usd ? [{ "@type": "PropertyValue", name: "1-Bed Rent USD", value: `$${typedCity.one_bed_rent_usd}` }] : []),
      ...(typedCity.coworking_desk_usd ? [{ "@type": "PropertyValue", name: "Coworking Desk USD", value: `$${typedCity.coworking_desk_usd}` }] : []),
      ...(typedCity.english_proficiency ? [{ "@type": "PropertyValue", name: "English Proficiency", value: typedCity.english_proficiency }] : []),
      ...(typedCity.quality_of_life_score ? [{ "@type": "PropertyValue", name: "Quality of Life Score", value: `${typedCity.quality_of_life_score}` }] : []),
    ],
  };

  const breadcrumbLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinations",
        item: `${BASE_URL}/destinations`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${typedCity.name}, ${typedCity.country}`,
        item: `${BASE_URL}/destinations/${typedCity.id}`,
      },
    ],
  };

  // FAQ answers are derived only from live city/visa/cost fields — no fabricated claims
  const faqItems: { q: string; a: string }[] = [
    {
      q: `What is the cost of living for digital nomads in ${typedCity.name}?`,
      a: monthlyTotal != null
        ? `Estimated monthly cost in ${typedCity.name} is about $${monthlyTotal.toLocaleString()}, with a headline budget near $${Number(typedCity.cost_usd).toLocaleString()}/mo on RoamIQ.`
        : `RoamIQ lists a headline monthly budget of about $${Number(typedCity.cost_usd).toLocaleString()} for digital nomads in ${typedCity.name}.`,
    },
    {
      q: `How fast is the internet in ${typedCity.name}?`,
      a: `Average reported internet speed in ${typedCity.name} is about ${Number(typedCity.internet_mbps)} Mbps, with an internet lifestyle score of ${Number(typedCity.internet_score ?? 0).toFixed(1)}/5.`,
    },
    {
      q: `Is ${typedCity.name} visa-friendly for digital nomads?`,
      a: typedVisa
        ? `Visa difficulty for ${typedCity.country} is rated ${typedCity.visa_difficulty} on RoamIQ. Tourist stay is listed at ${typedVisa.tourist_days} days${typedVisa.has_dn_visa ? `; a digital nomad visa is available (${typedVisa.dn_visa_duration}, ~${typedVisa.dn_visa_cost})` : "; no dedicated digital nomad visa is listed"}.`
        : `Visa difficulty for ${typedCity.name}, ${typedCity.country} is rated ${typedCity.visa_difficulty} on RoamIQ.`,
    },
  ];

  const faqLd = {
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [destinationLd, breadcrumbLd, faqLd],
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1 pt-24 sm:pt-28">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
                <div className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-forest">Visa Intelligence</span>
                      <h3 className="font-serif text-xl font-semibold">
                        Visa & Entry Rules for {typedVisa.flag} {typedVisa.country}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium rounded-full bg-secondary px-3 py-1 self-start sm:self-auto">
                      Difficulty: <strong className="text-foreground">{typedCity.visa_difficulty}</strong>
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                    <InfoBlock label="Tourist stay" value={`${typedVisa.tourist_days} days`} />
                    <InfoBlock
                      label="Nomad visa"
                      value={typedVisa.has_dn_visa ? "Available" : "Not offered"}
                    />
                    {typedVisa.has_dn_visa && (
                      <>
                        <InfoBlock label="Application Fee" value={typedVisa.dn_visa_cost || "Varies"} />
                        <InfoBlock label="Visa Duration" value={typedVisa.dn_visa_duration || "1 year"} />
                        {typedVisa.min_income && (
                          <InfoBlock label="Min. Income Req." value={typedVisa.min_income} />
                        )}
                        <InfoBlock
                          label="Tax Residency Rule"
                          value={typedVisa.tax_residency_days ? `${typedVisa.tax_residency_days}d residency` : "183-day rule"}
                        />
                      </>
                    )}
                  </div>

                  {typedVisa.has_dn_visa && (
                    <div className="mt-5 rounded-2xl border border-border bg-secondary/40 p-4 space-y-2 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-semibold text-foreground">Processing Time:</span>
                        <span className="text-muted-foreground">{typedVisa.processing_time || "2–6 weeks average"}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-semibold text-foreground">Path to Residency:</span>
                        <span className="text-muted-foreground">{typedVisa.path_to_residency || (typedVisa.country === "Portugal" ? "Pathway to EU permanent residency after 5 years" : typedVisa.country === "Spain" ? "Pathway to residency under Beckham Law" : "Renewable stay while maintaining remote employment")}</span>
                      </div>
                      {typedVisa.tax_notes && (
                        <div className="pt-1 text-muted-foreground">
                          <span className="font-semibold text-foreground">Tax Notes: </span>
                          {typedVisa.tax_notes}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <Link
                      href="/visa"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
                    >
                      Compare all {typedVisa.country} visa rules & limits →
                    </Link>
                  </div>
                </div>
              )}

              {/* Granular Nomad Price & Quality Indicators */}
              <div className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-center gap-2 text-forest">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Granular City Metrics</span>
                </div>
                <h3 className="mt-1 font-serif text-xl font-semibold">
                  Nomad City Price & Lifestyle Indicators
                </h3>
                <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                  <InfoBlock
                    label="1-Bed Rent (USD)"
                    value={typedCity.one_bed_rent_usd ? `$${typedCity.one_bed_rent_usd}/mo` : "N/A"}
                  />
                  <InfoBlock
                    label="Coworking Desk"
                    value={typedCity.coworking_desk_usd ? `$${typedCity.coworking_desk_usd}/mo` : "N/A"}
                  />
                  <InfoBlock
                    label="Avg Meal Price"
                    value={typedCity.meal_price_usd ? `$${typedCity.meal_price_usd}` : "N/A"}
                  />
                  <InfoBlock
                    label="Espresso / Coffee"
                    value={typedCity.coffee_price_usd ? `$${typedCity.coffee_price_usd}` : "N/A"}
                  />
                  <InfoBlock
                    label="P90 Wi-Fi Speed"
                    value={typedCity.wifi_speed_p90 ? `${typedCity.wifi_speed_p90} Mbps` : `${typedCity.internet_mbps} Mbps`}
                  />
                  <InfoBlock
                    label="Mobile Data / GB"
                    value={typedCity.mobile_data_cost_gb ? `$${typedCity.mobile_data_cost_gb}` : "N/A"}
                  />
                  <InfoBlock
                    label="English Proficiency"
                    value={typedCity.english_proficiency || "High"}
                  />
                  <InfoBlock
                    label="Quality of Life Score"
                    value={typedCity.quality_of_life_score ? `${Number(typedCity.quality_of_life_score).toFixed(1)} / 5` : "4.2 / 5"}
                  />
                  <InfoBlock
                    label="Walkability Rating"
                    value={`${Number(typedCity.walkability_score ?? 4).toFixed(1)} / 5`}
                  />
                </div>
              </div>
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

          {/* Interactive Nomad Workation Planner & Budget Calculator */}
          <div className="mt-16">
            <NomadBudgetCalculator city={typedCity} cost={typedCost} visa={typedVisa} />
          </div>

          {/* Vetted Coworking Spaces & Stays */}
          {typedListings.length > 0 && (
            <div className="mt-16">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-forest">
                    Vetted Workspaces
                  </span>
                  <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight">
                    Top Coworking & Stays in {typedCity.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Workspaces and coliving hubs with verified internet speeds in {typedCity.name}.
                  </p>
                </div>
                <Link
                  href={`/workspaces?city=${encodeURIComponent(typedCity.name)}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:text-forest/80 self-start sm:self-auto"
                >
                  View all workspaces in {typedCity.name} →
                </Link>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {typedListings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/workspaces/${listing.id}`}
                    className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:border-forest/40 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/80">
                          {listing.company_type}
                        </span>
                        {listing.ratings > 0 && (
                          <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
                            ★ {Number(listing.ratings).toFixed(1)}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 font-serif text-lg font-semibold group-hover:text-forest transition-colors">
                        {listing.company_name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {listing.city}, {listing.country}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                      <span className="font-semibold text-forest">
                        {listing.starting_price || "Inquire for rates"}
                      </span>
                      {listing.wifi_speed && (
                        <span className="flex items-center gap-1 text-muted-foreground font-medium">
                          <Wifi className="h-3 w-3 text-forest" /> {listing.wifi_speed}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Nomad Travel Essentials & Affiliate Recommendations */}
          <div className="mt-16 rounded-3xl border border-border bg-gradient-to-br from-secondary/50 via-card to-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Nomad Essentials
                </span>
                <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight">
                  Travel & Work Essentials for {typedCity.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hand-picked resources for location-independent workers in {typedCity.country}.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {/* SafetyWing Insurance */}
              <div className="flex flex-col justify-between rounded-2xl border border-border bg-background p-5 shadow-xs transition-all hover:border-forest/40 hover:shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-forest">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Health Insurance</span>
                  </div>
                  <h3 className="mt-3 font-serif text-lg font-semibold">Nomad Health Coverage</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Worldwide medical insurance covering illness, injury, and travel delay while in {typedCity.country}.
                  </p>
                </div>
                <a
                  href="https://safetywing.com/nomad-insurance?referenceID=roamiq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-forest px-4 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Get SafetyWing (~$45/mo) →
                </a>
              </div>

              {/* Airalo eSIM */}
              <div className="flex flex-col justify-between rounded-2xl border border-border bg-background p-5 shadow-xs transition-all hover:border-accent/40 hover:shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-accent">
                    <Wifi className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">5G Mobile Data</span>
                  </div>
                  <h3 className="mt-3 font-serif text-lg font-semibold">Instant eSIM for {typedCity.country}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Connect instantly upon airport landing. Get $3.00 off with code <code className="rounded bg-accent/10 px-1.5 py-0.5 font-mono font-semibold text-accent">PRANAV0734</code>.
                  </p>
                </div>
                <a
                  href={`https://www.airalo.com/${typedCity.country.toLowerCase().replace(/\s+/g, "-")}-esim?referral=PRANAV0734`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Get Airalo eSIM ($3 Off) →
                </a>
              </div>

              {/* Coliving Stays */}
              <div className="flex flex-col justify-between rounded-2xl border border-border bg-background p-5 shadow-xs transition-all hover:border-sunset/40 hover:shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-sunset">
                    <DollarSign className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Stays & Coliving</span>
                  </div>
                  <h3 className="mt-3 font-serif text-lg font-semibold">Work-Friendly Stays</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Compare verified coworking apartments and nomad stays in {typedCity.name}.
                  </p>
                </div>
                <a
                  href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(typedCity.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-border bg-secondary px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/80"
                >
                  Find Stays in {typedCity.name} →
                </a>
              </div>
            </div>
          </div>
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

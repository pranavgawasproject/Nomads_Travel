import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { CityCard } from "@/components/site/city-card";
import { supabase, type City } from "@/lib/supabase";
import { Compass, ArrowLeftRight } from "lucide-react";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

export const metadata: Metadata = {
  title: "Destinations for Digital Nomads — Cost, Visa & Internet | RoamIQ",
  description:
    "Browse digital nomad destinations ranked by real cost of living, internet speed, safety and visa difficulty. Filter by continent and budget. Plan your next workation on RoamIQ.",
  alternates: {
    canonical: `${BASE_URL}/destinations`,
  },
  openGraph: {
    title: "Destinations for Digital Nomads — Cost, Visa & Internet | RoamIQ",
    description:
      "Browse digital nomad destinations ranked by real cost of living, internet speed, safety and visa difficulty. Filter by continent and budget.",
    url: `${BASE_URL}/destinations`,
    siteName: "RoamIQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Destinations for Digital Nomads | RoamIQ",
    description:
      "Ranked digital nomad cities by cost, internet, safety and visa difficulty.",
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

export const revalidate = 300;

const continents = ["All", "Asia", "Europe", "South America", "Africa", "North America"];
const sorts = [
  { value: "overall_score", label: "Top rated" },
  { value: "cost_usd_asc", label: "Cheapest" },
  { value: "internet_mbps", label: "Fastest internet" },
];

async function getCities(params: {
  search?: string;
  continent?: string;
  sort?: string;
}) {
  try {
    let query = supabase.from("cities").select("*");

    if (params.search) {
      query = query.or(
        `name.ilike.%${params.search}%,country.ilike.%${params.search}%`
      );
    }
    if (params.continent && params.continent !== "All") {
      query = query.eq("continent", params.continent);
    }

    if (params.sort === "cost_usd_asc") {
      query = query.order("cost_usd", { ascending: true });
    } else if (params.sort === "internet_mbps") {
      query = query.order("internet_mbps", { ascending: false });
    } else {
      query = query.order("overall_score", { ascending: false });
    }

    const { data, error } = await query;
    if (error) {
      console.error(error);
      return [];
    }
    return data as City[];
  } catch (error) {
    console.error("Error in getCities:", error);
    return [];
  }
}

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; continent?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const cities = await getCities(params);

  const breadcrumbJsonLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinations",
        item: `${BASE_URL}/destinations`,
      },
    ],
  };

  // CollectionPage + ItemList from live city rows (no fabricated entries)
  const itemListJsonLd = {
    "@type": "ItemList",
    name: "Digital nomad destinations on RoamIQ",
    numberOfItems: cities.length,
    itemListElement: cities.slice(0, 50).map((city, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${city.name}, ${city.country}`,
      url: `${BASE_URL}/destinations/${city.id}`,
    })),
  };

  const collectionJsonLd = {
    "@type": "CollectionPage",
    name: "Destinations for Digital Nomads | RoamIQ",
    description:
      "Browse digital nomad destinations ranked by real cost of living, internet speed, safety and visa difficulty.",
    url: `${BASE_URL}/destinations`,
    isPartOf: { "@type": "WebSite", name: "RoamIQ", url: BASE_URL },
    mainEntity: itemListJsonLd,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [breadcrumbJsonLd, collectionJsonLd],
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1 pt-28 sm:pt-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <section className="border-b border-border bg-secondary/40 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-sm font-medium uppercase tracking-widest text-accent">
              Live from the database
            </div>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {cities.length} destinations, ranked by real cost & lifestyle data.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Every score here is pulled straight from RoamIQ&apos;s database —
              cost of living, internet speed, safety, and visa difficulty,
              side by side.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/destinations/compare"
                className="inline-flex items-center gap-2 rounded-full border border-forest/30 bg-forest/10 px-4 py-2 text-xs font-semibold text-forest hover:bg-forest/20 transition-colors"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" /> Side-by-Side City Cost Comparator →
              </Link>
            </div>

            <form className="mt-8 flex flex-wrap gap-3" action="/destinations">
              <input
                type="text"
                name="search"
                defaultValue={params.search ?? ""}
                placeholder="Search city or country…"
                className="min-w-[220px] flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <select
                name="continent"
                defaultValue={params.continent ?? "All"}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {continents.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                name="sort"
                defaultValue={params.sort ?? "overall_score"}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {sorts.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Filter
              </button>
            </form>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            {cities.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border py-20 text-center">
                <Compass className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No cities match those filters. Try clearing search or continent.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cities.map((city) => (
                  <CityCard key={city.id} city={city} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { CityCard } from "@/components/site/city-card";
import { supabase, type City } from "@/lib/supabase";
import { Compass } from "lucide-react";

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
}

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; continent?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const cities = await getCities(params);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1 pt-28 sm:pt-32">
        <section className="border-b border-border bg-secondary/40 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-sm font-medium uppercase tracking-widest text-accent">
              Live from the database
            </div>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {cities.length} destinations, ranked by real cost & lifestyle data.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Every score here is pulled straight from RoamIQ's database —
              cost of living, internet speed, safety, and visa difficulty,
              side by side.
            </p>

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

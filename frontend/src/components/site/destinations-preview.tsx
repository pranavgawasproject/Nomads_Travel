import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { supabase, type City } from "@/lib/supabase";
import { CityCard } from "@/components/site/city-card";

export async function DestinationsPreview() {
  const { data } = await supabase
    .from("cities")
    .select("*")
    .order("overall_score", { ascending: false })
    .limit(4);

  const cities = (data ?? []) as City[];
  if (cities.length === 0) return null;

  return (
    <section
      id="destinations"
      className="relative scroll-mt-24 border-y border-border bg-secondary/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="text-sm font-medium uppercase tracking-widest text-accent">
              Trending now
            </div>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Cities nomads are flocking to this season.
            </h2>
          </div>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:gap-2.5 hover:text-forest/80"
          >
            See all destinations
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </div>
    </section>
  );
}

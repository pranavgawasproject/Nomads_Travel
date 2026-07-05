import Link from "next/link";
import { Star, Wifi, ArrowUpRight } from "lucide-react";
import type { City } from "@/lib/supabase";
import { cityPhotos, cityGradient } from "@/lib/city-images";
import { cn } from "@/lib/utils";

export function CityCard({ city }: { city: City }) {
  const photo = cityPhotos[city.id];
  const [gradient, gradientText] = cityGradient(city.id);

  return (
    <Link
      href={`/destinations/${city.id}`}
      className="group relative block overflow-hidden rounded-3xl border border-border bg-card transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {photo ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('${photo}')` }}
            aria-hidden
          />
        ) : (
          <div
            className={cn(
              "absolute inset-0 grid place-items-center bg-gradient-to-br",
              gradient
            )}
            aria-hidden
          >
            <span className="text-7xl opacity-90">{city.flag}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />

        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
            Visa: {city.visa_difficulty}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <Star className="h-3 w-3 fill-sunset text-sunset" />
            {Number(city.overall_score).toFixed(1)}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-serif text-2xl font-semibold">
              {city.flag} {city.name}
            </h3>
            <span className="text-xs font-medium text-amber-200">
              {city.country}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/60">
                Cost / mo
              </div>
              <div className="font-serif text-xl font-semibold">
                ${city.cost_usd.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-wider text-white/60">
                <Wifi className="h-3 w-3" /> Internet
              </div>
              <div className="font-serif text-xl font-semibold">
                {city.internet_mbps} Mbps
              </div>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all group-hover:bg-accent group-hover:text-accent-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

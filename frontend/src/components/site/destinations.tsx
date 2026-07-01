"use client";

import { motion } from "framer-motion";
import { Star, Wifi, ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Destination = {
  city: string;
  country: string;
  tagline: string;
  cost: number;
  currency?: string;
  internet: number; // Mbps
  rating: number;
  visa: "Visa-free" | "Visa on arrival" | "E-visa" | "Nomad visa";
  image: string;
  accent: "forest" | "sunset" | "terracotta" | "clay";
};

const destinations: Destination[] = [
  {
    city: "Lisbon",
    country: "Portugal",
    tagline: "Sunlit cafés, Atlantic breeze, thriving startup scene.",
    cost: 1800,
    internet: 220,
    rating: 4.8,
    visa: "Nomad visa",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80",
    accent: "sunset",
  },
  {
    city: "Chiang Mai",
    country: "Thailand",
    tagline: "Thermal baths, $4 meals, and a startup scene that won't quit.",
    cost: 800,
    internet: 150,
    rating: 4.7,
    visa: "E-visa",
    image:
      "https://images.unsplash.com/photo-1598935818633-9c9a78d8b7b6?auto=format&fit=crop&w=1200&q=80",
    accent: "forest",
  },
  {
    city: "Canggu",
    country: "Indonesia",
    tagline: "Budget-friendly surf town with visa-free entry for 30 days.",
    cost: 650,
    internet: 95,
    rating: 4.6,
    visa: "Visa-free",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    accent: "clay",
  },
  {
    city: "Mexico City",
    country: "Mexico",
    tagline: "Megacity energy, world-class food, generous nomad visa.",
    cost: 1450,
    internet: 180,
    rating: 4.7,
    visa: "Nomad visa",
    image:
      "https://images.unsplash.com/photo-1516410529446-2c777cb7366d?auto=format&fit=crop&w=1200&q=80",
    accent: "terracotta",
  },
  {
    city: "Tbilisi",
    country: "Georgia",
    tagline: "One-year visa-free stay, mountain views, $700/mo lifestyle.",
    cost: 700,
    internet: 110,
    rating: 4.5,
    visa: "Visa-free",
    image:
      "https://images.unsplash.com/photo-1547147834-9088aab6fbf6?auto=format&fit=crop&w=1200&q=80",
    accent: "forest",
  },
  {
    city: "Medellín",
    country: "Colombia",
    tagline: "Spring-like weather year-round, vibrant nomad community.",
    cost: 950,
    internet: 200,
    rating: 4.6,
    visa: "Visa on arrival",
    image:
      "https://images.unsplash.com/photo-1571072614024-9e9d0a3b1a22?auto=format&fit=crop&w=1200&q=80",
    accent: "sunset",
  },
  {
    city: "Cape Town",
    country: "South Africa",
    tagline: "Culture, food & creative energy between two oceans.",
    cost: 900,
    internet: 75,
    rating: 4.5,
    visa: "Visa-free",
    image:
      "https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?auto=format&fit=crop&w=1200&q=80",
    accent: "clay",
  },
  {
    city: "Bangkok",
    country: "Thailand",
    tagline: "Asia's digital nomad capital — street food and fiber everywhere.",
    cost: 850,
    internet: 250,
    rating: 4.4,
    visa: "Visa on arrival",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
    accent: "terracotta",
  },
];

const accentText: Record<Destination["accent"], string> = {
  forest: "text-forest",
  sunset: "text-sunset",
  terracotta: "text-terracotta",
  clay: "text-clay",
};

export function Destinations() {
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
          <a
            href="#cta"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:gap-2.5 hover:text-forest/80"
          >
            See all 2,400+ cities
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {/* Horizontal scroller */}
        <div className="mask-fade-x no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
          {destinations.map((d, i) => (
            <DestinationCard key={d.city} d={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DestinationCard({ d, index }: { d: Destination; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="group relative w-[78vw] shrink-0 snap-start overflow-hidden rounded-3xl border border-border bg-card sm:w-[360px]"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${d.image}')` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />

        {/* Top chips */}
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
            {d.visa}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <Star className="h-3 w-3 fill-sunset text-sunset" />
            {d.rating}
          </span>
        </div>

        {/* Bottom info */}
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-serif text-2xl font-semibold">{d.city}</h3>
            <span className={cn("text-xs font-medium", "text-amber-200")}>
              {d.country}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-white/85">
            {d.tagline}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/60">
                Cost / mo
              </div>
              <div className="font-serif text-xl font-semibold">
                ${d.cost.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-wider text-white/60">
                <Wifi className="h-3 w-3" /> Internet
              </div>
              <div className="font-serif text-xl font-semibold">
                {d.internet} Mbps
              </div>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all group-hover:bg-accent group-hover:text-accent-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Trending ribbon */}
      {index < 3 && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
          <TrendingUp className="h-3 w-3" /> Hot
        </span>
      )}
    </motion.article>
  );
}

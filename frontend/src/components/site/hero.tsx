"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MapPin, Wifi, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const examples = [
  "Best cities for remote workers in Asia",
  "Visa-free countries under $1k/mo",
  "Beach towns with fiber internet",
];

const stats = [
  { value: "35M", label: "Digital nomads worldwide" },
  { value: "190+", label: "Countries indexed" },
  { value: "$1.2B", label: "Annual savings routed" },
];

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-36"
    >
      {/* Background image with overlays */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2400&q=80')",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/35 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/45 via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28 lg:pb-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-sunset" />
            <span>Now in public beta · AI trip planner is live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 font-serif text-5xl font-semibold leading-[1.02] tracking-tight text-white text-balance sm:text-6xl lg:text-7xl"
          >
            Where will you{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-sunset via-amber-200 to-sunset bg-clip-text italic text-transparent">
                roam
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full text-sunset/80"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 9 C 50 2, 150 2, 198 9"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            next?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 text-pretty"
          >
            Your AI-powered travel intelligence. Discover cities, compare costs,
            find workspaces — and plan the perfect workation, all in one place.
          </motion.p>

          {/* AI Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 max-w-2xl"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const params = query.trim()
                  ? `?search=${encodeURIComponent(query.trim())}`
                  : "";
                router.push(`/destinations${params}`);
              }}
              className="group flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-2 pl-4 backdrop-blur-xl transition-colors focus-within:border-white/40 focus-within:bg-white/15"
            >
              <Sparkles className="h-5 w-5 shrink-0 text-sunset" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a city, country, or vibe…"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white placeholder:text-white/60 focus:outline-none sm:text-base"
                aria-label="Search destinations"
              />
              <Button
                type="submit"
                size="sm"
                className="h-10 shrink-0 rounded-xl bg-accent px-4 text-accent-foreground shadow-md hover:bg-accent/90"
              >
                Plan my trip
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-white/60">Try:</span>
              {examples.map((ex) => (
                <Link
                  key={ex}
                  href={`/destinations?search=${encodeURIComponent(ex)}`}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                >
                  {ex}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-12 grid grid-cols-3 gap-4 sm:gap-8"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-serif text-3xl font-semibold text-white sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-white/70 sm:text-sm">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating quick chips */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="relative z-10 mx-auto max-w-7xl px-5 pb-12 sm:px-8"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: MapPin, label: "Live destinations", value: "Explore cities", href: "/destinations" },
            { icon: Wifi, label: "Coworking & coliving", value: "8,200+ spots", href: "/workspaces" },
            { icon: Zap, label: "Visa lookup", value: "190+ countries", href: "/visa" },
          ].map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 shadow-sm backdrop-blur transition-colors hover:border-accent/50"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-forest">
                <card.icon className="h-4 w-4" />
              </span>
              <div>
                <div className="text-xs text-muted-foreground">{card.label}</div>
                <div className="font-serif text-base font-semibold">{card.value}</div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

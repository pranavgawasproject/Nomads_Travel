"use client";

import { motion } from "framer-motion";
import { Brain, Scale, HeartHandshake } from "lucide-react";

const pillars = [
  {
    icon: Brain,
    title: "AI that knows nomads",
    body: "Our planner is trained on 4M+ nomad trips, cost reports, and visa outcomes. Ask in plain English — get an itinerary, a budget, and a visa checklist in one shot. It knows the difference between a beach town with fiber and one with a single 4G tower.",
    stat: "4M+",
    statLabel: "trips analyzed",
  },
  {
    icon: Scale,
    title: "Live cost comparison",
    body: "Chiang Mai at $650/mo vs Lisbon at $1,800/mo — see the exact breakdown for rent, food, transport, and coworking. Updated every two weeks from nomads actually on the ground, not stale government statistics.",
    stat: "14 days",
    statLabel: "freshness window",
  },
  {
    icon: HeartHandshake,
    title: "Built for your lifestyle",
    body: "Whether you surf at dawn, take client calls at noon, or homeschool kids in between — RoamIQ tailors every recommendation to the rhythm of your life, not a generic traveler template.",
    stat: "12 filters",
    statLabel: "to dial in your fit",
  },
];

export function WhyRoamIQ() {
  return (
    <section className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-3 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <div className="text-sm font-medium uppercase tracking-widest text-accent">
              Why RoamIQ
            </div>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              We're not a travel app. We're the operating system for a life in motion.
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Most travel tools help you pick a destination. RoamIQ helps you
            engineer an entire location-independent life — the visas, the
            numbers, the community, and the daily rhythm that makes it
            sustainable.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-forest/5"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-forest transition-colors group-hover:bg-forest group-hover:text-primary-foreground">
                <p.icon className="h-5 w-5" />
              </span>

              <h3 className="mt-5 font-serif text-2xl font-semibold tracking-tight">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>

              <div className="mt-6 flex items-baseline gap-2 border-t border-border pt-5">
                <span className="font-serif text-3xl font-semibold text-accent">
                  {p.stat}
                </span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {p.statLabel}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

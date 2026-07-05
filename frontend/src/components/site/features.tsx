"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe2,
  BarChart3,
  FileCheck2,
  Building2,
  Users,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Feature = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  status?: "live" | "soon";
  image?: string;
  className: string;
  accent?: "forest" | "sunset" | "terracotta" | "clay";
};

const features: Feature[] = [
  {
    id: "explore",
    title: "Explore Destinations",
    description:
      "Browse 20+ cities ranked on cost, internet, safety & fun — filter by continent and budget.",
    icon: Globe2,
    href: "/destinations",
    status: "live",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
    className: "lg:col-span-2 lg:row-span-2",
    accent: "forest",
  },
  {
    id: "workspaces",
    title: "Workspaces & Stays",
    description:
      "8,000+ coworking spaces, coliving houses, cafés and hostels — searchable by city and type.",
    icon: Building2,
    href: "/workspaces",
    status: "live",
    className: "lg:col-span-2",
    accent: "sunset",
  },
  {
    id: "visa",
    title: "Visa Finder",
    description:
      "Tourist stay limits and digital nomad visa options across 190+ countries, side by side.",
    icon: FileCheck2,
    href: "/visa",
    status: "live",
    className: "lg:col-span-2",
    accent: "terracotta",
  },
  {
    id: "rankings",
    title: "Cost Comparison",
    description: "See exactly where every dollar goes between any two cities.",
    icon: BarChart3,
    href: "/pricing",
    status: "live",
    className: "lg:col-span-2",
    accent: "clay",
  },
  {
    id: "community",
    title: "Nomad Community",
    description: "Meetups and forum discussions from nomads on the ground.",
    icon: Users,
    href: "/community",
    status: "live",
    className: "lg:col-span-2",
    accent: "forest",
  },
  {
    id: "savings",
    title: "Savings Calculator",
    description: "See exactly how much you keep by roaming smart.",
    icon: Wallet,
    href: "/pricing",
    status: "soon",
    className: "lg:col-span-2",
    accent: "sunset",
  },
];

const accentMap = {
  forest: "bg-forest/10 text-forest",
  sunset: "bg-sunset/15 text-sunset",
  terracotta: "bg-terracotta/15 text-terracotta",
  clay: "bg-clay/15 text-clay",
};

export function Features() {
  return (
    <section id="explore" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="text-sm font-medium uppercase tracking-widest text-accent">
              The toolkit
            </div>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Everything a modern nomad needs, in one calm dashboard.
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Stop juggling twelve tabs. RoamIQ brings destinations, costs, visas,
            jobs, and community under one roof — with AI doing the heavy lifting.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {features.map((f, i) => (
            <FeatureCard key={f.id} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.05 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-forest/5",
        feature.className
      )}
    >
      <Link href={feature.href} className="absolute inset-0 z-20" aria-label={feature.title} />
      {feature.image && (
        <>
          <div
            className="absolute inset-0 -z-0 bg-cover bg-center opacity-90 transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('${feature.image}')` }}
            aria-hidden
          />
          <div className="absolute inset-0 -z-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/10" />
        </>
      )}

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between">
          <span
            className={cn(
              "grid h-11 w-11 place-items-center rounded-2xl",
              feature.image
                ? "bg-white/15 text-white backdrop-blur-md"
                : accentMap[feature.accent ?? "forest"]
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          {feature.status && (
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                feature.status === "live"
                  ? "bg-forest/10 text-forest"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {feature.status === "live" ? "Live" : "Coming soon"}
            </span>
          )}
        </div>

        <div className={cn("mt-auto", feature.image ? "pt-32 sm:pt-48" : "pt-10")}>
          <h3
            className={cn(
              "font-serif text-xl font-semibold tracking-tight",
              feature.image ? "text-white" : "text-foreground"
            )}
          >
            {feature.title}
          </h3>
          <p
            className={cn(
              "mt-2 text-sm leading-relaxed",
              feature.image ? "text-white/80" : "text-muted-foreground"
            )}
          >
            {feature.description}
          </p>

          {feature.status === "live" && (
            <span
              className={cn(
                "mt-4 inline-flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2",
                feature.image ? "text-white" : "text-forest"
              )}
            >
              Explore
              <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

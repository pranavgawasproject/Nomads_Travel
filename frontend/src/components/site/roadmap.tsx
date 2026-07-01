"use client";

import { motion } from "framer-motion";
import { Bot, CalendarCheck, Users2, Calculator, ArrowRight } from "lucide-react";

const roadmap = [
  {
    quarter: "Q1",
    title: "AI Trip Planner",
    body: "Conversational planning with multi-city itineraries, weather-aware routing, and instant visa checklists.",
    icon: Bot,
    status: "Shipped",
  },
  {
    quarter: "Q2",
    title: "One-Click Booking",
    body: "Lock in flights, stays, and coworking desks in a single transaction — with nomad-friendly cancellation terms.",
    icon: CalendarCheck,
    status: "In progress",
  },
  {
    quarter: "Q3",
    title: "Nomad Community",
    body: "Verified nomads only. Host meetups, find travel buddies, and trade insider tips on every neighborhood we cover.",
    icon: Users2,
    status: "Designing",
  },
  {
    quarter: "Q4",
    title: "Savings Calculator",
    body: "Plug in your home spend, your income, and your tax residency. We project annual savings across any city combo.",
    icon: Calculator,
    status: "Researching",
  },
];

const statusStyles: Record<string, string> = {
  Shipped: "bg-forest/15 text-forest",
  "In progress": "bg-sunset/15 text-sunset",
  Designing: "bg-clay/15 text-clay",
  Researching: "bg-secondary text-muted-foreground",
};

export function Roadmap() {
  return (
    <section
      id="roadmap"
      className="relative scroll-mt-24 border-y border-border bg-secondary/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <div className="text-sm font-medium uppercase tracking-widest text-accent">
            The roadmap
          </div>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            What's live. What's next. What's a twinkle in our eye.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            We ship in the open. Here's exactly where each piece of the platform
            stands today — and when you can expect to see it land.
          </p>
        </div>

        <div className="relative mt-14">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 hidden w-px bg-border sm:block" />

          <div className="space-y-4">
            {roadmap.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative grid gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:shadow-forest/5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-6"
              >
                <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-2">
                  <span className="relative z-10 grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {item.quarter}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:justify-end">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status]}`}
                  >
                    {item.status}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

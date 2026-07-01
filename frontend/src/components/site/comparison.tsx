"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type Category = {
  label: string;
  chiangMai: number;
  lisbon: number;
};

const categories: Category[] = [
  { label: "Rent (1-br central)", chiangMai: 280, lisbon: 950 },
  { label: "Food & groceries", chiangMai: 180, lisbon: 420 },
  { label: "Transport", chiangMai: 50, lisbon: 110 },
  { label: "Coworking desk", chiangMai: 90, lisbon: 180 },
  { label: "Leisure & wellness", chiangMai: 120, lisbon: 140 },
];

const totalCM = categories.reduce((s, c) => s + c.chiangMai, 0);
const totalLX = categories.reduce((s, c) => s + c.lisbon, 0);
const max = Math.max(...categories.flatMap((c) => [c.chiangMai, c.lisbon]));

export function Comparison() {
  return (
    <section
      id="compare"
      className="relative scroll-mt-24 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:items-center">
          {/* Left: copy */}
          <div>
            <div className="text-sm font-medium uppercase tracking-widest text-accent">
              Live cost comparison
            </div>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              See exactly where every dollar goes — before you book the flight.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              RoamIQ pulls live cost data from thousands of nomads on the ground,
              then breaks it down line-by-line. No more guesswork. No more
              spreadsheet sprawl. Just apples-to-apples truth between any two
              cities on your shortlist.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Rent, food, transport, coworking, leisure — all in one view",
                "Currency-converted, tax-aware, updated every 14 days",
                "One-click side-by-side for up to 4 cities",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-foreground/85">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-forest/15 text-forest">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <Button
              className="mt-8 rounded-full bg-primary px-6 text-primary-foreground shadow-sm hover:bg-primary/90"
              asChild
            >
              <a href="#cta">
                Compare your shortlist
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Right: comparison card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xl shadow-forest/5 sm:p-8"
          >
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sunset/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-forest/10 blur-3xl" />

            <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="text-center">
                <div className="mx-auto h-14 w-14 overflow-hidden rounded-full border-2 border-forest/30">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1598935818633-9c9a78d8b7b6?auto=format&fit=crop&w=200&q=80')",
                    }}
                  />
                </div>
                <div className="mt-2 font-serif text-lg font-semibold">
                  Chiang Mai
                </div>
                <div className="text-xs text-muted-foreground">Thailand</div>
              </div>

              <div className="text-center">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  vs
                </div>
              </div>

              <div className="text-center">
                <div className="mx-auto h-14 w-14 overflow-hidden rounded-full border-2 border-sunset/40">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=200&q=80')",
                    }}
                  />
                </div>
                <div className="mt-2 font-serif text-lg font-semibold">Lisbon</div>
                <div className="text-xs text-muted-foreground">Portugal</div>
              </div>
            </div>

            <div className="relative mt-8 space-y-4">
              {categories.map((c, i) => (
                <div key={c.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-foreground/80">{c.label}</span>
                  </div>
                  <div className="space-y-1.5">
                    <Bar
                      value={c.chiangMai}
                      max={max}
                      color="bg-forest"
                      display={`$${c.chiangMai}`}
                      delay={i * 0.05}
                    />
                    <Bar
                      value={c.lisbon}
                      max={max}
                      color="bg-sunset"
                      display={`$${c.lisbon}`}
                      delay={i * 0.05 + 0.1}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mt-6 flex items-center justify-between border-t border-border pt-5">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Monthly total
                </div>
                <div className="font-serif text-2xl font-semibold text-forest">
                  ${totalCM.toLocaleString()}
                  <span className="ml-2 text-sm font-normal text-muted-foreground line-through">
                    ${totalLX.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="rounded-full bg-forest/10 px-3 py-1.5 text-sm font-semibold text-forest">
                Save ${(totalLX - totalCM).toLocaleString()} / mo
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Bar({
  value,
  max,
  color,
  display,
  delay,
}: {
  value: number;
  max: number;
  color: string;
  display: string;
  delay: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${(value / max) * 100}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        className={`h-3 rounded-full ${color}`}
      />
      <span className="text-xs font-medium tabular-nums text-foreground/70">
        {display}
      </span>
    </div>
  );
}

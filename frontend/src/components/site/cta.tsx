"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const perks = [
  "Free during public beta — no card required",
  "AI trip planner with unlimited itineraries",
  "Live cost comparison across 4 cities at once",
  "Weekly nomad intel drop in your inbox",
];

export function CTA() {
  return (
    <section id="cta" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative isolate overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-primary-foreground sm:px-14 sm:py-20"
        >
          {/* Decorative shapes */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sunset/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald/30 blur-3xl" />
          <div
            className="absolute inset-0 -z-10 opacity-20"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=70')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden
          />

          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-sunset" />
                Public beta is live
              </div>
              <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Stop researching.
                <br />
                Start roaming.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-primary-foreground/80">
                Join 35,000+ nomads using RoamIQ to plan their next move.
                It takes two minutes to set up — and one to fall in love.
              </p>

              <ul className="mt-7 grid gap-2 sm:grid-cols-2">
                {perks.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-primary-foreground/90">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sunset text-ink">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Email form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur-md sm:p-7"
            >
              <label
                htmlFor="cta-email"
                className="text-xs font-medium uppercase tracking-widest text-primary-foreground/70"
              >
                Get your invite
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  id="cta-email"
                  type="email"
                  required
                  placeholder="you@nomad.life"
                  className="min-w-0 flex-1 rounded-xl border border-primary-foreground/20 bg-background/95 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sunset"
                />
                <Button
                  type="submit"
                  className="h-12 shrink-0 rounded-xl bg-accent px-5 text-accent-foreground shadow-md hover:bg-accent/90"
                >
                  Claim my spot
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
              <p className="mt-3 text-xs text-primary-foreground/60">
                Already have an account?{" "}
                <a href="#" className="font-medium text-primary-foreground underline-offset-4 hover:underline">
                  Log in
                </a>
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-primary-foreground/15 pt-5">
                <div className="flex -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
                    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&q=80",
                  ].map((src) => (
                    <div
                      key={src}
                      className="h-8 w-8 rounded-full border-2 border-primary bg-cover bg-center"
                      style={{ backgroundImage: `url('${src}')` }}
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="text-xs text-primary-foreground/70">
                  <span className="font-semibold text-primary-foreground">35,128</span>{" "}
                  nomads joined this month
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

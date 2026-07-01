"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "I cancelled three subscriptions the day RoamIQ's planner shipped. It drafts an itinerary, estimates cost, and tells me which visa I need — in under ten seconds.",
    name: "Mira Tanaka",
    role: "Product designer · 6 years nomading",
    location: "Currently in Tbilisi",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "The cost comparison alone is worth it. I moved from Lisbon to Chiang Mai and I'm banking $1,150 more every month — same quality of life, better WiFi.",
    name: "Diego Marín",
    role: "Indie founder · SaaS operator",
    location: "Currently in Chiang Mai",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "As a homeschooling mom of two, the lifestyle filters are a lifesaver. RoamIQ knows the difference between a beach town and a beach town with a co-op.",
    name: "Aisha Bello",
    role: "Consultant · family nomad",
    location: "Currently in Medellín",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
];

export function Testimonials() {
  return (
    <section id="community" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <div className="text-sm font-medium uppercase tracking-widest text-accent">
            From the road
          </div>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Nomads don't take our word for it. They take each other's.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="flex flex-col rounded-3xl border border-border bg-card p-7"
            >
              <Quote className="h-7 w-7 text-accent" />
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-foreground/85">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <div
                  className="h-11 w-11 shrink-0 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${t.avatar}')` }}
                  aria-hidden
                />
                <div>
                  <div className="font-serif text-base font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                  <div className="mt-0.5 text-xs italic text-forest">
                    {t.location}
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

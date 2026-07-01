"use client";

import { Compass, Twitter, Instagram, Github, Youtube, Mail } from "lucide-react";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Explore destinations", href: "#explore" },
      { label: "World rankings", href: "#destinations" },
      { label: "AI trip planner", href: "#explore" },
      { label: "Cost comparison", href: "#compare" },
      { label: "Nomad community", href: "#community" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press kit", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Roadmap", href: "#roadmap" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Visa guides", href: "#" },
      { label: "City deep-dives", href: "#" },
      { label: "Remote job board", href: "#" },
      { label: "Tax residency 101", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms & conditions", href: "#" },
      { label: "Content policy", href: "#" },
      { label: "Cookie settings", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

const socials = [
  { icon: Twitter, href: "#", label: "Twitter / X" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Github, href: "#", label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr] lg:gap-16">
          {/* Brand */}
          <div>
            <a href="#top" className="group inline-flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Compass className="h-5 w-5" />
              </span>
              <span className="font-serif text-xl font-semibold tracking-tight">
                Roam<span className="text-accent">IQ</span>
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Building the future of global explorer living. Discover where to
              live, work, and thrive — powered by AI intelligence that actually
              understands nomads.
            </p>

            <a
              href="mailto:hello@roamiq.com"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
            >
              <Mail className="h-4 w-4" />
              hello@roamiq.com
            </a>

            <div className="mt-6 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground/70 transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm text-foreground/80 transition-colors hover:text-accent"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RoamIQ Labs. Built with care for the
            35M humans who refuse to sit still.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest" />
              All systems operational
            </span>
            <span className="rounded-full border border-border bg-card px-3 py-1">
              v2.4.1 · Public beta
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

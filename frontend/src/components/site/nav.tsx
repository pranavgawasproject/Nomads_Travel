"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Compass, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Explore", href: "#explore" },
  { label: "Rankings", href: "#destinations" },
  { label: "Compare", href: "#compare" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Community", href: "#community" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/85 backdrop-blur-xl py-3"
          : "border-b border-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-12">
            <Compass className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight">
            Roam<span className="text-accent">IQ</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden h-9 w-9 place-items-center rounded-full border border-border bg-card/60 text-foreground/70 transition-colors hover:text-foreground sm:grid"
            aria-label="Toggle theme"
          >
            <Sun className="hidden h-4 w-4 dark:block" />
            <Moon className="h-4 w-4 dark:hidden" />
          </button>

          <Button
            variant="ghost"
            size="sm"
            className="hidden text-sm font-medium text-foreground/70 hover:text-foreground sm:inline-flex"
            asChild
          >
            <a href="#cta">Log in</a>
          </Button>

          <Button
            size="sm"
            className="hidden rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 sm:inline-flex"
            asChild
          >
            <a href="#cta">Start roaming</a>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card/60 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href="#cta">Log in</a>
                </Button>
                <Button size="sm" className="flex-1 bg-primary text-primary-foreground" asChild>
                  <a href="#cta">Start roaming</a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

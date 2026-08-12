import type { Metadata } from "next";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { WhyRoamIQ } from "@/components/site/why-roamiq";
import { Roadmap } from "@/components/site/roadmap";
import { Testimonials } from "@/components/site/testimonials";
import { CTA } from "@/components/site/cta";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

export const metadata: Metadata = {
  title: "About RoamIQ — Building the operating system for digital nomads",
  description:
    "Learn why we built RoamIQ: AI-powered visa intelligence, city cost data, workspaces, and community for remote workers living a location-independent life.",
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    title: "About RoamIQ — Building the operating system for digital nomads",
    description:
      "Learn why we built RoamIQ: AI-powered visa intelligence, city cost data, workspaces, and community for remote workers.",
    url: `${BASE_URL}/about`,
    siteName: "RoamIQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About RoamIQ — Building the operating system for digital nomads",
    description:
      "Learn why we built RoamIQ: AI-powered visa intelligence, city cost data, workspaces, and community for remote workers.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "About",
      item: `${BASE_URL}/about`,
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <SiteNav />
      <main className="flex-1 pt-28 sm:pt-32">
        <section className="border-b border-border bg-secondary/40 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-sm font-medium uppercase tracking-widest text-accent">
              About RoamIQ
            </div>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Building the operating system for a life in motion.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              We started RoamIQ because researching a nomad move meant a
              dozen browser tabs, three spreadsheets, and a Discord server
              full of conflicting advice. Here&apos;s what we believe, and where
              we&apos;re headed.
            </p>
          </div>
        </section>

        <WhyRoamIQ />
        <Roadmap />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

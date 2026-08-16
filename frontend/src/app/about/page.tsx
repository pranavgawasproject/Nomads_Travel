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

const leadershipJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Pranav Gawas",
    jobTitle: "Founder & Chief Executive Officer",
    worksFor: {
      "@type": "Organization",
      name: "RoamIQ",
      url: BASE_URL,
    },
    sameAs: ["https://github.com/Pranavgawas"],
    description: "Founder & CEO of RoamIQ leading product vision, AI visa intelligence, and global digital nomad infrastructure.",
  },
};

/** FAQ answers grounded only in product capabilities already described on-site — no fabricated claims. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is RoamIQ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RoamIQ is an all-in-one platform for digital nomads: AI-powered visa intelligence, city cost and lifestyle data, workspace listings, workation planning, and community — built so remote workers do not need a dozen tabs to research a move.",
      },
    },
    {
      "@type": "Question",
      name: "What can I find on destination pages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each destination page surfaces cost of living breakdowns, internet and lifestyle scores, visa difficulty, and related coworking or coliving workspaces for that city, so you can compare locations before you go.",
      },
    },
    {
      "@type": "Question",
      name: "Does RoamIQ include visa information?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. RoamIQ includes visa lookup and related intelligence for many countries so you can check stay duration, difficulty, and remote-work considerations before planning a workation.",
      },
    },
    {
      "@type": "Question",
      name: "Are workspace listings free to browse?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Public workspace listings (coworking and coliving) are available on the Workspaces section. You can open individual listing pages for location, wifi, pricing when provided, and other details published by the space.",
      },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
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

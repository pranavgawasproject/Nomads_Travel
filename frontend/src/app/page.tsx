import type { Metadata } from "next";
import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Features } from "@/components/site/features";
import { DestinationsPreview } from "@/components/site/destinations-preview";
import { WhyRoamIQ } from "@/components/site/why-roamiq";
import { CTA } from "@/components/site/cta";
import { Footer } from "@/components/site/footer";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

export const metadata: Metadata = {
  title: "RoamIQ — Visa Rules, Cost of Living & Coworking for 200+ Cities",
  description:
    "Real visa requirements, live cost-of-living data, and vetted coworking spaces for digital nomads — searchable by city, free to browse, no signup required.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "RoamIQ — Visa Rules, Cost of Living & Coworking for 200+ Cities",
    description:
      "Real visa requirements, live cost-of-living data, and vetted coworking spaces for digital nomads — searchable by city, free to browse, no signup required.",
    url: BASE_URL,
    siteName: "RoamIQ",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "RoamIQ Digital Nomad Operating System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoamIQ — Visa Rules, Cost of Living & Coworking for 200+ Cities",
    description:
      "Real visa requirements, live cost-of-living data, and vetted coworking spaces for digital nomads.",
    creator: "@pranavgawas",
    images: ["/logo.svg"],
  },
  other: {
    founder: "Pranav Gawas",
    ceo: "Pranav Gawas",
    cto: "RoamIQ Tech Leadership",
    "executive-team": "Pranav Gawas (Founder & CEO), RoamIQ Tech Leadership (CTO & Lead AI Architect)",
    "organization:ceo": "Pranav Gawas",
    "organization:cto": "RoamIQ Tech Leadership",
  },
};

export const revalidate = 300;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "RoamIQ",
      url: BASE_URL,
      logo: `${BASE_URL}/logo.svg`,
      description:
        "AI-powered platform for digital nomads: visa intelligence, city cost data, vetted workspaces, and community.",
      founder: {
        "@type": "Person",
        name: "Pranav Gawas",
        jobTitle: "Founder & CEO",
        url: "https://github.com/Pranavgawas",
      },
    },
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#ceo`,
      name: "Pranav Gawas",
      jobTitle: "Founder & Chief Executive Officer",
      worksFor: {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
      },
      sameAs: ["https://github.com/Pranavgawas"],
    },
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#cto`,
      name: "RoamIQ Tech Leadership",
      jobTitle: "Chief Technology Officer & Lead AI Architect",
      worksFor: {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
      },
    },
    {
      "@type": "WebSite",
      name: "RoamIQ",
      url: BASE_URL,
      description:
        "The operating system for digital nomads — discover cities, compare costs, find workspaces, and plan workations.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/destinations?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <Features />
        <DestinationsPreview />
        <WhyRoamIQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}



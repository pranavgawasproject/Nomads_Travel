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

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
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


import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { CityComparator } from "@/components/site/city-comparator";
import { supabase, type City } from "@/lib/supabase";
import { ArrowLeft, Sparkles, Scale } from "lucide-react";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

export const revalidate = 300;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ cityA?: string; cityB?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const cityA = params.cityA ? params.cityA.toLowerCase() : "lisbon";
  const cityB = params.cityB ? params.cityB.toLowerCase() : "chiangmai";

  const title = `Side-by-Side City Cost & Nomad Comparator | RoamIQ`;
  const description = `Compare living costs, coworking Wi-Fi speeds, digital nomad visa rules, safety, and lifestyle scores side-by-side between top digital nomad destinations on RoamIQ.`;
  const canonical = `${BASE_URL}/destinations/compare`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "RoamIQ",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      founder: "Pranav Gawas",
      ceo: "Pranav Gawas",
      cto: "RoamIQ Tech Leadership",
      "organization:ceo": "Pranav Gawas",
      "organization:cto": "RoamIQ Tech Leadership",
    },
  };
}

async function getAllCities() {
  try {
    const { data, error } = await supabase
      .from("cities")
      .select("*")
      .order("overall_score", { ascending: false });

    if (error || !data) return [];
    return data as City[];
  } catch (err) {
    console.error("Error fetching cities for comparator:", err);
    return [];
  }
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ cityA?: string; cityB?: string }>;
}) {
  const params = await searchParams;
  const cities = await getAllCities();

  const cityAId = params.cityA || "lisbon";
  const cityBId = params.cityB || "chiangmai";

  const breadcrumbJsonLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Destinations", item: `${BASE_URL}/destinations` },
      { "@type": "ListItem", position: 3, name: "City Cost Comparator", item: `${BASE_URL}/destinations/compare` },
    ],
  };

  const faqJsonLd = {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does the RoamIQ side-by-side city comparator work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "RoamIQ calculates real-time side-by-side cost of living breakdowns (rent, coworking, food, transport, internet, health), internet speeds in Mbps, lifestyle scores, and visa eligibility rules for 20+ top nomad destinations worldwide.",
        },
      },
      {
        "@type": "Question",
        name: "What expense items are included in the living cost calculation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Monthly expenses cover housing, dedicated coworking space desk membership, food & groceries, local transit, high-speed fiber internet & SIM card, entertainment, health insurance, visa fees, and miscellaneous budget items.",
        },
      },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [breadcrumbJsonLd, faqJsonLd],
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1 pt-28 sm:pt-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero Section */}
        <section className="border-b border-border bg-secondary/40 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to all destinations
            </Link>

            <div className="mt-4 flex items-center gap-2 text-forest">
              <Scale className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Side-by-Side Analytics</span>
            </div>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Digital Nomad City Cost & Lifestyle Comparator
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Compare 2 remote-work destinations across rent, coworking desks, meal costs, internet speeds, safety ratings, and digital nomad visa eligibility rules.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <CityComparator
            initialCities={cities}
            defaultCityAId={cityAId}
            defaultCityBId={cityBId}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}

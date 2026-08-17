import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Wifi, ArrowRight, ArrowLeft, Building2 } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { supabase, type Listing } from "@/lib/supabase";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

export const metadata: Metadata = {
  title: "Workspaces & stays — Coworking, coliving, workations | RoamIQ",
  description:
    "Browse coworking desks, coliving houses, workations, hostels, cafés and meeting rooms for digital nomads. Filter by city, type, price and Wi‑Fi speed.",
  alternates: {
    canonical: `${BASE_URL}/workspaces`,
  },
  openGraph: {
    title: "Workspaces & stays — Coworking, coliving, workations | RoamIQ",
    description:
      "Browse coworking, coliving, workations and more for digital nomads. Filter by city, type, price and Wi‑Fi.",
    url: `${BASE_URL}/workspaces`,
    siteName: "RoamIQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Workspaces & stays — Coworking, coliving, workations | RoamIQ",
    description:
      "Browse coworking, coliving, workations and more for digital nomads. Filter by city, type, price and Wi‑Fi.",
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

export const revalidate = 180;

const PAGE_SIZE = 24;

const types = [
  { value: "", label: "All types" },
  { value: "coworking", label: "Coworking" },
  { value: "coliving", label: "Coliving" },
  { value: "workation", label: "Workation" },
  { value: "hostel", label: "Hostel" },
  { value: "cafe", label: "Cafe" },
  { value: "meetingroom", label: "Meeting room" },
];

async function getListings(params: {
  search?: string;
  type?: string;
  city?: string;
  min_wifi?: string;
  page?: string;
}) {
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  try {
    let query = supabase
      .from("listings")
      .select(
        "id, company_name, company_title, company_type, city, state, country, starting_price, wifi_speed, ratings, total_reviews, tags, logo_url, images, about, has_24_7_access, has_standing_desks, download_speed_mbps, upload_speed_mbps",
        { count: "exact" }
      )
      .eq("is_public", true)
      .eq("is_active", true);

    if (params.search) {
      query = query.ilike("company_name", `%${params.search}%`);
    }
    if (params.type) {
      query = query.eq("company_type", params.type);
    }
    if (params.city) {
      query = query.ilike("city", `%${params.city}%`);
    }
    if (params.min_wifi) {
      query = query.not("wifi_speed", "is", null);
    }

    const { data, error, count } = await query
      .order("ratings", { ascending: false })
      .range(from, to);

    if (error) {
      console.error(error);
      return { listings: [] as Listing[], count: 0, page };
    }
    return { listings: (data ?? []) as Listing[], count: count ?? 0, page };
  } catch (error) {
    console.error("Error in getListings:", error);
    return { listings: [] as Listing[], count: 0, page };
  }
}

export default async function WorkspacesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string; city?: string; min_wifi?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { listings, count, page } = await getListings(params);
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const buildHref = (targetPage: number) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    if (params.type) qs.set("type", params.type);
    if (params.city) qs.set("city", params.city);
    if (params.min_wifi) qs.set("min_wifi", params.min_wifi);
    qs.set("page", String(targetPage));
    return `/workspaces?${qs.toString()}`;
  };

  
  const breadcrumbJsonLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Workspaces", item: `${BASE_URL}/workspaces` },
    ],
  };

  const itemListJsonLd = {
    "@type": "ItemList",
    name: "Coworking spaces and digital nomad accommodations on RoamIQ",
    numberOfItems: count,
    itemListElement: listings.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.company_name,
      url: `${BASE_URL}/workspaces/${item.id}`,
    })),
  };

  const collectionJsonLd = {
    "@type": "CollectionPage",
    name: "Workspaces & Stays | RoamIQ",
    description: "Browse coworking, coliving, workations and cafes for digital nomads with verified Wi-Fi speeds.",
    url: `${BASE_URL}/workspaces`,
    isPartOf: { "@type": "WebSite", name: "RoamIQ", url: BASE_URL },
    mainEntity: itemListJsonLd,
  };

  const faqJsonLd = {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What types of workspace listings are on RoamIQ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "RoamIQ lists vetted coworking desks, coliving hubs, workation properties, hostels, remote-friendly cafes, and meeting rooms.",
        },
      },
      {
        "@type": "Question",
        name: "How are Wi-Fi speeds verified for workspaces?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Listings on RoamIQ display verified internet speeds in Mbps reported by community members and property hosts.",
        },
      },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [breadcrumbJsonLd, collectionJsonLd, faqJsonLd],
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1 pt-28 sm:pt-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <section className="border-b border-border bg-secondary/40 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-sm font-medium uppercase tracking-widest text-accent">
              Coworking, coliving & more
            </div>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {count.toLocaleString()} workspaces & stays, live from the database.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Coworking desks, coliving houses, workations, hostels, cafés and
              meeting rooms — filter by location, category, and Wi-Fi speed.
            </p>

            <form className="mt-8 flex flex-wrap gap-3" action="/workspaces">
              <input
                type="text"
                name="search"
                defaultValue={params.search ?? ""}
                placeholder="Search by name…"
                className="min-w-[200px] flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="text"
                name="city"
                defaultValue={params.city ?? ""}
                placeholder="City…"
                className="w-40 rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <select
                name="type"
                defaultValue={params.type ?? ""}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {types.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <select
                name="min_wifi"
                defaultValue={params.min_wifi ?? ""}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Any Wi-Fi speed</option>
                <option value="verified">Verified Wi-Fi listed</option>
              </select>
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            {listings.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border py-20 text-center">
                <Building2 className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No listings match those filters. Try a different city or type.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {listings.map((l) => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex items-center justify-between">
                  {page > 1 ? (
                    <Link
                      href={buildHref(page - 1)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
                    >
                      <ArrowLeft className="h-4 w-4" /> Previous
                    </Link>
                  ) : (
                    <span />
                  )}
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages.toLocaleString()}
                  </span>
                  {page < totalPages ? (
                    <Link
                      href={buildHref(page + 1)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary"
                    >
                      Next <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span />
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function getCardImage(listing: Listing): string | null {
  if (listing.images && listing.images.length > 0 && listing.images[0]) {
    return listing.images[0];
  }
  if (listing.logo_url) return listing.logo_url;
  return null;
}

function ListingCard({ listing }: { listing: Listing }) {
  const imageUrl = getCardImage(listing);

  return (
    <Link
      href={`/workspaces/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:shadow-lg hover:shadow-forest/5 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={listing.company_name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <Building2 className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span className="rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/80 backdrop-blur-sm">
            {listing.company_type}
          </span>
          {listing.has_24_7_access && (
            <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              24/7 Access
            </span>
          )}
        </div>
        {listing.has_standing_desks && (
          <span className="absolute right-3 top-3 rounded-full bg-card/90 px-2 py-0.5 text-[9px] font-semibold text-foreground/80 backdrop-blur-sm">
            Standing Desks
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg font-semibold tracking-tight line-clamp-1 group-hover:text-accent transition-colors">
          {listing.company_name}
        </h3>
        {listing.company_title && (
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
            {listing.company_title}
          </p>
        )}
        {listing.about && (
          <p className="mt-1 text-sm text-foreground/70 line-clamp-2">
            {listing.about}
          </p>
        )}

        <div className="mt-2.5 flex items-center gap-1.5 text-sm text-foreground/70">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">
            {listing.city}, {listing.country}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div>
            {listing.starting_price && (
              <div className="font-serif text-lg font-semibold text-forest">
                {listing.starting_price}
              </div>
            )}
            {listing.wifi_speed && (
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Wifi className="h-3 w-3" /> {listing.wifi_speed}
              </div>
            )}
          </div>
          {listing.ratings > 0 && (
            <div className="flex items-center gap-1 text-sm font-medium">
              <Star className="h-3.5 w-3.5 fill-sunset text-sunset" />
              {Number(listing.ratings).toFixed(1)}
              <span className="text-xs font-normal text-muted-foreground">
                ({listing.total_reviews})
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

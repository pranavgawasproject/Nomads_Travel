import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Star,
  MapPin,
  Wifi,
  ArrowLeft,
  Building2,
  Globe,
  Clock,
  Users,
  ExternalLink,
} from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { supabase, type Listing } from "@/lib/supabase";

export const revalidate = 180;

const BASE_URL = "https://nomads-travel-indol.vercel.app";

async function getListing(id: string) {
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .eq("is_public", true)
      .eq("is_active", true)
      .single();

    if (error || !data) return null;
    return data as Listing;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const listing = await getListing(id);

    if (!listing) {
      return {
        title: "Workspace not found | RoamIQ",
        description: "This workspace listing could not be found on RoamIQ.",
      };
    }

    const location = [
      listing.city,
      listing.state,
      listing.country,
    ]
      .filter(Boolean)
      .join(", ");

    const title = `${listing.company_name}${location ? ` — ${location}` : ""} | RoamIQ Workspaces`;

    const aboutSnippet = (listing.about || listing.description || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 140);

    const extras: string[] = [];
    if (listing.starting_price) extras.push(String(listing.starting_price));
    if (listing.wifi_speed) extras.push(String(listing.wifi_speed));
    if (listing.company_type) extras.push(String(listing.company_type));

    const description =
      aboutSnippet ||
      `${listing.company_name}${location ? ` in ${location}` : ""} — coworking and workspace details for digital nomads on RoamIQ.${extras.length ? ` ${extras.join(" · ")}.` : ""}`;

    const url = `${BASE_URL}/workspaces/${listing.id}`;
    const image =
      (listing.images && listing.images.length > 0 && listing.images[0]) ||
      listing.logo_url ||
      undefined;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        siteName: "RoamIQ",
        type: "article",
        ...(image
          ? { images: [{ url: image, alt: listing.company_name }] }
          : {}),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(image ? { images: [image] } : {}),
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
  } catch {
    return {
      title: "Workspace | RoamIQ",
      description: "Explore coworking spaces and workspaces for digital nomads on RoamIQ.",
    };
  }
}

export default async function WorkspaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) notFound();

  const images: string[] =
    listing.images && listing.images.length > 0
      ? listing.images.filter(Boolean)
      : listing.logo_url
        ? [listing.logo_url]
        : [];

  const tags: string[] = Array.isArray(listing.tags) ? listing.tags : [];

  const locationParts = [listing.city, listing.state, listing.country].filter(Boolean);
  const pageUrl = `${BASE_URL}/workspaces/${listing.id}`;
  const primaryImage =
    images[0] || listing.logo_url || undefined;

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
        name: "Workspaces",
        item: `${BASE_URL}/workspaces`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: listing.company_name,
        item: pageUrl,
      },
    ],
  };

  // LocalBusiness from real listing fields only — never invent ratings/prices
  const localBusinessJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: listing.company_name,
    url: pageUrl,
    description: (listing.about || listing.description || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 300) || undefined,
  };
  if (listing.company_type) localBusinessJsonLd.additionalType = String(listing.company_type);
  if (primaryImage) localBusinessJsonLd.image = primaryImage;
  if (listing.website) localBusinessJsonLd.sameAs = [listing.website];
  if (listing.address || locationParts.length) {
    localBusinessJsonLd.address = {
      "@type": "PostalAddress",
      ...(listing.address ? { streetAddress: listing.address } : {}),
      ...(listing.city ? { addressLocality: listing.city } : {}),
      ...(listing.state ? { addressRegion: listing.state } : {}),
      ...(listing.country ? { addressCountry: listing.country } : {}),
    };
  }
  if (listing.starting_price) {
    localBusinessJsonLd.priceRange = String(listing.starting_price);
  }
  if (listing.ratings > 0 && listing.total_reviews > 0) {
    localBusinessJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(listing.ratings),
      reviewCount: Number(listing.total_reviews),
    };
  }
  if (listing.open_hours) {
    localBusinessJsonLd.openingHours = String(listing.open_hours);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1 pt-28 sm:pt-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        {/* Back link */}
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Link
            href="/workspaces"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to workspaces
          </Link>
        </div>

        {/* Hero image */}
        <section className="mt-6">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-secondary">
              {images[0] ? (
                <Image
                  src={images[0]}
                  alt={listing.company_name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted">
                  <Building2 className="h-20 w-20 text-muted-foreground/40" />
                </div>
              )}
              <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                {listing.company_type}
              </span>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.slice(0, 6).map((src, i) => (
                  <div
                    key={i}
                    className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-border"
                  >
                    <Image
                      src={src}
                      alt={`${listing.company_name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-3">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                  {listing.company_name}
                </h1>
                {listing.company_title && (
                  <p className="mt-2 text-lg text-muted-foreground">
                    {listing.company_title}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {listing.city}
                    {listing.state ? `, ${listing.state}` : ""}, {listing.country}
                  </span>
                  {listing.ratings > 0 && (
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Star className="h-4 w-4 fill-sunset text-sunset" />
                      {Number(listing.ratings).toFixed(1)}
                      <span className="font-normal text-muted-foreground">
                        ({listing.total_reviews} reviews)
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* About */}
              {(listing.about || listing.description) && (
                <div>
                  <h2 className="font-serif text-xl font-semibold">About</h2>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground/80">
                    {listing.about || listing.description}
                  </p>
                </div>
              )}

              {/* Tags / amenities */}
              {tags.length > 0 && (
                <div>
                  <h2 className="font-serif text-xl font-semibold">Amenities</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions */}
              {listing.inclusions && (
                <div>
                  <h2 className="font-serif text-xl font-semibold">Included</h2>
                  <p className="mt-3 leading-relaxed text-foreground/80">
                    {listing.inclusions}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                {listing.starting_price && (
                  <div className="font-serif text-2xl font-semibold text-forest">
                    {listing.starting_price}
                  </div>
                )}

                <div className="mt-5 space-y-3 text-sm">
                  {listing.wifi_speed && (
                    <div className="flex items-center gap-2.5 text-foreground/80">
                      <Wifi className="h-4 w-4 text-muted-foreground" />
                      {listing.wifi_speed}
                    </div>
                  )}
                  {listing.open_hours && (
                    <div className="flex items-center gap-2.5 text-foreground/80">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {listing.open_hours}
                    </div>
                  )}
                  {listing.capacity && (
                    <div className="flex items-center gap-2.5 text-foreground/80">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {listing.capacity}
                    </div>
                  )}
                  {listing.address && (
                    <div className="flex items-start gap-2.5 text-foreground/80">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      {listing.address}
                    </div>
                  )}
                </div>

                {listing.website && (
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Visit website <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                {listing.google_map && (
                  <a
                    href={listing.google_map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    <Globe className="h-4 w-4" /> View on Google Maps
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

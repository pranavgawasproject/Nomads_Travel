import Link from "next/link";
import { Star, MapPin, Wifi, ArrowRight, ArrowLeft, Building2 } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { supabase, type Listing } from "@/lib/supabase";

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
  page?: string;
}) {
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  try {
    let query = supabase
      .from("listings")
      .select(
        "id, company_name, company_title, company_type, city, state, country, starting_price, wifi_speed, ratings, total_reviews, tags",
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
  searchParams: Promise<{ search?: string; type?: string; city?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { listings, count, page } = await getListings(params);
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const buildHref = (targetPage: number) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    if (params.type) qs.set("type", params.type);
    if (params.city) qs.set("city", params.city);
    qs.set("page", String(targetPage));
    return `/workspaces?${qs.toString()}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1 pt-28 sm:pt-32">
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
              meeting rooms — filter to find your fit.
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

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div className="flex flex-col rounded-3xl border border-border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-forest/5">
      <span className="w-fit rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
        {listing.company_type}
      </span>
      <h3 className="mt-3 font-serif text-xl font-semibold tracking-tight">
        {listing.company_name}
      </h3>
      {listing.company_title && (
        <p className="mt-1 text-sm text-muted-foreground">{listing.company_title}</p>
      )}

      <div className="mt-3 flex items-center gap-1.5 text-sm text-foreground/70">
        <MapPin className="h-3.5 w-3.5" />
        {listing.city}, {listing.country}
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
  );
}

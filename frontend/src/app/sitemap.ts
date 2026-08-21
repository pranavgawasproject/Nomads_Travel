import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

/** Fallback city IDs when Supabase is unavailable at sitemap generation time.
 *  Keeps destination detail URLs discoverable for Google even if the DB call fails.
 *  Slugs must match live /destinations/[id] routes (hyphenated). */
const FALLBACK_CITY_IDS = [
  "bangkok",
  "lisbon",
  "bali",
  "medellin",
  "berlin",
  "tokyo",
  "chiangmai",
  "chiang-mai",
  "barcelona",
  "mexicocity",
  "mexico-city",
  "budapest",
  "dubai",
  "tbilisi",
  "da-nang",
  "buenos-aires",
  "cape-town",
  "valencia",
  "tallinn",
  "prague",
  "taipei",
  "kuala-lumpur",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "/",
    "/about",
    "/community",
    "/destinations",
    "/destinations/compare",
    "/pricing",
    "/visa",
    "/workspaces",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    // Homepage always with trailing slash for canonical consistency with GSC property
    url: route === "/" ? `${BASE_URL}/` : `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : 0.7,
  }));

  let cityIds: string[] = [];
  try {
    const { data: cities } = await supabase
      .from("cities")
      .select("id")
      .order("overall_score", { ascending: false });

    if (cities && cities.length > 0) {
      cityIds = cities.map((city) => city.id);
    }
  } catch (error) {
    console.error("Sitemap: failed to fetch cities", error);
  }

  if (cityIds.length === 0) {
    cityIds = [...FALLBACK_CITY_IDS];
  }

  const cityEntries: MetadataRoute.Sitemap = cityIds.map((id) => ({
    url: `${BASE_URL}/destinations/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Include only high-quality workspace listing detail pages
  // Thin-content guard: must have public status, active, non-empty about/description, and verified wifi_speed
  let workspaceEntries: MetadataRoute.Sitemap = [];
  try {
    const { data: listings } = await supabase
      .from("listings")
      .select("id, about, description, wifi_speed")
      .eq("is_public", true)
      .eq("is_active", true)
      .not("wifi_speed", "is", null);

    if (listings && listings.length > 0) {
      const verifiedListings = listings.filter(
        (l) => (l.about || l.description) && l.wifi_speed
      );
      // Cap at 20 strongest listings so crawl budget stays on destinations + static routes
      workspaceEntries = verifiedListings.slice(0, 20).map((l) => ({
        url: `${BASE_URL}/workspaces/${l.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Sitemap: failed to fetch workspace listings", error);
  }

  // Intentionally omit query-string comparison URLs (?cityA=&cityB=) from the sitemap.
  // Google treats many of these as non-canonical / parameter URLs and they were
  // contributing to the single GSC sitemap error. The clean /destinations/compare
  // route remains indexed; users still reach specific pairs via UI and internal links.

  return [...staticEntries, ...cityEntries, ...workspaceEntries];
}

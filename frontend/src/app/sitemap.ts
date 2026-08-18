import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

/** Fallback city IDs when Supabase is unavailable at sitemap generation time.
 *  Keeps destination detail URLs discoverable for Google even if the DB call fails. */
const FALLBACK_CITY_IDS = [
  "chiangmai",
  "taipei",
  "tallinn",
  "lisbon",
  "prague",
  "da-nang",
  "cape-town",
  "valencia",
  "medellin",
  "berlin",
  "tokyo",
  "bali",
  "barcelona",
  "tbilisi",
  "bangkok",
  "mexicocity",
  "budapest",
  "dubai",
  "buenos-aires",
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
    url: `${BASE_URL}${route === "/" ? "/" : route}`,
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

  // Include high-quality workspace listing detail pages (thin-content guard: must have public status and verified wifi speed)
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
      workspaceEntries = verifiedListings.map((l) => ({
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

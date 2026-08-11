import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

/** Fallback city IDs when Supabase is unavailable at sitemap generation time.
 *  Keeps destination detail URLs discoverable for Google even if the DB call fails. */
const FALLBACK_CITY_IDS = [
  "chiang-mai",
  "taipei",
  "tallinn",
  "lisbon",
  "prague",
  "da-nang",
  "cape-town",
  "valencia",
  "tenerife",
  "medellin",
  "oaxaca",
  "canggu",
  "barcelona",
  "tbilisi",
  "bangkok",
  "mexico-city",
  "athens",
  "buenos-aires",
  "kuala-lumpur",
  "bogota",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/community",
    "/destinations",
    "/pricing",
    "/visa",
    "/workspaces",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
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

  return [...staticEntries, ...cityEntries];
}

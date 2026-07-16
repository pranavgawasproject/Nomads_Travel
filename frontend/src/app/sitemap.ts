import { MetadataRoute } from "next";

const BASE_URL = "https://nomads-travel-indol.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/community",
    "/destinations",
    "/pricing",
    "/visa",
    "/workspaces",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}

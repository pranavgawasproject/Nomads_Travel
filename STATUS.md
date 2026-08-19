# 📍 RoamIQ (Nomads_Travel) — Project Status & Future Roadmap

## 📊 Current Project Status
- **Live Vercel Production URL**: [https://nomads-travel-indol.vercel.app](https://nomads-travel-indol.vercel.app)
- **Google Search Console Performance** (2026-07-01 → 2026-08-18):
  - Homepage: **17 clicks**, 312 impressions, avg position **~6.5**, CTR ~5.4%
  - Top query: `roamiq` (4 clicks / 147 impressions, pos ~7.0)
  - Other pages (destinations/*, workspaces/*): near-zero clicks; thin impressions
  - Sitemap: https://nomads-travel-indol.vercel.app/sitemap.xml — **live XML now clean** (0 query-param compare URLs); previously 1 GSC error
- **SEO & Metadata**: Title, high-CTR meta description, OpenGraph, JSON-LD (`Organization` / `WebSite` / `SoftwareApplication` / `TouristDestination` / BreadcrumbList / FAQ), canonicals on key routes.
- **2026-08-15**: Sitemap trimmed — removed hundreds of `/workspaces/{uuid}` listing URLs so crawl budget focuses on static routes + city destination pages (listings still linked internally).
- **2026-08-16**: `/visa` page upgraded with CollectionPage + ItemList + FAQPage JSON-LD built only from live `visa_info` rows.
- **2026-08-17–18**: Multiple autonomous audits — data enrichment, CEO/CTO meta, structured schemas, thin-content guarded workspace URLs.
- **2026-08-18**: Removed query-string comparison URLs (`?cityA=&cityB=`) from `sitemap.ts` and normalized homepage entry. Goal: clear the single GSC sitemap error. Clean `/destinations/compare` route remains.
- **2026-08-19 (03:30 UTC)**: Daily SEO/GSC maintainer run — confirmed live sitemap no longer contains query-param URLs; resubmitted sitemap to GSC. GSC error status will lag (pending re-crawl). Homepage still primary traffic driver. Rotate next run to medi-care / CertifyMe / Nexus for fresh Track A work.

---

## 🔮 Recommended Future Features & Growth Ideas (What to Build Next)

### 1. 🛂 AI Nomad Visa Eligibility Checker
- Interactive 3-step wizard matching remote workers with the best digital nomad visas based on monthly income and passport.

### 2. 🏙️ Side-by-Side City Cost Comparator
- Interactive comparison tool for 2 destination cities across rent, coworking, meals, and Wi-Fi.

### 3. 📄 Programmatic SEO City Landing Pages
- Dynamic SEO-optimized routes (e.g., `/cities/bali`, `/cities/lisbon`) for long-tail searches.

### 4. 🗺️ Coworking Space & Café Review Finder
- User-contributed map & filter for remote-work-friendly cafés with verified high-speed Wi-Fi.

### 5. SEO next (backlog)
- Get `/destinations` list page out of "Discovered - currently not indexed".
- Only re-add listing detail URLs to sitemap when they have non-empty about + wifi_speed + images.
- Re-check GSC indexed count / sitemap errors in a few days after 2026-08-19 resubmit.
- Watch GSC for `/visa` rich-result eligibility after deploy lag.
- **Human review**: Confirm whether homepage testimonials are real or residual placeholder content (spam policy).
- Rotate next maintainer run to medi-care / CertifyMe / Nexus for Track A on-page work.

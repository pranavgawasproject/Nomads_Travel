# 🧭 RoamIQ (Nomads_Travel) — Project Status & Future Roadmap

## 📌 Current Project Status
- **Live Vercel Production URL**: [https://nomads-travel-indol.vercel.app](https://nomads-travel-indol.vercel.app)
- **Google Search Console Performance** (2026-07-22 → 2026-08-21):
  - Homepage: **17 clicks**, 276 impressions, avg position **~5.2**, CTR ~6.2%
  - Top query: `roamiq` (3 clicks / 114 impressions, pos ~6.4)
  - Other pages (destinations/*, workspaces/*): near-zero clicks; thin impressions
  - Sitemap: https://nomads-travel-indol.vercel.app/sitemap.xml — **48 submitted, 0 indexed** (last resubmitted 2026-08-22; lag expected)
- **SEO & Metadata**: Title, high-CTR meta description, OpenGraph, JSON-LD (`Organization` / `WebSite` / `SoftwareApplication` / `TouristDestination` / BreadcrumbList / FAQ), canonicals on key routes.
- **2026-08-22 (~03:37 UTC)**: Daily SEO/GSC maintainer run (Track A). Added FAQPage JSON-LD to homepage (`frontend/src/app/page.tsx`) with 5 Q&As grounded only in live product capabilities (browse without signup, destination data fields, visa lookup, workspace listings). Commit: 3774967.
- **2026-08-22 (~03:30 UTC)**: Daily SEO/GSC maintainer run (Track A). Added OG/Twitter images + keywords to `/destinations` list page metadata (page-level was missing images). Resubmitted sitemap to GSC. Prior audit-only commits noted; rotated review across nexus-suite, CertifyMe, medi-care, Inventory-Management, PixelPerfect — all already had recent SEO code this week. Flag: Notion GSC property remains `siteUnverifiedUser`.
- **2026-08-15**: Sitemap trimmed — removed hundreds of `/workspaces/{uuid}` listing URLs so crawl budget focuses on static routes + city destination pages (listings still linked internally).
- **2026-08-16**: `/visa` page upgraded with CollectionPage + ItemList + FAQPage JSON-LD built only from live `visa_info` rows.
- **2026-08-17–21**: Multiple autonomous audits — data enrichment, CEO/CTO meta, structured schemas, thin-content guarded workspace URLs, sitemap fallback city slug alignment.

---

## 🧭 Recommended Future Features & Growth Ideas (What to Build Next)

### 1. 🛂 AI Nomad Visa Eligibility Checker
- Interactive 3-step wizard matching remote workers with the best digital nomad visas based on monthly income and passport.

### 2. 📊 Side-by-Side City Cost Comparator
- Interactive comparison tool for 2 destination cities across rent, coworking, meals, and Wi-Fi.

### 3. 🏙️ Programmatic SEO City Landing Pages
- Dynamic SEO-optimized routes (e.g., `/cities/bali`, `/cities/lisbon`) for long-tail searches.

### 4. 🗺️ Coworking Space & Café Review Finder
- User-contributed map & filter for remote-work-friendly cafés with verified high-speed Wi-Fi.

### 5. SEO next (backlog)
- Get `/destinations` list page out of "Discovered - currently not indexed" (monitor after 2026-08-22 resubmit + OG image fix).
- Only re-add listing detail URLs to sitemap when they have non-empty about + wifi_speed + images.
- Watch GSC indexed count / sitemap errors in a few days after 2026-08-22 resubmit.
- Watch GSC for `/visa` rich-result eligibility after deploy lag.
- **Human review**: Confirm whether homepage testimonials are real or residual placeholder content (spam policy).
- Prefer a real 1200×630 PNG OG image over `/logo.svg` for social previews (requires design asset).
- Rotate next maintainer run to WeatherTrackerX / ChatApp / Proofly for Track A on-page work if those still lack structured data depth.

# 📌 RoamIQ (Nomads_Travel) — Project Status & Future Roadmap

## 📊 Current Project Status
- **Live Vercel Production URL**: [https://nomads-travel-indol.vercel.app](https://nomads-travel-indol.vercel.app)
- **Google Search Console Performance** (2026-07-01 → 2026-08-15):
  - Homepage: **16 clicks**, 288 impressions, avg position **~6.5**, CTR ~5.6%
  - Top query: `roamiq` (4 clicks / 139 impressions, pos ~7)
  - Other pages (destinations/*, workspaces/*): near-zero clicks; thin impressions
  - Sitemap: https://nomads-travel-indol.vercel.app/sitemap.xml — 27 submitted / **0 indexed** (as of last GSC pull; lag expected after trim)
- **SEO & Metadata**: Title, high-CTR meta description, OpenGraph, JSON-LD (`Organization` / `WebSite` / `SoftwareApplication`), BreadcrumbList / FAQPage / CollectionPage on key routes.
- **2026-08-15**: Sitemap trimmed — removed hundreds of `/workspaces/{uuid}` listing URLs so crawl budget focuses on static routes + city destination pages (listings still linked internally).
- **2026-08-16**: `/visa` page upgraded with CollectionPage + ItemList + FAQPage JSON-LD built only from live `visa_info` rows (country counts, DN-visa flags, tourist days, listed cost/duration). No fabricated fees or legal claims.
- **2026-08-16 (this run)**: Confirmed GSC data above. Homepage still shows named testimonials (Mira Tanaka, Diego Marín, Aisha Bello) — prior commit claimed removal of fabricated testimonials; content review recommended to avoid Google spam-policy risk. Notion property remains siteUnverifiedUser.

---

## 🚀 Recommended Future Features & Growth Ideas (What to Build Next)

### 1. 🛂 AI Nomad Visa Eligibility Checker
- Interactive 3-step wizard matching remote workers with the best digital nomad visas (Spain, Portugal, Costa Rica, Bali) based on monthly income and passport.

### 2. 🏙️ Side-by-Side City Cost Comparator
- Interactive comparison tool allowing nomads to compare 2 destination cities (e.g., Lisbon vs. Chiang Mai) across rent, coworking spaces, meal costs, and Wi-Fi speed.

### 3. 🌐 Programmatic SEO City Landing Pages
- Generate dynamic SEO-optimized routes (e.g., `/cities/bali`, `/cities/lisbon`, `/cities/medellin`) to capture high-volume long-tail Google searches.

### 4. ☕ Coworking Space & Cafe Review Finder
- User-contributed map & filter for remote-work-friendly cafes with verified high-speed Wi-Fi ratings and power socket availability.

### 5. SEO next (backlog)
- Get `/destinations` list page out of "Discovered - currently not indexed".
- Only re-add listing detail URLs to sitemap when they have non-empty about + wifi_speed + images (thin-content guard).
- Resubmit sitemap after deploy and re-check GSC indexed count in a few days.
- Watch GSC for `/visa` rich-result eligibility after deploy lag.
- **Human review**: Confirm whether homepage testimonials are real or residual placeholder content (spam policy).
- Rotate next maintainer run to medi-care / CertifyMe / Nexus for Track A on-page work.

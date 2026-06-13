# RoamIQ Listings — Spreadsheet Column Guide

Give this to your AI agent so it fills the sheet with the correct columns and values.

---

## Sheet 1: `listings` (Main table — one row per space)

| # | Column | Required? | Type | Example Value | Notes |
|---|--------|-----------|------|---------------|-------|
| 1 | `business_id` | Yes | text | `hub53-canggu-bali` | Unique slug: `{name}-{city}-{state}`. Lowercase, hyphens, no spaces |
| 2 | `company_name` | Yes | text | `Hub53 Coworking` | Display name of the space |
| 3 | `company_title` | No | text | `Hub53 Coworking — Your Digital Home in Bali` | Tagline shown on cards/detail page |
| 4 | `registered_entity_name` | No | text | `PT Hub53 Digital Workspace` | Legal entity name |
| 5 | `company_type` | Yes | enum | `coworking` | **MUST be one of:** `coworking`, `coliving`, `workation`, `meetingroom`, `privatestay`, `hostel`, `cafe` |
| 6 | `address` | No | text | `Jl. Pantai Batu Bolong No.88, Canggu` | Full street address |
| 7 | `city` | Yes | text | `Canggu` | City/town name |
| 8 | `state` | Yes | text | `Bali` | State/province/region |
| 9 | `country` | Yes | text | `Indonesia` | Country name |
| 10 | `continent` | Yes | text | `Asia` | **MUST be one of:** `Asia`, `Europe`, `North America`, `South America`, `Africa`, `Oceania` |
| 11 | `latitude` | No | number | `-8.6523` | Decimal degrees |
| 12 | `longitude` | No | number | `115.1388` | Decimal degrees |
| 13 | `google_map` | No | text | `https://maps.google.com/?q=-8.6523,115.1388` | Google Maps link |
| 14 | `logo_url` | No | text | `https://example.com/logo.png` | Logo image URL |
| 15 | `images` | No | text | `https://img1.jpg\|https://img2.jpg\|https://img3.jpg` | **Pipe-separated** image URLs (I'll convert to array on import) |
| 16 | `about` | No | text | `Hub53 is Bali's premier coworking space...` | Full description (3-5 sentences) |
| 17 | `inclusions` | No | text | `High-Speed WiFi, Ergonomic Chairs, Standing Desks, Meeting Rooms, Unlimited Coffee` | Comma-separated amenities |
| 18 | `services` | No | text | `Virtual Office, Mail Handling, Company Registration` | Comma-separated services |
| 19 | `cost` | No | text | `$120/mo` | Price display string |
| 20 | `units` | No | text | `50 seats` | e.g. "50 seats", "20 rooms", "10 beds" |
| 21 | `total_seats` | No | integer | `50` | Numeric capacity |
| 22 | `description` | No | text | `Tropical coworking in the heart of Canggu` | Short tagline |
| 23 | `product_name` | No | text | `Hot Desk` | Primary product/plan name |
| 24 | `wifi_speed` | No | text | `250 Mbps` | Internet speed display |
| 25 | `starting_price` | No | text | `$150/mo` | Starting price for detail page |
| 26 | `open_hours` | No | text | `24/7 Access` | Operating hours display |
| 27 | `capacity` | No | text | `120 Seats` | Capacity display for detail page |
| 28 | `website` | No | text | `https://hub53.co` | Official website |
| 29 | `website_template_link` | No | text | `https://hub53.co` | Same as website or template page |
| 30 | `contact_name` | No | text | `Ayu Sari` | Point of contact name |
| 31 | `contact_designation` | No | text | `Community Manager` | POC role |
| 32 | `contact_email` | No | text | `hello@hub53.co` | Contact email |
| 33 | `contact_phone` | No | text | `+62 812-3456-7890` | Phone with country code |
| 34 | `social_links` | No | json | `{"whatsapp":"+6281234567890","instagram":"@hub53"}` | JSON object of social links |
| 35 | `ratings` | No | decimal | `4.7` | 0.0 to 5.0 |
| 36 | `total_reviews` | No | integer | `128` | Review count |
| 37 | `is_active` | No | boolean | `true` | Default: `true` |
| 38 | `is_public` | No | boolean | `true` | Default: `true` — must be true to show on site |
| 39 | `is_registered` | No | boolean | `false` | Default: `false` |
| 40 | `tags` | No | text | `24/7 Access\|Pool\|Community Events` | **Pipe-separated** tags (I'll convert to array on import) |

---

## Sheet 2: `listing_reviews` (Optional — reviews for listings)

| # | Column | Required? | Type | Example Value | Notes |
|---|--------|-----------|------|---------------|-------|
| 1 | `listing_business_id` | Yes | text | `hub53-canggu-bali` | FK reference — matches `business_id` from listings sheet |
| 2 | `name` | Yes | text | `Sarah Mitchell` | Reviewer name |
| 3 | `star_count` | Yes | integer | `5` | 1 to 5 |
| 4 | `description` | Yes | text | `Absolutely love this place! The internet is blazing fast...` | Review text |

---

## Target Coverage for Your AI Agent

Aim for **5-8 listings per major city** across these types:

| City | Country | Continent | Target Listings |
|------|---------|-----------|-----------------|
| Bangkok | Thailand | Asia | 6-8 |
| Chiang Mai | Thailand | Asia | 4-6 |
| Bali (Canggu/Ubud) | Indonesia | Asia | 6-8 |
| Lisbon | Portugal | Europe | 6-8 |
| Barcelona | Spain | Europe | 4-6 |
| Berlin | Germany | Europe | 4-6 |
| Budapest | Hungary | Europe | 4-6 |
| Medellín | Colombia | South America | 4-6 |
| Mexico City | Mexico | North America | 4-6 |
| Dubai | UAE | Asia | 4-6 |
| Tbilisi | Georgia | Europe | 3-5 |
| Tokyo | Japan | Asia | 4-6 |

**Stretch cities (if you want more):**
Goa (India), Da Nang (Vietnam), Ho Chi Minh City (Vietnam), Kuala Lumpur (Malaysia), Prague (Czech Republic), Buenos Aires (Argentina), Istanbul (Turkey), Nairobi (Kenya), Playa del Carmen (Mexico), Cape Town (South Africa)

### Type Distribution per City:
- 2-3 **coworking** spaces
- 1-2 **coliving** spaces
- 1 **cafe** with good WiFi
- 1 **hostel** or **workation** (optional)

### Total Target: ~80-120 listings

---

## CSV/Sheet Formatting Rules

1. **images column**: Use pipe `|` to separate URLs. Example: `https://img1.jpg|https://img2.jpg|https://img3.jpg`
2. **tags column**: Use pipe `|` to separate tags. Example: `24/7 Access|Pool|Community Events`
3. **social_links column**: Use JSON format. Example: `{"instagram":"@hub53","whatsapp":"+6281234567890"}`
4. **company_type**: Must be exactly one of the 7 allowed values (lowercase)
5. **continent**: Must be exactly one of: `Asia`, `Europe`, `North America`, `South America`, `Africa`, `Oceania`
6. **ratings**: Decimal between 0.0 and 5.0
7. **Empty optional fields**: Leave blank (don't write "N/A" or "null")

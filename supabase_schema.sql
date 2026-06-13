-- =============================================
-- RoamIQ Database Schema for Supabase
-- =============================================

-- 1. CITIES TABLE (public read)
CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  flag TEXT NOT NULL,
  image TEXT,
  continent TEXT,
  overall_score NUMERIC(3,2) DEFAULT 0,
  cost_score NUMERIC(3,2) DEFAULT 0,
  internet_score NUMERIC(3,2) DEFAULT 0,
  safety_score NUMERIC(3,2) DEFAULT 0,
  fun_score NUMERIC(3,2) DEFAULT 0,
  walkability_score NUMERIC(3,2) DEFAULT 0,
  nightlife_score NUMERIC(3,2) DEFAULT 0,
  air_score NUMERIC(3,2) DEFAULT 0,
  cost_usd INTEGER DEFAULT 0,
  internet_mbps INTEGER DEFAULT 0,
  avg_temp INTEGER DEFAULT 0,
  visa_difficulty TEXT DEFAULT 'Medium',
  air_quality TEXT DEFAULT 'Moderate',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COST OF LIVING TABLE (public read)
CREATE TABLE IF NOT EXISTS cost_of_living (
  id SERIAL PRIMARY KEY,
  city_id TEXT REFERENCES cities(id) ON DELETE CASCADE,
  housing INTEGER DEFAULT 0,
  coworking INTEGER DEFAULT 0,
  food INTEGER DEFAULT 0,
  transport INTEGER DEFAULT 0,
  internet INTEGER DEFAULT 0,
  entertainment INTEGER DEFAULT 0,
  health INTEGER DEFAULT 0,
  visa INTEGER DEFAULT 0,
  misc INTEGER DEFAULT 0,
  tip1 TEXT,
  tip2 TEXT,
  tip3 TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VISA INFO TABLE (public read)
CREATE TABLE IF NOT EXISTS visa_info (
  id SERIAL PRIMARY KEY,
  country TEXT NOT NULL,
  flag TEXT NOT NULL,
  tourist_days INTEGER DEFAULT 90,
  has_dn_visa BOOLEAN DEFAULT FALSE,
  dn_visa_cost TEXT DEFAULT 'N/A',
  dn_visa_duration TEXT DEFAULT 'N/A',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. NOMAD PROFILES TABLE (public read, user write)
CREATE TABLE IF NOT EXISTS nomad_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT,
  country TEXT,
  flag TEXT,
  home_country TEXT,
  role TEXT,
  work_type TEXT,
  interests TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open',
  avatar_gradient TEXT DEFAULT 'from-cyan-500 to-blue-500',
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TRIPS TABLE (user-scoped)
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  flag TEXT DEFAULT '',
  arrival DATE NOT NULL,
  departure DATE NOT NULL,
  purpose TEXT DEFAULT 'Workation',
  rating INTEGER DEFAULT 4 CHECK (rating >= 1 AND rating <= 5),
  notes TEXT DEFAULT '',
  image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. VISA STAYS TABLE (user-scoped)
CREATE TABLE IF NOT EXISTS visa_stays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  country TEXT NOT NULL,
  flag TEXT DEFAULT '',
  arrival DATE NOT NULL,
  departure DATE NOT NULL,
  days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MEETUPS TABLE (public read)
CREATE TABLE IF NOT EXISTS meetups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  city TEXT NOT NULL,
  location TEXT NOT NULL,
  attendees INTEGER DEFAULT 0,
  max_attendees INTEGER DEFAULT 20,
  icon TEXT DEFAULT '🤝',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FORUM POSTS TABLE
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  pinned BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FORUM REPLIES TABLE
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. POST LIKES TABLE (prevent duplicate likes)
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 11. LISTINGS TABLE (coworking, coliving, hostels, cafes, workation, meeting rooms, private stays)
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Identity
  business_id TEXT UNIQUE,                    -- e.g. "hub53-canggu-bali"
  company_name TEXT NOT NULL,                  -- e.g. "Hub53 Coworking"
  company_title TEXT,                          -- e.g. "Hub53 Coworking — Your Digital Home in Bali"
  registered_entity_name TEXT,                 -- Legal entity name (optional)

  -- Type & Category
  company_type TEXT NOT NULL                   -- coworking | coliving | workation | meetingroom | privatestay | hostel | cafe
    CHECK (company_type IN ('coworking','coliving','workation','meetingroom','privatestay','hostel','cafe')),

  -- Location
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  continent TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  google_map TEXT,                             -- Google Maps link

  -- Media
  logo_url TEXT,
  images TEXT[] DEFAULT '{}',                  -- Array of image URLs (ordered)

  -- Details
  about TEXT,                                  -- Full description
  inclusions TEXT,                             -- Comma-separated amenities/features
  services TEXT,                               -- Comma-separated services offered
  cost TEXT,                                   -- e.g. "$120/mo", "€50/day"
  units TEXT,                                  -- e.g. "50 seats", "20 rooms"
  total_seats INTEGER,
  description TEXT,                            -- Short description / tagline
  product_name TEXT,                           -- Product/plan name

  -- Quick Stats (for AiProduct detail page)
  wifi_speed TEXT,                             -- e.g. "250 Mbps"
  starting_price TEXT,                         -- e.g. "$150/mo"
  open_hours TEXT,                             -- e.g. "24/7 Access", "8am - 10pm"
  capacity TEXT,                               -- e.g. "120 Seats"

  -- Contact & Links
  website TEXT,
  website_template_link TEXT,
  contact_name TEXT,                           -- POC name
  contact_designation TEXT,                    -- POC role
  contact_email TEXT,
  contact_phone TEXT,
  social_links JSONB DEFAULT '{}',             -- e.g. {"whatsapp": "...", "instagram": "..."}

  -- Ratings & Reviews
  ratings NUMERIC(2,1) DEFAULT 0 CHECK (ratings >= 0 AND ratings <= 5),
  total_reviews INTEGER DEFAULT 0,

  -- Flags
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,              -- Visible on public site
  is_registered BOOLEAN DEFAULT false,         -- Has verified registration

  -- Metadata
  tags TEXT[] DEFAULT '{}',                    -- e.g. ["24/7 Access", "Pool", "Community Events"]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. LISTING REVIEWS TABLE (public read, auth write)
CREATE TABLE IF NOT EXISTS listing_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  star_count INTEGER NOT NULL CHECK (star_count >= 1 AND star_count <= 5),
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Cities: public read
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cities are publicly readable" ON cities FOR SELECT USING (true);

-- Cost of Living: public read
ALTER TABLE cost_of_living ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cost of living is publicly readable" ON cost_of_living FOR SELECT USING (true);

-- Visa Info: public read
ALTER TABLE visa_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visa info is publicly readable" ON visa_info FOR SELECT USING (true);

-- Nomad Profiles: public read, own write
ALTER TABLE nomad_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Nomad profiles are publicly readable" ON nomad_profiles FOR SELECT USING (true);
CREATE POLICY "Users can create own profile" ON nomad_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON nomad_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Trips: owner read/write
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own trips" ON trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own trips" ON trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trips" ON trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trips" ON trips FOR DELETE USING (auth.uid() = user_id);

-- Visa Stays: owner read/write
ALTER TABLE visa_stays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own visa stays" ON visa_stays FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own visa stays" ON visa_stays FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own visa stays" ON visa_stays FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own visa stays" ON visa_stays FOR DELETE USING (auth.uid() = user_id);

-- Meetups: public read, auth write
ALTER TABLE meetups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Meetups are publicly readable" ON meetups FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create meetups" ON meetups FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Forum Posts: public read, auth write
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Forum posts are publicly readable" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON forum_posts FOR DELETE USING (auth.uid() = user_id);

-- Forum Replies: public read, auth write
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Forum replies are publicly readable" ON forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON forum_replies FOR DELETE USING (auth.uid() = user_id);

-- Post Likes: owner read, auth write
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- Listings: public read, admin write
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Listings are publicly readable" ON listings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create listings" ON listings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own listings" ON listings FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Listing Reviews: public read, auth write
ALTER TABLE listing_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Listing reviews are publicly readable" ON listing_reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON listing_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON listing_reviews FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- ENABLE REALTIME
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE forum_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE forum_replies;
ALTER PUBLICATION supabase_realtime ADD TABLE nomad_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE meetups;
ALTER PUBLICATION supabase_realtime ADD TABLE listings;
ALTER PUBLICATION supabase_realtime ADD TABLE listing_reviews;

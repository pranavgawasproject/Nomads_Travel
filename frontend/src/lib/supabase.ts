import { createClient } from "@supabase/supabase-js";

// Next.js only inlines env vars prefixed with NEXT_PUBLIC_ into the client bundle.
// The VITE_* fallback covers server-side rendering until the Vercel project also
// has NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY set (required for
// this client to work in the browser, not just during the build).
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://davvpymbybvniexmkgcu.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdnZweW1ieWJ2bmlleG1rZ2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDkyNzYsImV4cCI6MjA5NjkyNTI3Nn0.am0GEETtim_xQiwoGiHmBduCzzITnS8mpAruCrDUPdU";


/**
 * Single shared Supabase client using the public anon key.
 * Safe to use in both server components and client components —
 * access is governed entirely by Row Level Security policies on the
 * `PranavProject` (Nomads Travel) database.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export type City = {
  id: string;
  name: string;
  country: string;
  flag: string;
  image: string | null;
  continent: string | null;
  overall_score: number;
  cost_score: number;
  internet_score: number;
  safety_score: number;
  fun_score: number;
  walkability_score: number;
  nightlife_score: number;
  air_score: number;
  cost_usd: number;
  internet_mbps: number;
  avg_temp: number;
  visa_difficulty: string;
  air_quality: string;
};

export type CostOfLiving = {
  id: number;
  city_id: string;
  housing: number;
  coworking: number;
  food: number;
  transport: number;
  internet: number;
  entertainment: number;
  health: number;
  visa: number;
  misc: number;
  tip1: string | null;
  tip2: string | null;
  tip3: string | null;
};

export type VisaInfo = {
  id: number;
  country: string;
  flag: string;
  tourist_days: number;
  has_dn_visa: boolean;
  dn_visa_cost: string;
  dn_visa_duration: string;
  min_income?: string | null;
  tax_residency_days?: number | null;
  tax_notes?: string | null;
};

export type Listing = {
  id: string;
  company_name: string;
  company_title: string | null;
  company_type:
    | "coworking"
    | "coliving"
    | "workation"
    | "meetingroom"
    | "privatestay"
    | "hostel"
    | "cafe";
  address: string | null;
  city: string;
  state: string;
  country: string;
  images: string[] | null;
  logo_url?: string | null;
  about: string | null;
  starting_price: string | null;
  wifi_speed: string | null;
  ratings: number;
  total_reviews: number;
  tags: string[] | null;
  website?: string | null;
  google_map?: string | null;
  open_hours?: string | null;
  capacity?: string | null;
  inclusions?: string | null;
  description?: string | null;
};

export type Meetup = {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  city: string;
  location: string;
  attendees: number;
  max_attendees: number;
  icon: string;
};

export type ForumPost = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[] | null;
  pinned: boolean;
  likes: number;
  reply_count: number;
  created_at: string;
  best_answer_id?: string | null;
  city?: string | null;
};

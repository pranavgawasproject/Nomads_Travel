/**
 * Supabase Data Service Layer
 * ---------------------------
 * Every function tries Supabase first, then falls back to static data.
 * This ensures the app works even without the database being set up yet.
 */

import supabase from '../lib/supabase';

/* ══════════════════════════════════════════════════════════════════════════
   STATIC FALLBACK DATA — extracted from the 6 page components
   ══════════════════════════════════════════════════════════════════════════ */

// ── 12 Cities (from AiCompare) ────────────────────────────────────────────
const staticCities = [
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    flag: '\u{1F1F9}\u{1F1ED}',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
    scores: { overall: 4.2, cost: 3.8, internet: 3.5, safety: 3.2, fun: 4.8, walkability: 3.0, nightlife: 4.7, air: 2.8 },
    costUSD: 950,
    internetMbps: 45,
    avgTemp: 28,
    visaDifficulty: 'Easy',
    airQuality: 'Moderate',
  },
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    flag: '\u{1F1F5}\u{1F1F9}',
    image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800',
    scores: { overall: 4.5, cost: 3.2, internet: 4.0, safety: 4.2, fun: 4.3, walkability: 4.0, nightlife: 4.0, air: 4.2 },
    costUSD: 2200,
    internetMbps: 85,
    avgTemp: 18,
    visaDifficulty: 'Medium',
    airQuality: 'Good',
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    flag: '\u{1F1EE}\u{1F1E9}',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    scores: { overall: 4.0, cost: 4.2, internet: 2.8, safety: 3.5, fun: 4.5, walkability: 2.5, nightlife: 3.8, air: 3.0 },
    costUSD: 1100,
    internetMbps: 25,
    avgTemp: 27,
    visaDifficulty: 'Easy',
    airQuality: 'Moderate',
  },
  {
    id: 'medellin',
    name: 'Medell\u00EDn',
    country: 'Colombia',
    flag: '\u{1F1E8}\u{1F1F4}',
    image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800',
    scores: { overall: 3.9, cost: 4.0, internet: 3.2, safety: 2.8, fun: 4.5, walkability: 3.5, nightlife: 4.5, air: 3.5 },
    costUSD: 1200,
    internetMbps: 35,
    avgTemp: 22,
    visaDifficulty: 'Easy',
    airQuality: 'Moderate',
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    flag: '\u{1F1E9}\u{1F1EA}',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800',
    scores: { overall: 4.3, cost: 2.5, internet: 4.5, safety: 4.0, fun: 4.2, walkability: 4.5, nightlife: 4.8, air: 3.8 },
    costUSD: 2800,
    internetMbps: 100,
    avgTemp: 10,
    visaDifficulty: 'Hard',
    airQuality: 'Good',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    flag: '\u{1F1EF}\u{1F1F5}',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    scores: { overall: 4.4, cost: 2.0, internet: 4.8, safety: 4.8, fun: 4.5, walkability: 4.8, nightlife: 4.2, air: 3.5 },
    costUSD: 3200,
    internetMbps: 150,
    avgTemp: 16,
    visaDifficulty: 'Medium',
    airQuality: 'Moderate',
  },
  {
    id: 'chiangmai',
    name: 'Chiang Mai',
    country: 'Thailand',
    flag: '\u{1F1F9}\u{1F1ED}',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
    scores: { overall: 4.1, cost: 4.5, internet: 3.2, safety: 3.5, fun: 3.8, walkability: 2.8, nightlife: 3.5, air: 2.5 },
    costUSD: 750,
    internetMbps: 30,
    avgTemp: 26,
    visaDifficulty: 'Easy',
    airQuality: 'Poor',
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    flag: '\u{1F1EA}\u{1F1F8}',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    scores: { overall: 4.3, cost: 2.8, internet: 4.0, safety: 3.8, fun: 4.7, walkability: 4.5, nightlife: 4.5, air: 4.0 },
    costUSD: 2500,
    internetMbps: 80,
    avgTemp: 17,
    visaDifficulty: 'Medium',
    airQuality: 'Good',
  },
  {
    id: 'mexicocity',
    name: 'Mexico City',
    country: 'Mexico',
    flag: '\u{1F1F2}\u{1F1FD}',
    image: 'https://images.unsplash.com/photo-1516482362041-8b87b69ed28d?w=800',
    scores: { overall: 3.7, cost: 3.8, internet: 3.0, safety: 2.5, fun: 4.3, walkability: 3.2, nightlife: 4.5, air: 2.2 },
    costUSD: 1300,
    internetMbps: 28,
    avgTemp: 17,
    visaDifficulty: 'Easy',
    airQuality: 'Poor',
  },
  {
    id: 'budapest',
    name: 'Budapest',
    country: 'Hungary',
    flag: '\u{1F1ED}\u{1F1FA}',
    image: 'https://images.unsplash.com/photo-1551867633-194f125bddfa?w=800',
    scores: { overall: 4.2, cost: 3.5, internet: 4.2, safety: 4.0, fun: 4.0, walkability: 4.0, nightlife: 4.3, air: 3.5 },
    costUSD: 1600,
    internetMbps: 90,
    avgTemp: 12,
    visaDifficulty: 'Medium',
    airQuality: 'Moderate',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    flag: '\u{1F1E6}\u{1F1EA}',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    scores: { overall: 3.8, cost: 1.8, internet: 4.5, safety: 4.8, fun: 3.8, walkability: 2.5, nightlife: 3.5, air: 2.0 },
    costUSD: 3500,
    internetMbps: 120,
    avgTemp: 33,
    visaDifficulty: 'Easy',
    airQuality: 'Poor',
  },
  {
    id: 'tbilisi',
    name: 'Tbilisi',
    country: 'Georgia',
    flag: '\u{1F1EC}\u{1F1EA}',
    image: 'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=800',
    scores: { overall: 3.9, cost: 4.5, internet: 3.0, safety: 4.0, fun: 3.5, walkability: 3.5, nightlife: 3.8, air: 3.8 },
    costUSD: 900,
    internetMbps: 25,
    avgTemp: 15,
    visaDifficulty: 'Easy',
    airQuality: 'Good',
  },
];

// ── 10 Cost of Living entries (from AiCostOfLiving) ───────────────────────
const staticCostData = [
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    flag: '\u{1F1F9}\u{1F1ED}',
    costs: { housing: 450, coworking: 120, food: 300, transport: 50, internet: 25, entertainment: 100, health: 80, visa: 30, misc: 95 },
    tips: ['Eat at local street food stalls to save 60% on food', 'Use Grab moto-taxi instead of regular taxis', 'Stay in Ari or Ekkamai for cheaper rent with great vibes'],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    flag: '\u{1F1F5}\u{1F1F9}',
    costs: { housing: 950, coworking: 180, food: 450, transport: 45, internet: 35, entertainment: 150, health: 120, visa: 50, misc: 220 },
    tips: ['Live in Almada for half the rent with river views', 'Get a NHR tax regime for potential tax savings', 'Use the monthly metro pass for unlimited transport'],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    flag: '\u{1F1EE}\u{1F1E9}',
    costs: { housing: 500, coworking: 150, food: 250, transport: 80, internet: 30, entertainment: 120, health: 60, visa: 50, misc: 60 },
    tips: ['Rent a villa in Canggu long-term for best value', 'Use GoJek for affordable transport and food delivery', 'Get a social visa (B211A) for 6-month stays'],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: 'medellin',
    name: 'Medell\u00EDn',
    country: 'Colombia',
    flag: '\u{1F1E8}\u{1F1F4}',
    costs: { housing: 550, coworking: 130, food: 280, transport: 40, internet: 25, entertainment: 100, health: 70, visa: 40, misc: 65 },
    tips: ['Stay in Laureles instead of Poblado for cheaper rent', 'Use the Metro system - it is clean and affordable', 'Eat at corrientazo restaurants for $2-3 meals'],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    flag: '\u{1F1E9}\u{1F1EA}',
    costs: { housing: 1100, coworking: 200, food: 500, transport: 86, internet: 35, entertainment: 200, health: 200, visa: 80, misc: 399 },
    tips: ['Apply for the freelance visa for long-term stays', 'Shop at Lidl or Aldi for affordable groceries', 'Use the BVG monthly ticket for all public transport'],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    flag: '\u{1F1EF}\u{1F1F5}',
    costs: { housing: 1200, coworking: 200, food: 500, transport: 80, internet: 40, entertainment: 200, health: 150, visa: 60, misc: 270 },
    tips: ['Live in share houses for affordable social living', 'Eat at conveyor belt sushi and ramen shops', 'Get a JR Pass for affordable train travel'],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    flag: '\u{1F1EA}\u{1F1F8}',
    costs: { housing: 1050, coworking: 170, food: 420, transport: 50, internet: 35, entertainment: 180, health: 130, visa: 60, misc: 205 },
    tips: ['Consider Gr\u00E0cia or Poblenou for better value', 'Use the T-Casual card for discounted metro rides', 'Eat men\u00FA del d\u00EDa for affordable lunch deals'],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: 'budapest',
    name: 'Budapest',
    country: 'Hungary',
    flag: '\u{1F1ED}\u{1F1FA}',
    costs: { housing: 600, coworking: 150, food: 300, transport: 35, internet: 20, entertainment: 120, health: 90, visa: 50, misc: 135 },
    tips: ['Live in District 8 or 9 for affordable central living', 'Eat at \u00E9tkezdekek (local canteens) for cheap meals', 'Use Bubi bike sharing for daily commuting'],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    flag: '\u{1F1E6}\u{1F1EA}',
    costs: { housing: 1500, coworking: 250, food: 600, transport: 100, internet: 80, entertainment: 300, health: 250, visa: 100, misc: 320 },
    tips: ['Consider Sharjah for much cheaper rent nearby', 'Use the metro and avoid taxis during peak hours', 'Look for happy hour deals at upscale restaurants'],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: 'chiangmai',
    name: 'Chiang Mai',
    country: 'Thailand',
    flag: '\u{1F1F9}\u{1F1ED}',
    costs: { housing: 300, coworking: 100, food: 200, transport: 30, internet: 20, entertainment: 80, health: 50, visa: 30, misc: 40 },
    tips: ['Nimman area has the best coworking and cafe scene', 'Rent a scooter for affordable daily transport', 'Eat at university area food courts for 40 baht meals'],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
];

// ── 12 Visa info entries (from AiVisaTracker) ─────────────────────────────
const staticVisaInfo = [
  { id: 1, country: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', touristDays: 60, dnVisa: true, dnCost: '$500', dnDuration: '6 months' },
  { id: 2, country: 'Portugal', flag: '\u{1F1F5}\u{1F1F9}', touristDays: 90, dnVisa: true, dnCost: '\u20AC180', dnDuration: '1 year' },
  { id: 3, country: 'Indonesia', flag: '\u{1F1EE}\u{1F1E9}', touristDays: 30, dnVisa: true, dnCost: '$300', dnDuration: '6 months' },
  { id: 4, country: 'Spain', flag: '\u{1F1EA}\u{1F1F8}', touristDays: 90, dnVisa: true, dnCost: '\u20AC70', dnDuration: '1 year' },
  { id: 5, country: 'Germany', flag: '\u{1F1E9}\u{1F1EA}', touristDays: 90, dnVisa: true, dnCost: '\u20AC100', dnDuration: '1-3 years' },
  { id: 6, country: 'Colombia', flag: '\u{1F1E8}\u{1F1F4}', touristDays: 90, dnVisa: true, dnCost: '$170', dnDuration: '2 years' },
  { id: 7, country: 'Georgia', flag: '\u{1F1EC}\u{1F1EA}', touristDays: 365, dnVisa: false, dnCost: 'N/A', dnDuration: 'N/A' },
  { id: 8, country: 'Croatia', flag: '\u{1F1ED}\u{1F1F7}', touristDays: 90, dnVisa: true, dnCost: '\u20AC80', dnDuration: '1 year' },
  { id: 9, country: 'Estonia', flag: '\u{1F1EA}\u{1F1EA}', touristDays: 90, dnVisa: true, dnCost: '\u20AC100', dnDuration: '1 year' },
  { id: 10, country: 'UAE', flag: '\u{1F1E6}\u{1F1EA}', touristDays: 30, dnVisa: true, dnCost: '$287', dnDuration: '1 year' },
  { id: 11, country: 'Mexico', flag: '\u{1F1F2}\u{1F1FD}', touristDays: 180, dnVisa: false, dnCost: 'N/A', dnDuration: 'N/A' },
  { id: 12, country: 'Brazil', flag: '\u{1F1E7}\u{1F1F7}', touristDays: 90, dnVisa: true, dnCost: 'R$168', dnDuration: '1 year' },
];

// ── 5 Sample visa stays (from AiVisaTracker) ──────────────────────────────
const staticVisaStays = [
  { id: 1, country: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', daysThisYear: 65, maxTouristDays: 60, hasDNVisa: true, dnVisaCost: '$500', dnVisaDuration: '6 months', stays: [{ arrival: '2025-01-15', departure: '2025-03-20' }] },
  { id: 2, country: 'Portugal', flag: '\u{1F1F5}\u{1F1F9}', daysThisYear: 75, maxTouristDays: 90, hasDNVisa: true, dnVisaCost: '\u20AC180', dnVisaDuration: '1 year', stays: [{ arrival: '2025-04-01', departure: '2025-06-14' }] },
  { id: 3, country: 'Indonesia', flag: '\u{1F1EE}\u{1F1E9}', daysThisYear: 30, maxTouristDays: 30, hasDNVisa: true, dnVisaCost: '$300', dnVisaDuration: '6 months', stays: [{ arrival: '2025-07-01', departure: '2025-07-30' }] },
  { id: 4, country: 'Germany', flag: '\u{1F1E9}\u{1F1EA}', daysThisYear: 110, maxTouristDays: 90, hasDNVisa: true, dnVisaCost: '\u20AC100', dnVisaDuration: '1-3 years', stays: [{ arrival: '2025-08-01', departure: '2025-11-18' }] },
  { id: 5, country: 'Colombia', flag: '\u{1F1E8}\u{1F1F4}', daysThisYear: 0, maxTouristDays: 90, hasDNVisa: true, dnVisaCost: '$170', dnVisaDuration: '2 years', stays: [] },
];

// ── 6 Sample trips (from AiTripTracker) ───────────────────────────────────
const staticTrips = [
  { id: 1, city: 'Bangkok', country: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', arrival: '2025-01-15', departure: '2025-03-20', purpose: 'Workation', rating: 5, notes: 'Amazing street food and affordable coworking spaces', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400' },
  { id: 2, city: 'Lisbon', country: 'Portugal', flag: '\u{1F1F5}\u{1F1F9}', arrival: '2025-04-01', departure: '2025-06-15', purpose: 'Workation', rating: 4, notes: 'Great WiFi and beautiful sunsets', image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400' },
  { id: 3, city: 'Bali', country: 'Indonesia', flag: '\u{1F1EE}\u{1F1E9}', arrival: '2025-07-01', departure: '2025-09-30', purpose: 'Vacation', rating: 5, notes: 'Paradise! Villas are incredible value', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
  { id: 4, city: 'Berlin', country: 'Germany', flag: '\u{1F1E9}\u{1F1EA}', arrival: '2024-09-01', departure: '2024-12-20', purpose: 'Business', rating: 4, notes: 'Great startup scene and networking events', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400' },
  { id: 5, city: 'Tokyo', country: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', arrival: '2024-06-01', departure: '2024-08-30', purpose: 'Vacation', rating: 5, notes: 'Culture shock but absolutely worth it', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
  { id: 6, city: 'Medell\u00EDn', country: 'Colombia', flag: '\u{1F1E8}\u{1F1F4}', arrival: '2024-03-01', departure: '2024-05-15', purpose: 'Workation', rating: 4, notes: 'Spring weather year-round, love it', image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=400' },
];

// ── 15 Nomad profiles (from AiNearbyNomads) ───────────────────────────────
const staticNomadProfiles = [
  { id: 1, name: 'Sarah Chen', initials: 'SC', gradient: 'from-cyan-500 to-blue-500', city: 'Bangkok', country: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', homeCountry: 'Canada \u{1F1E8}\u{1F1E6}', role: 'UX Designer', workType: 'Full-time Remote', interests: ['Coworking', 'Photography', 'Street Food'], status: 'available', lastActive: '2m ago' },
  { id: 2, name: 'Marcus Weber', initials: 'MW', gradient: 'from-purple-500 to-pink-500', city: 'Lisbon', country: 'Portugal', flag: '\u{1F1F5}\u{1F1F9}', homeCountry: 'Germany \u{1F1E9}\u{1F1EA}', role: 'Software Engineer', workType: 'Freelancer', interests: ['Surfing', 'Coffee', 'Hiking'], status: 'open', lastActive: '15m ago' },
  { id: 3, name: 'Aisha Patel', initials: 'AP', gradient: 'from-amber-500 to-red-500', city: 'Bali', country: 'Indonesia', flag: '\u{1F1EE}\u{1F1E9}', homeCountry: 'UK \u{1F1EC}\u{1F1E7}', role: 'Content Creator', workType: 'Entrepreneur', interests: ['Yoga', 'Writing', 'Beach'], status: 'available', lastActive: '5m ago' },
  { id: 4, name: 'Diego Santos', initials: 'DS', gradient: 'from-green-500 to-teal-500', city: 'Medell\u00EDn', country: 'Colombia', flag: '\u{1F1E8}\u{1F1F4}', homeCountry: 'Brazil \u{1F1E7}\u{1F1F7}', role: 'Data Scientist', workType: 'Full-time Remote', interests: ['Hiking', 'Music', 'Cooking'], status: 'busy', lastActive: '2h ago' },
  { id: 5, name: 'Emma Lindqvist', initials: 'EL', gradient: 'from-rose-500 to-orange-500', city: 'Bangkok', country: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', homeCountry: 'Sweden \u{1F1F8}\u{1F1EA}', role: 'Marketing Manager', workType: 'Full-time Remote', interests: ['Coworking', 'Street Food', 'Photography'], status: 'available', lastActive: '8m ago' },
  { id: 6, name: 'Yuki Tanaka', initials: 'YT', gradient: 'from-indigo-500 to-cyan-500', city: 'Berlin', country: 'Germany', flag: '\u{1F1E9}\u{1F1EA}', homeCountry: 'Japan \u{1F1EF}\u{1F1F5}', role: 'Product Designer', workType: 'Freelancer', interests: ['Art', 'Coffee', 'Cycling'], status: 'open', lastActive: '30m ago' },
  { id: 7, name: 'Alex Rivera', initials: 'AR', gradient: 'from-teal-500 to-emerald-500', city: 'Lisbon', country: 'Portugal', flag: '\u{1F1F5}\u{1F1F9}', homeCountry: 'USA \u{1F1FA}\u{1F1F8}', role: 'Startup Founder', workType: 'Entrepreneur', interests: ['Networking', 'Surfing', 'Tech'], status: 'available', lastActive: '1m ago' },
  { id: 8, name: 'Nina Kowalski', initials: 'NK', gradient: 'from-violet-500 to-fuchsia-500', city: 'Budapest', country: 'Hungary', flag: '\u{1F1ED}\u{1F1FA}', homeCountry: 'Poland \u{1F1F5}\u{1F1F1}', role: 'Copywriter', workType: 'Freelancer', interests: ['Writing', 'Coffee', 'History'], status: 'open', lastActive: '45m ago' },
  { id: 9, name: 'James Okafor', initials: 'JO', gradient: 'from-sky-500 to-indigo-500', city: 'Bali', country: 'Indonesia', flag: '\u{1F1EE}\u{1F1E9}', homeCountry: 'Nigeria \u{1F1F3}\u{1F1EC}', role: 'Web Developer', workType: 'Full-time Remote', interests: ['Surfing', 'Coding', 'Beach'], status: 'available', lastActive: '10m ago' },
  { id: 10, name: 'Sofia Morales', initials: 'SM', gradient: 'from-pink-500 to-rose-500', city: 'Barcelona', country: 'Spain', flag: '\u{1F1EA}\u{1F1F8}', homeCountry: 'Mexico \u{1F1F2}\u{1F1FD}', role: 'Graphic Designer', workType: 'Freelancer', interests: ['Art', 'Photography', 'Wine'], status: 'open', lastActive: '1h ago' },
  { id: 11, name: 'Liam Foster', initials: 'LF', gradient: 'from-orange-500 to-amber-500', city: 'Bangkok', country: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', homeCountry: 'Australia \u{1F1E6}\u{1F1FA}', role: 'SEO Consultant', workType: 'Entrepreneur', interests: ['Muay Thai', 'Street Food', 'Travel'], status: 'busy', lastActive: '3h ago' },
  { id: 12, name: 'Hana Kim', initials: 'HK', gradient: 'from-cyan-400 to-purple-500', city: 'Tokyo', country: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', homeCountry: 'South Korea \u{1F1F0}\u{1F1F7}', role: 'App Developer', workType: 'Full-time Remote', interests: ['Coding', 'Coffee', 'Anime'], status: 'available', lastActive: '5m ago' },
  { id: 13, name: 'Oliver Schmidt', initials: 'OS', gradient: 'from-emerald-500 to-cyan-500', city: 'Medell\u00EDn', country: 'Colombia', flag: '\u{1F1E8}\u{1F1F4}', homeCountry: 'Austria \u{1F1E6}\u{1F1F9}', role: 'Video Editor', workType: 'Freelancer', interests: ['Photography', 'Dancing', 'Cooking'], status: 'open', lastActive: '20m ago' },
  { id: 14, name: 'Priya Sharma', initials: 'PS', gradient: 'from-yellow-500 to-red-500', city: 'Bali', country: 'Indonesia', flag: '\u{1F1EE}\u{1F1E9}', homeCountry: 'India \u{1F1EE}\u{1F1F3}', role: 'Business Analyst', workType: 'Full-time Remote', interests: ['Yoga', 'Reading', 'Nature'], status: 'available', lastActive: '12m ago' },
  { id: 15, name: 'Tom Bakker', initials: 'TB', gradient: 'from-blue-500 to-violet-500', city: 'Lisbon', country: 'Portugal', flag: '\u{1F1F5}\u{1F1F9}', homeCountry: 'Netherlands \u{1F1F3}\u{1F1F1}', role: 'Blockchain Dev', workType: 'Entrepreneur', interests: ['Tech', 'Surfing', 'Wine'], status: 'open', lastActive: '40m ago' },
];

// ── 6 Meetups (from AiNearbyNomads) ───────────────────────────────────────
const staticMeetups = [
  { id: 1, title: 'Bangkok Coworking Friday', type: 'Coworking Session', date: 'Jun 14, 2025', time: '9:00 AM', city: 'Bangkok', location: 'The Hive Thonglor', attendees: 12, maxAttendees: 20, icon: '\u{1F4BB}' },
  { id: 2, title: 'Lisbon Digital Nomads Meetup', type: 'Networking Event', date: 'Jun 15, 2025', time: '6:00 PM', city: 'Lisbon', location: 'Second Home Lisbon', attendees: 28, maxAttendees: 40, icon: '\u{1F91D}' },
  { id: 3, title: 'Bali Sunset Surf Session', type: 'Hiking Group', date: 'Jun 16, 2025', time: '4:00 PM', city: 'Bali', location: 'Echo Beach, Canggu', attendees: 8, maxAttendees: 15, icon: '\u{1F3C4}' },
  { id: 4, title: 'Berlin Coffee & Code', type: 'Coffee Meetup', date: 'Jun 17, 2025', time: '10:00 AM', city: 'Berlin', location: 'Betahaus Caf\u00E9', attendees: 6, maxAttendees: 12, icon: '\u2615' },
  { id: 5, title: 'Medell\u00EDn Workshop: Remote Taxes', type: 'Workshop', date: 'Jun 18, 2025', time: '2:00 PM', city: 'Medell\u00EDn', location: 'Selina Co-work', attendees: 15, maxAttendees: 25, icon: '\u{1F4DA}' },
  { id: 6, title: 'Budapest Nomad Walking Tour', type: 'Networking Event', date: 'Jun 19, 2025', time: '11:00 AM', city: 'Budapest', location: 'De\u00E1k Ferenc t\u00E9r', attendees: 10, maxAttendees: 20, icon: '\u{1F6B6}' },
];

// ── 12 Forum posts with replies (from AiForum) ────────────────────────────
const staticForumPosts = [
  {
    id: 1,
    title: 'Best countries for digital nomad visa in 2025?',
    content: 'Looking to apply for a digital nomad visa. Which countries have the best programs right now? I am considering Portugal, Estonia, and Croatia. Any experiences with the application process?',
    author: { name: 'Sarah Chen', initials: 'SC', gradient: 'from-cyan-500 to-blue-500' },
    category: 'Visas & Immigration',
    replies: 24,
    likes: 45,
    timeAgo: '2h ago',
    pinned: true,
    tags: ['visa', 'digital-nomad', '2025'],
    replyList: [
      { id: 101, content: 'Portugal D8 visa is great! Took me about 3 months to process. The key is having all your documents apostilled beforehand.', author: { name: 'Marcus Weber', initials: 'MW', gradient: 'from-purple-500 to-pink-500' }, likes: 12, timeAgo: '1h ago' },
      { id: 102, content: 'Estonia e-Residency is not really a visa - it does not give you the right to live there. Look into their digital nomad visa separately.', author: { name: 'Yuki Tanaka', initials: 'YT', gradient: 'from-indigo-500 to-cyan-500' }, likes: 8, timeAgo: '45m ago' },
    ],
  },
  {
    id: 2,
    title: 'How do you handle taxes when living in 3+ countries per year?',
    content: 'I spent time in 4 countries last year and now I am confused about tax obligations. Do I need to file in each country? How do double taxation treaties work in practice?',
    author: { name: 'Alex Rivera', initials: 'AR', gradient: 'from-teal-500 to-emerald-500' },
    category: 'Taxes & Finance',
    replies: 18,
    likes: 38,
    timeAgo: '5h ago',
    pinned: false,
    tags: ['taxes', 'compliance', 'multiple-countries'],
    replyList: [
      { id: 201, content: 'Generally you only pay taxes where you are a tax resident. The 183-day rule is key. Keep detailed records of your days in each country.', author: { name: 'Nina Kowalski', initials: 'NK', gradient: 'from-violet-500 to-fuchsia-500' }, likes: 15, timeAgo: '4h ago' },
    ],
  },
  {
    id: 3,
    title: 'Chiang Mai vs Bangkok for long-term stay?',
    content: 'Trying to decide between Chiang Mai and Bangkok for a 6-month stay. I work as a developer and need reliable internet. Cost of living is also important. What are the pros and cons?',
    author: { name: 'James Okafor', initials: 'JO', gradient: 'from-sky-500 to-indigo-500' },
    category: 'Destinations',
    replies: 31,
    likes: 52,
    timeAgo: '8h ago',
    pinned: false,
    tags: ['thailand', 'chiang-mai', 'bangkok'],
    replyList: [
      { id: 301, content: 'Chiang Mai is cheaper and has a great nomad community in Nimman. Bangkok has better internet and more things to do. I prefer CM for focus and BKK for lifestyle.', author: { name: 'Sarah Chen', initials: 'SC', gradient: 'from-cyan-500 to-blue-500' }, likes: 20, timeAgo: '7h ago' },
    ],
  },
  {
    id: 4,
    title: 'Recommendations for portable monitors for travel?',
    content: 'I need a second monitor for coding on the go. Has anyone used the ASUS ZenScreen or Lenovo ThinkVision? Looking for something lightweight that fits in a backpack.',
    author: { name: 'Yuki Tanaka', initials: 'YT', gradient: 'from-indigo-500 to-cyan-500' },
    category: 'Tech & Gear',
    replies: 15,
    likes: 22,
    timeAgo: '12h ago',
    pinned: false,
    tags: ['gear', 'monitors', 'remote-work'],
    replyList: [],
  },
  {
    id: 5,
    title: 'Travel health insurance that actually covers nomads?',
    content: 'Most travel insurance policies require you to have a home base. What insurance actually works for full-time nomads who do not have a permanent address?',
    author: { name: 'Aisha Patel', initials: 'AP', gradient: 'from-amber-500 to-red-500' },
    category: 'Health & Insurance',
    replies: 27,
    likes: 61,
    timeAgo: '1d ago',
    pinned: true,
    tags: ['insurance', 'health', 'nomad-life'],
    replyList: [
      { id: 501, content: 'SafetyWing is designed specifically for nomads. I have been using them for 2 years. About $45/month with decent coverage.', author: { name: 'Diego Santos', initials: 'DS', gradient: 'from-green-500 to-teal-500' }, likes: 25, timeAgo: '22h ago' },
    ],
  },
  {
    id: 6,
    title: 'Best coworking spaces in Lisbon under \u20AC200/month?',
    content: 'Moving to Lisbon next month and looking for affordable coworking options. Prefer areas with good natural light and a community vibe.',
    author: { name: 'Sofia Morales', initials: 'SM', gradient: 'from-pink-500 to-rose-500' },
    category: 'Coworking',
    replies: 9,
    likes: 14,
    timeAgo: '1d ago',
    pinned: false,
    tags: ['lisbon', 'coworking', 'budget'],
    replyList: [],
  },
  {
    id: 7,
    title: 'How to convince your employer to go fully remote?',
    content: 'I want to transition from hybrid to fully remote so I can travel while working. Has anyone successfully negotiated this? What arguments worked?',
    author: { name: 'Emma Lindqvist', initials: 'EL', gradient: 'from-rose-500 to-orange-500' },
    category: 'Remote Work',
    replies: 33,
    likes: 71,
    timeAgo: '2d ago',
    pinned: false,
    tags: ['remote-work', 'negotiation', 'career'],
    replyList: [
      { id: 701, content: 'Build trust first by being hyper-productive while hybrid. Then propose a 3-month trial period with clear KPIs. That is how I got mine approved.', author: { name: 'Alex Rivera', initials: 'AR', gradient: 'from-teal-500 to-emerald-500' }, likes: 18, timeAgo: '1d ago' },
    ],
  },
  {
    id: 8,
    title: 'Setting up a US LLC as a non-resident nomad',
    content: 'Has anyone set up a Wyoming or Delaware LLC while living abroad? Looking for the simplest process for invoicing international clients.',
    author: { name: 'Tom Bakker', initials: 'TB', gradient: 'from-blue-500 to-violet-500' },
    category: 'Legal',
    replies: 19,
    likes: 34,
    timeAgo: '2d ago',
    pinned: false,
    tags: ['LLC', 'us-business', 'legal'],
    replyList: [],
  },
  {
    id: 9,
    title: 'Bali in rainy season - is it worth it?',
    content: 'Thinking about spending November-February in Bali but worried about the rainy season. Anyone have experience? Does it rain all day or just brief showers?',
    author: { name: 'Priya Sharma', initials: 'PS', gradient: 'from-yellow-500 to-red-500' },
    category: 'Destinations',
    replies: 11,
    likes: 19,
    timeAgo: '3d ago',
    pinned: false,
    tags: ['bali', 'weather', 'rainy-season'],
    replyList: [],
  },
  {
    id: 10,
    title: 'Anyone else struggle with loneliness on the road?',
    content: 'I have been nomading for 6 months and while I love the freedom, I sometimes feel really isolated. How do you build meaningful connections while constantly moving?',
    author: { name: 'Liam Foster', initials: 'LF', gradient: 'from-orange-500 to-amber-500' },
    category: 'Social',
    replies: 42,
    likes: 89,
    timeAgo: '3d ago',
    pinned: false,
    tags: ['mental-health', 'loneliness', 'community'],
    replyList: [
      { id: 1001, content: 'Join local coworking communities and attend events. I found that staying 2-3 months in one place instead of constantly moving helps build deeper friendships.', author: { name: 'Aisha Patel', initials: 'AP', gradient: 'from-amber-500 to-red-500' }, likes: 32, timeAgo: '3d ago' },
    ],
  },
  {
    id: 11,
    title: 'Starlink mini review - works for nomads?',
    content: 'Thinking about getting Starlink Mini for areas with unreliable WiFi. Has anyone used it while traveling? How is the portability and performance?',
    author: { name: 'Oliver Schmidt', initials: 'OS', gradient: 'from-emerald-500 to-cyan-500' },
    category: 'Tech & Gear',
    replies: 7,
    likes: 16,
    timeAgo: '4d ago',
    pinned: false,
    tags: ['starlink', 'internet', 'gear'],
    replyList: [],
  },
  {
    id: 12,
    title: 'Best bank accounts for digital nomads in 2025',
    content: 'Looking for bank accounts with no foreign transaction fees, good exchange rates, and easy international transfers. Wise vs Revolut vs others?',
    author: { name: 'Diego Santos', initials: 'DS', gradient: 'from-green-500 to-teal-500' },
    category: 'Taxes & Finance',
    replies: 28,
    likes: 53,
    timeAgo: '5d ago',
    pinned: false,
    tags: ['banking', 'finance', 'wise', 'revolut'],
    replyList: [],
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   SERVICE FUNCTIONS
   ══════════════════════════════════════════════════════════════════════════ */

// ── Cities & Comparison ────────────────────────────────────────────────────

/**
 * Get all cities with scores and metrics.
 * Tries Supabase `cities` table first, falls back to static data.
 */
export async function getCities() {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name');
    if (error) throw error;
    if (data && data.length > 0) return data;
    return staticCities;
  } catch (err) {
    console.warn('[supabaseService] getCities fallback to static:', err.message || err);
    return staticCities;
  }
}

/**
 * Get a single city by id.
 */
export async function getCityById(id) {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    if (data) return data;
    return staticCities.find((c) => c.id === id) || null;
  } catch (err) {
    console.warn('[supabaseService] getCityById fallback to static:', err.message || err);
    return staticCities.find((c) => c.id === id) || null;
  }
}

/**
 * Compare two cities by id. Returns [city1, city2].
 */
export async function compareCities(id1, id2) {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .in('id', [id1, id2]);
    if (error) throw error;
    if (data && data.length === 2) {
      // Preserve order: city1 first, city2 second
      const city1 = data.find((c) => c.id === id1);
      const city2 = data.find((c) => c.id === id2);
      return [city1, city2];
    }
    throw new Error('Not enough cities returned');
  } catch (err) {
    console.warn('[supabaseService] compareCities fallback to static:', err.message || err);
    const city1 = staticCities.find((c) => c.id === id1);
    const city2 = staticCities.find((c) => c.id === id2);
    return [city1, city2];
  }
}

// ── Cost of Living ─────────────────────────────────────────────────────────

/**
 * Get cost-of-living data for a city.
 * Tries `cost_of_living` table first, falls back to static.
 */
export async function getCostOfLiving(cityId) {
  try {
    const { data, error } = await supabase
      .from('cost_of_living')
      .select('*')
      .eq('id', cityId)
      .single();
    if (error) throw error;
    if (data) return data;
    return staticCostData.find((c) => c.id === cityId) || null;
  } catch (err) {
    console.warn('[supabaseService] getCostOfLiving fallback to static:', err.message || err);
    return staticCostData.find((c) => c.id === cityId) || null;
  }
}

// ── Visa Info ──────────────────────────────────────────────────────────────

/**
 * Get all visa info records.
 */
export async function getVisaInfo() {
  try {
    const { data, error } = await supabase
      .from('visa_info')
      .select('*')
      .order('country');
    if (error) throw error;
    if (data && data.length > 0) return data;
    return staticVisaInfo;
  } catch (err) {
    console.warn('[supabaseService] getVisaInfo fallback to static:', err.message || err);
    return staticVisaInfo;
  }
}

/**
 * Get a user's visa stays.
 * Requires auth — falls back to static sample data.
 */
export async function getVisaStays(userId) {
  try {
    const { data, error } = await supabase
      .from('visa_stays')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('[supabaseService] getVisaStays fallback to static:', err.message || err);
    return staticVisaStays;
  }
}

/**
 * Add a visa stay record for a user.
 */
export async function addVisaStay(userId, stay) {
  try {
    const { data, error } = await supabase
      .from('visa_stays')
      .insert({ user_id: userId, ...stay })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[supabaseService] addVisaStay failed:', err.message || err);
    throw err;
  }
}

/**
 * Delete a visa stay record (only if the user owns it).
 */
export async function deleteVisaStay(stayId, userId) {
  try {
    const { error } = await supabase
      .from('visa_stays')
      .delete()
      .eq('id', stayId)
      .eq('user_id', userId);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('[supabaseService] deleteVisaStay failed:', err.message || err);
    throw err;
  }
}

// ── Trips ──────────────────────────────────────────────────────────────────

const TRIPS_STORAGE_KEY = 'roamiq-trip-tracker-data';

/**
 * Get user's trips ordered by arrival DESC.
 * Tries Supabase → localStorage → sample data.
 */
export async function getTrips(userId) {
  // 1. Try Supabase
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('arrival', { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) return data;
  } catch (err) {
    console.warn('[supabaseService] getTrips Supabase failed, trying localStorage:', err.message || err);
  }

  // 2. Try localStorage
  try {
    const stored = localStorage.getItem(TRIPS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // Ignore parse errors
  }

  // 3. Return sample data
  return staticTrips;
}

/**
 * Insert a new trip.
 */
export async function addTrip(userId, trip) {
  try {
    const { data, error } = await supabase
      .from('trips')
      .insert({ user_id: userId, ...trip })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[supabaseService] addTrip failed:', err.message || err);
    throw err;
  }
}

/**
 * Update an existing trip (only if the user owns it).
 */
export async function updateTrip(tripId, userId, updates) {
  try {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', tripId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[supabaseService] updateTrip failed:', err.message || err);
    throw err;
  }
}

/**
 * Delete a trip (only if the user owns it).
 */
export async function deleteTrip(tripId, userId) {
  try {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId)
      .eq('user_id', userId);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('[supabaseService] deleteTrip failed:', err.message || err);
    throw err;
  }
}

// ── Nomad Profiles ────────────────────────────────────────────────────────

/**
 * Get nomad profiles with optional filters: { city, workType, status }.
 * Falls back to static data.
 */
export async function getNomadProfiles(filters = {}) {
  try {
    let query = supabase
      .from('nomad_profiles')
      .select('*');

    if (filters.city) query = query.eq('city', filters.city);
    if (filters.workType) query = query.eq('work_type', filters.workType);
    if (filters.status) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (error) throw error;
    if (data && data.length > 0) return data;
    // If Supabase returned empty, fall back to static
  } catch (err) {
    console.warn('[supabaseService] getNomadProfiles fallback to static:', err.message || err);
  }

  // Filter static data
  let results = [...staticNomadProfiles];
  if (filters.city) results = results.filter((n) => n.city === filters.city);
  if (filters.workType) results = results.filter((n) => n.workType === filters.workType);
  if (filters.status) results = results.filter((n) => n.status === filters.status);
  return results;
}

/**
 * Get meetups, optionally filtered by city.
 * Falls back to static data.
 */
export async function getMeetups(city) {
  try {
    let query = supabase
      .from('meetups')
      .select('*')
      .order('date', { ascending: true });

    if (city) query = query.eq('city', city);

    const { data, error } = await query;
    if (error) throw error;
    if (data && data.length > 0) return data;
  } catch (err) {
    console.warn('[supabaseService] getMeetups fallback to static:', err.message || err);
  }

  if (city) return staticMeetups.filter((m) => m.city === city);
  return staticMeetups;
}

// ── Forum ──────────────────────────────────────────────────────────────────

/**
 * Get forum posts with optional category filter and sort.
 * Sort options: 'latest' | 'popular' | 'replies' | 'unanswered'
 * Falls back to static data.
 */
export async function getForumPosts(category, sort = 'latest') {
  try {
    let query = supabase
      .from('forum_posts')
      .select('*');

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    // Apply sort
    switch (sort) {
      case 'popular':
        query = query.order('likes', { ascending: false });
        break;
      case 'replies':
        query = query.order('reply_count', { ascending: false });
        break;
      case 'unanswered':
        query = query.eq('reply_count', 0).order('created_at', { ascending: false });
        break;
      case 'latest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    const { data, error } = await query;
    if (error) throw error;
    if (data && data.length > 0) return data;
  } catch (err) {
    console.warn('[supabaseService] getForumPosts fallback to static:', err.message || err);
  }

  // Filter & sort static data
  let results = [...staticForumPosts];
  if (category && category !== 'All') {
    results = results.filter((p) => p.category === category);
  }

  switch (sort) {
    case 'popular':
      results.sort((a, b) => b.likes - a.likes);
      break;
    case 'replies':
      results.sort((a, b) => b.replies - a.replies);
      break;
    case 'unanswered':
      results = results.filter((p) => p.replies === 0);
      break;
    case 'latest':
    default:
      // Static data is already in latest-first order
      break;
  }

  return results;
}

/**
 * Get replies for a specific forum post.
 */
export async function getForumReplies(postId) {
  try {
    const { data, error } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    if (data) return data;
  } catch (err) {
    console.warn('[supabaseService] getForumReplies fallback to static:', err.message || err);
  }

  // Fallback: find the post in static data and return its replyList
  const post = staticForumPosts.find((p) => p.id === postId);
  return post?.replyList || [];
}

/**
 * Create a new forum post.
 */
export async function createPost(userId, post) {
  try {
    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        user_id: userId,
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags,
        reply_count: 0,
        likes: 0,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[supabaseService] createPost failed:', err.message || err);
    throw err;
  }
}

/**
 * Create a reply to a forum post. Also increments the post's reply_count.
 */
export async function createReply(userId, postId, content) {
  try {
    // Insert the reply
    const { data, error } = await supabase
      .from('forum_replies')
      .insert({
        user_id: userId,
        post_id: postId,
        content,
      })
      .select()
      .single();
    if (error) throw error;

    // Increment reply_count on the post
    const { error: rpcError } = await supabase.rpc('increment_reply_count', {
      post_id: postId,
    });
    if (rpcError) {
      // Fallback: manual increment
      const { data: postData } = await supabase
        .from('forum_posts')
        .select('reply_count')
        .eq('id', postId)
        .single();
      if (postData) {
        await supabase
          .from('forum_posts')
          .update({ reply_count: (postData.reply_count || 0) + 1 })
          .eq('id', postId);
      }
    }

    return data;
  } catch (err) {
    console.error('[supabaseService] createReply failed:', err.message || err);
    throw err;
  }
}

/**
 * Toggle a like on a post. If the user already liked it, remove the like;
 * otherwise add a like and increment the post's like count.
 */
export async function toggleLike(userId, postId) {
  try {
    // Check if user already liked
    const { data: existing, error: checkError } = await supabase
      .from('post_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existing) {
      // Unlike: remove the like row and decrement count
      await supabase.from('post_likes').delete().eq('id', existing.id);

      const { data: postData } = await supabase
        .from('forum_posts')
        .select('likes')
        .eq('id', postId)
        .single();
      if (postData) {
        await supabase
          .from('forum_posts')
          .update({ likes: Math.max(0, (postData.likes || 1) - 1) })
          .eq('id', postId);
      }

      return { liked: false };
    } else {
      // Like: insert a like row and increment count
      await supabase.from('post_likes').insert({ user_id: userId, post_id: postId });

      const { data: postData } = await supabase
        .from('forum_posts')
        .select('likes')
        .eq('id', postId)
        .single();
      if (postData) {
        await supabase
          .from('forum_posts')
          .update({ likes: (postData.likes || 0) + 1 })
          .eq('id', postId);
      }

      return { liked: true };
    }
  } catch (err) {
    console.error('[supabaseService] toggleLike failed:', err.message || err);
    throw err;
  }
}

// ── Auth Helpers ───────────────────────────────────────────────────────────

/**
 * Sign up with email + password + name.
 * Creates auth user and inserts a nomad_profile row.
 */
export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  if (error) throw error;

  // Create nomad profile
  if (data.user) {
    try {
      await supabase.from('nomad_profiles').insert({
        user_id: data.user.id,
        name,
        avatar_gradient: 'from-cyan-500 to-blue-500',
        status: 'open',
      });
    } catch (profileErr) {
      console.warn('[supabaseService] Profile creation failed (table may not exist):', profileErr.message || profileErr);
    }
  }

  return data;
}

/**
 * Sign in with email + password.
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get the current session.
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Get the nomad profile for a user.
 */
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('nomad_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('[supabaseService] getUserProfile failed:', err.message || err);
    return null;
  }
}

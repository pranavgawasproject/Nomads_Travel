-- =============================================
-- RoamIQ Seed Data
-- Run this in Supabase SQL Editor AFTER the schema
-- =============================================

-- Temporarily disable RLS for seeding
ALTER TABLE cities DISABLE ROW LEVEL SECURITY;
ALTER TABLE cost_of_living DISABLE ROW LEVEL SECURITY;
ALTER TABLE visa_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE meetups DISABLE ROW LEVEL SECURITY;

-- ── Cities ──
INSERT INTO cities (id, name, country, flag, image, continent, overall_score, cost_score, internet_score, safety_score, fun_score, walkability_score, nightlife_score, air_score, cost_usd, internet_mbps, avg_temp, visa_difficulty, air_quality) VALUES
('bangkok', 'Bangkok', 'Thailand', '🇹🇭', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', 'Asia', 4.2, 3.8, 3.5, 3.2, 4.8, 3.0, 4.7, 2.8, 950, 45, 28, 'Easy', 'Moderate'),
('lisbon', 'Lisbon', 'Portugal', '🇵🇹', 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800', 'Europe', 4.5, 3.2, 4.0, 4.2, 4.3, 4.0, 4.0, 4.2, 2200, 85, 18, 'Medium', 'Good'),
('bali', 'Bali', 'Indonesia', '🇮🇩', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 'Asia', 4.0, 4.2, 2.8, 3.5, 4.5, 2.5, 3.8, 3.0, 1100, 25, 27, 'Easy', 'Moderate'),
('medellin', 'Medellín', 'Colombia', '🇨🇴', 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800', 'South America', 3.9, 4.0, 3.2, 2.8, 4.5, 3.5, 4.5, 3.5, 1200, 35, 22, 'Easy', 'Moderate'),
('berlin', 'Berlin', 'Germany', '🇩🇪', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800', 'Europe', 4.3, 2.5, 4.5, 4.0, 4.2, 4.5, 4.8, 3.8, 2800, 100, 10, 'Hard', 'Good'),
('tokyo', 'Tokyo', 'Japan', '🇯🇵', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 'Asia', 4.4, 2.0, 4.8, 4.8, 4.5, 4.8, 4.2, 3.5, 3200, 150, 16, 'Medium', 'Moderate'),
('chiangmai', 'Chiang Mai', 'Thailand', '🇹🇭', 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', 'Asia', 4.1, 4.5, 3.2, 3.5, 3.8, 2.8, 3.5, 2.5, 750, 30, 26, 'Easy', 'Poor'),
('barcelona', 'Barcelona', 'Spain', '🇪🇸', 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', 'Europe', 4.3, 2.8, 4.0, 3.8, 4.7, 4.5, 4.5, 4.0, 2500, 80, 17, 'Medium', 'Good'),
('mexicocity', 'Mexico City', 'Mexico', '🇲🇽', 'https://images.unsplash.com/photo-1516482362041-8b87b69ed28d?w=800', 'North America', 3.7, 3.8, 3.0, 2.5, 4.3, 3.2, 4.5, 2.2, 1300, 28, 17, 'Easy', 'Poor'),
('budapest', 'Budapest', 'Hungary', '🇭🇺', 'https://images.unsplash.com/photo-1551867633-194f125bddfa?w=800', 'Europe', 4.2, 3.5, 4.2, 4.0, 4.0, 4.0, 4.3, 3.5, 1600, 90, 12, 'Medium', 'Moderate'),
('dubai', 'Dubai', 'UAE', '🇦🇪', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 'Asia', 3.8, 1.8, 4.5, 4.8, 3.8, 2.5, 3.5, 2.0, 3500, 120, 33, 'Easy', 'Poor'),
('tbilisi', 'Tbilisi', 'Georgia', '🇬🇪', 'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=800', 'Europe', 3.9, 4.5, 3.0, 4.0, 3.5, 3.5, 3.8, 3.8, 900, 25, 15, 'Easy', 'Good');

-- ── Cost of Living ──
INSERT INTO cost_of_living (city_id, housing, coworking, food, transport, internet, entertainment, health, visa, misc, tip1, tip2, tip3) VALUES
('bangkok', 450, 120, 300, 50, 25, 100, 80, 30, 95, 'Eat at local street food stalls to save 60% on food', 'Use Grab moto-taxi instead of regular taxis', 'Stay in Ari or Ekkamai for cheaper rent with great vibes'),
('lisbon', 950, 180, 450, 45, 35, 150, 120, 50, 220, 'Live in Almada for half the rent with river views', 'Get a NHR tax regime for potential tax savings', 'Use the monthly metro pass for unlimited transport'),
('bali', 500, 150, 250, 80, 30, 120, 60, 50, 60, 'Rent a villa in Canggu long-term for best value', 'Use GoJek for affordable transport and food delivery', 'Get a social visa (B211A) for 6-month stays'),
('medellin', 550, 130, 280, 40, 25, 100, 70, 40, 65, 'Stay in Laureles instead of Poblado for cheaper rent', 'Use the Metro system - it is clean and affordable', 'Eat at corrientazo restaurants for $2-3 meals'),
('berlin', 1100, 200, 500, 86, 35, 200, 200, 80, 399, 'Apply for the freelance visa for long-term stays', 'Shop at Lidl or Aldi for affordable groceries', 'Use the BVG monthly ticket for all public transport'),
('tokyo', 1200, 200, 500, 80, 40, 200, 150, 60, 270, 'Live in share houses for affordable social living', 'Eat at conveyor belt sushi and ramen shops', 'Get a JR Pass for affordable train travel'),
('barcelona', 1050, 170, 420, 50, 35, 180, 130, 60, 205, 'Consider Gràcia or Poblenou for better value', 'Use the T-Casual card for discounted metro rides', 'Eat menú del día for affordable lunch deals'),
('budapest', 600, 150, 300, 35, 20, 120, 90, 50, 135, 'Live in District 8 or 9 for affordable central living', 'Eat at étkezdekek (local canteens) for cheap meals', 'Use Bubi bike sharing for daily commuting'),
('dubai', 1500, 250, 600, 100, 80, 300, 250, 100, 320, 'Consider Sharjah for much cheaper rent nearby', 'Use the metro and avoid taxis during peak hours', 'Look for happy hour deals at upscale restaurants'),
('chiangmai', 300, 100, 200, 30, 20, 80, 50, 30, 40, 'Nimman area has the best coworking and cafe scene', 'Rent a scooter for affordable daily transport', 'Eat at university area food courts for 40 baht meals');

-- ── Visa Info ──
INSERT INTO visa_info (country, flag, tourist_days, has_dn_visa, dn_visa_cost, dn_visa_duration) VALUES
('Thailand', '🇹🇭', 60, true, '$500', '6 months'),
('Portugal', '🇵🇹', 90, true, '€180', '1 year'),
('Indonesia', '🇮🇩', 30, true, '$300', '6 months'),
('Spain', '🇪🇸', 90, true, '€70', '1 year'),
('Germany', '🇩🇪', 90, true, '€100', '1-3 years'),
('Colombia', '🇨🇴', 90, true, '$170', '2 years'),
('Georgia', '🇬🇪', 365, false, 'N/A', 'N/A'),
('Croatia', '🇭🇷', 90, true, '€80', '1 year'),
('Estonia', '🇪🇪', 90, true, '€100', '1 year'),
('UAE', '🇦🇪', 30, true, '$287', '1 year'),
('Mexico', '🇲🇽', 180, false, 'N/A', 'N/A'),
('Brazil', '🇧🇷', 90, true, 'R$168', '1 year');

-- ── Meetups ──
INSERT INTO meetups (id, title, type, date, time, city, location, attendees, max_attendees, icon) VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'Bangkok Coworking Friday', 'Coworking Session', 'Jun 14, 2025', '9:00 AM', 'Bangkok', 'The Hive Thonglor', 12, 20, '💻'),
('a1b2c3d4-0002-4000-8000-000000000002', 'Lisbon Digital Nomads Meetup', 'Networking Event', 'Jun 15, 2025', '6:00 PM', 'Lisbon', 'Second Home Lisbon', 28, 40, '🤝'),
('a1b2c3d4-0003-4000-8000-000000000003', 'Bali Sunset Surf Session', 'Hiking Group', 'Jun 16, 2025', '4:00 PM', 'Bali', 'Echo Beach, Canggu', 8, 15, '🏄'),
('a1b2c3d4-0004-4000-8000-000000000004', 'Berlin Coffee & Code', 'Coffee Meetup', 'Jun 17, 2025', '10:00 AM', 'Berlin', 'Betahaus Café', 6, 12, '☕'),
('a1b2c3d4-0005-4000-8000-000000000005', 'Medellín Workshop: Remote Taxes', 'Workshop', 'Jun 18, 2025', '2:00 PM', 'Medellín', 'Selina Co-work', 15, 25, '📚'),
('a1b2c3d4-0006-4000-8000-000000000006', 'Budapest Nomad Walking Tour', 'Networking Event', 'Jun 19, 2025', '11:00 AM', 'Budapest', 'Deák Ferenc tér', 10, 20, '🚶');

-- ── Re-enable RLS ──
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_of_living ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetups ENABLE ROW LEVEL SECURITY;

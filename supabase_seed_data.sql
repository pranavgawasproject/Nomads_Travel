-- =============================================
-- RoamIQ Seed Data
-- Run this in Supabase SQL Editor AFTER the schema
-- =============================================

-- Temporarily disable RLS for seeding
ALTER TABLE cities DISABLE ROW LEVEL SECURITY;
ALTER TABLE cost_of_living DISABLE ROW LEVEL SECURITY;
ALTER TABLE visa_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE meetups DISABLE ROW LEVEL SECURITY;
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;

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
('tbilisi', 'Tbilisi', 'Georgia', '🇬🇪', 'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=800', 'Europe', 3.9, 4.5, 3.0, 4.0, 3.5, 3.5, 3.8, 3.8, 900, 25, 15, 'Easy', 'Good'),
('da-nang', 'Da Nang', 'Vietnam', '🇻🇳', 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800', 'Asia', 4.3, 4.6, 3.8, 4.1, 4.0, 3.2, 3.5, 4.0, 800, 65, 26, 'Easy', 'Good'),
('buenos-aires', 'Buenos Aires', 'Argentina', '🇦🇷', 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800', 'South America', 4.1, 4.4, 3.5, 3.2, 4.7, 4.2, 4.6, 3.8, 1000, 40, 18, 'Easy', 'Good'),
('cape-town', 'Cape Town', 'South Africa', '🇿🇦', 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800', 'Africa', 4.2, 3.6, 3.6, 3.0, 4.8, 3.2, 4.2, 4.5, 1400, 50, 17, 'Medium', 'Good'),
('valencia', 'Valencia', 'Spain', '🇪🇸', 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800', 'Europe', 4.4, 3.5, 4.2, 4.4, 4.3, 4.6, 4.1, 4.3, 1900, 90, 19, 'Medium', 'Good'),
('tallinn', 'Tallinn', 'Estonia', '🇪🇪', 'https://images.unsplash.com/photo-15417971875076-8f970d573be6?w=800', 'Europe', 4.3, 3.3, 4.7, 4.6, 3.7, 4.1, 3.6, 4.5, 1800, 110, 7, 'Easy', 'Good'),
('prague', 'Prague', 'Czech Republic', '🇨🇿', 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800', 'Europe', 4.3, 3.4, 4.2, 4.5, 4.4, 4.7, 4.5, 3.9, 1700, 85, 11, 'Medium', 'Good'),
('taipei', 'Taipei', 'Taiwan', '🇹🇼', 'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800', 'Asia', 4.4, 3.5, 4.8, 4.9, 4.2, 4.6, 4.0, 3.8, 1600, 120, 23, 'Medium', 'Good'),
('kuala-lumpur', 'Kuala Lumpur', 'Malaysia', '🇲🇾', 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800', 'Asia', 4.1, 4.2, 4.0, 3.9, 4.1, 3.0, 4.0, 3.2, 1100, 75, 28, 'Easy', 'Moderate');

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
('chiangmai', 300, 100, 200, 30, 20, 80, 50, 30, 40, 'Nimman area has the best coworking and cafe scene', 'Rent a scooter for affordable daily transport', 'Eat at university area food courts for 40 baht meals'),
('da-nang', 350, 90, 220, 30, 20, 90, 45, 25, 60, 'Rent an apartment near An Thuong beach', 'Use Grab or rent a scooter for $45/mo', 'Enjoy fresh seafood at local beachside canteens'),
('buenos-aires', 450, 110, 250, 25, 20, 110, 60, 30, 70, 'Palermo and Recoleta offer great walkable coworking', 'Use Subte metro for fast budget transport', 'Take advantage of local currency exchanges'),
('cape-town', 650, 140, 320, 60, 30, 150, 80, 40, 110, 'Kloof Street & Sea Point have fast fiber coworking', 'Use MyCiTi bus or Uber for safe commuting', 'Shop at local farmers markets on weekends'),
('valencia', 850, 160, 380, 40, 30, 160, 110, 50, 120, 'Russafa neighborhood has high density coworking', 'Use Valenbisi bicycle sharing system', 'Eat lunch set menus (menú del día) for $12'),
('tallinn', 800, 170, 370, 35, 25, 140, 100, 40, 120, 'Rotermann Quarter features top tech workspace hubs', 'Public transport is free for registered residents', 'Explore e-Residency digital business tools'),
('prague', 750, 160, 360, 30, 25, 150, 95, 40, 110, 'Vinohrady and Karlín offer great digital nomad cafes', 'Buy a monthly PID transit pass for $25', 'Enjoy affordable lunch specials at local hospoda'),
('taipei', 700, 150, 320, 35, 25, 140, 80, 30, 120, 'Da-an and Xinyi have world-class 24/7 cafes', 'Use YouBike and EasyCard for MRT travel', 'Eat at night markets for under $5 per meal'),
('kuala-lumpur', 480, 120, 260, 35, 25, 110, 60, 30, 80, 'KLCC & Bangsar offer modern air-conditioned hubs', 'Use the free GoKL bus lines across downtown', 'Food courts in Megamalls offer great cheap eats');

-- ── Visa Info ──
INSERT INTO visa_info (country, flag, tourist_days, has_dn_visa, dn_visa_cost, dn_visa_duration, min_income, tax_residency_days, tax_notes) VALUES
('Thailand', '🇹🇭', 60, true, '$500', '6 months', '$2,000/mo', 180, 'DTV visa allows 180-day stays renewable for 5 years'),
('Portugal', '🇵🇹', 90, true, '€180', '1 year', '€3,280/mo', 183, 'D8 visa with pathway to temporary residency'),
('Indonesia', '🇮🇩', 30, true, '$300', '6 months', '$2,000/mo', 183, 'E33G Remote Worker Visa or B211A social visa'),
('Spain', '🇪🇸', 90, true, '€70', '1 year', '€2,646/mo', 183, 'Digital Nomad Visa with 15% flat Beckham tax regime'),
('Germany', '🇩🇪', 90, true, '€100', '1-3 years', 'Proof of funds', 183, 'Freiberufler freelance visa available'),
('Colombia', '🇨🇴', 90, true, '$170', '2 years', '$1,500/mo', 183, 'V Digital Nomad Visa valid up to 2 years'),
('Georgia', '🇬🇪', 365, false, 'N/A', 'N/A', 'N/A', 183, '365-day visa free stay for 95+ nationalities'),
('Croatia', '🇭🇷', 90, true, '€80', '1 year', '€2,539/mo', 183, 'Exempt from local income tax during visa stay'),
('Estonia', '🇪🇪', 90, true, '€100', '1 year', '€3,500/mo', 183, 'Digital Nomad Visa C & D options available'),
('UAE', '🇦🇪', 30, true, '$287', '1 year', '$3,500/mo', 183, '0% personal income tax on foreign income'),
('Mexico', '🇲🇽', 180, false, 'N/A', 'N/A', 'N/A', 183, '180-day tourist visa on arrival for many passports'),
('Brazil', '🇧🇷', 90, true, 'R$168', '1 year', '$1,500/mo', 183, '1-year renewable digital nomad residency'),
('Vietnam', '🇻🇳', 90, false, 'N/A', 'N/A', 'N/A', 183, '90-day e-visa available for all nationalities'),
('Argentina', '🇦🇷', 90, true, '$200', '180 days', 'Proof of income', 183, 'Rentista and Digital Nomad visa options'),
('South Africa', '🇿🇦', 90, true, 'R1,000', '1 year', 'R1,000,000/yr', 183, 'Remote Work Visa newly launched for global remote workers'),
('Czech Republic', '🇨🇿', 90, true, 'CZK 2,500', '1 year', 'CZK 60,000/mo', 183, 'Zivno business license visa for freelancers'),
('Taiwan', '🇹🇼', 90, true, '$100', '1-3 years', '$5,700/mo', 183, 'Employment Gold Card multi-year visa'),
('Malaysia', '🇲🇾', 90, true, 'RM 1,000', '1-2 years', '$24,000/yr', 183, 'DE Rantau Nomad Pass for digital professionals'),
('Japan', '🇯🇵', 90, true, '¥159', '6 months', '¥10,000,000/yr', 183, 'Must provide private health insurance and proof of remote employment'),
('Hungary', '🇭🇺', 90, true, '€110', '1 year', '€3,000/mo', 183, 'White Card digital nomad visa; exempt from Hungarian income tax for 6 months'),
('Italy', '🇮🇹', 90, true, '€116', '1 year', '€28,000/yr', 183, 'Digital nomad visa for highly skilled remote professionals'),
('Greece', '🇬🇷', 90, true, '€75', '1 year', '€3,500/mo', 183, '50% income tax reduction for 7 years if tax residency transferred'),
('Costa Rica', '🇨🇷', 180, true, '$100', '1 year', '$3,000/mo', 183, 'Exempt from local income tax on foreign income'),
('Malta', '🇲🇹', 90, true, '€300', '1 year', '€42,000/yr', 183, 'Nomad Residence Permit for non-EU remote workers'),
('Mauritius', '🇲🇺', 180, true, 'Free', '1 year', '$1,500/mo', 183, 'Premium Visa free of charge with online application');

-- ── Meetups ──
INSERT INTO meetups (id, title, type, date, time, city, location, attendees, max_attendees, icon) VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'Bangkok Coworking Friday', 'Coworking Session', 'Jun 14, 2025', '9:00 AM', 'Bangkok', 'The Hive Thonglor', 12, 20, '💻'),
('a1b2c3d4-0002-4000-8000-000000000002', 'Lisbon Digital Nomads Meetup', 'Networking Event', 'Jun 15, 2025', '6:00 PM', 'Lisbon', 'Second Home Lisbon', 28, 40, '🤝'),
('a1b2c3d4-0003-4000-8000-000000000003', 'Bali Sunset Surf Session', 'Hiking Group', 'Jun 16, 2025', '4:00 PM', 'Bali', 'Echo Beach, Canggu', 8, 15, '🏄'),
('a1b2c3d4-0004-4000-8000-000000000004', 'Berlin Coffee & Code', 'Coffee Meetup', 'Jun 17, 2025', '10:00 AM', 'Berlin', 'Betahaus Café', 6, 12, '☕'),
('a1b2c3d4-0005-4000-8000-000000000005', 'Medellín Workshop: Remote Taxes', 'Workshop', 'Jun 18, 2025', '2:00 PM', 'Medellín', 'Selina Co-work', 15, 25, '📚'),
('a1b2c3d4-0006-4000-8000-000000000006', 'Budapest Nomad Walking Tour', 'Networking Event', 'Jun 19, 2025', '11:00 AM', 'Budapest', 'Deák Ferenc tér', 10, 20, '🚶');

-- ── Listings ──
INSERT INTO listings (id, business_id, company_name, company_title, company_type, address, city, state, country, continent, wifi_speed, starting_price, ratings, total_reviews, is_public, is_active, about, inclusions) VALUES
('b1b2c3d4-0001-4000-8000-000000000001', 'the-hive-thonglor', 'The Hive Thonglor', 'The Hive Thonglor — Boutique Coworking in Bangkok', 'coworking', '46/9 Soi Sukhumvit 49, Khwaeng Khlong Tan Nuea, Watthana', 'Bangkok', 'Bangkok', 'Thailand', 'Asia', '250 Mbps', '$150/mo', 4.8, 42, true, true, 'Multi-story workspace with rooftop cafe, fast fiber Wi-Fi, ergonomically designed desks, and thriving international community.', '24/7 Access, High-Speed Fiber Internet, Free Coffee & Tea, Meeting Rooms'),
('b1b2c3d4-0002-4000-8000-000000000002', 'second-home-lisbon', 'Second Home Lisboa', 'Second Home Lisboa — Plant-filled Coworking Hub', 'coworking', 'Mercado da Ribeira, Av. 24 de Julho 1st floor', 'Lisbon', 'Lisbon', 'Portugal', 'Europe', '300 Mbps', '€235/mo', 4.9, 88, true, true, 'Surrounded by over 1,000 plants inside the iconic Mercado da Ribeira. Premier Lisbon workspace with weekly cultural events.', 'Ergonomic Seating, 300 Mbps Fiber, Weekly Community Drinks, Phone Booths'),
('b1b2c3d4-0003-4000-8000-000000000003', 'hub53-canggu', 'Hub53 Canggu', 'Hub53 Canggu — Coliving & Coworking Oasis', 'coliving', 'Jl. Pantai Batu Bolong No. 53', 'Bali', 'Bali', 'Indonesia', 'Asia', '150 Mbps', '$650/mo', 4.7, 35, true, true, 'Tropical coliving house featuring private en-suite rooms, swimming pool, high-speed dedicated line, and daily community breakfasts.', 'Private Room, Pool Access, 150 Mbps Wi-Fi, Scooter Rental Assistance'),
('b1b2c3d4-0004-4000-8000-000000000004', 'betahaus-berlin', 'Betahaus Berlin', 'Betahaus Berlin — Pioneer Nomad Workspace', 'coworking', 'Rudi-Dutschke-Straße 26', 'Berlin', 'Berlin', 'Germany', 'Europe', '500 Mbps', '€200/mo', 4.6, 110, true, true, 'One of Europe’s original coworking spaces located in Kreuzberg, offering maker spaces, event venues, and top-tier fiber speeds.', '500 Mbps Fiber Internet, Cafe, Event Hall, Hardware Lab');

-- ── Re-enable RLS ──
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_of_living ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

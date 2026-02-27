-- Seed Data for NRX Diamond Store

-- Insert Games
INSERT INTO games (id, name, slug, description, image_url, category, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Free Fire', 'free-fire', 'Garena Free Fire - Battle Royale Game', 'https://i.imgur.com/freefire.jpg', 'standard', true),
('550e8400-e29b-41d4-a716-446655440002', 'PUBG Mobile', 'pubg-mobile', 'PUBG Mobile - Battle Royale', 'https://i.imgur.com/pubg.jpg', 'premium', true),
('550e8400-e29b-41d4-a716-446655440003', 'Mobile Legends', 'mobile-legends', 'Mobile Legends Bang Bang', 'https://i.imgur.com/ml.jpg', 'standard', true),
('550e8400-e29b-41d4-a716-446655440004', 'Call of Duty Mobile', 'cod-mobile', 'Call of Duty Mobile', 'https://i.imgur.com/cod.jpg', 'premium', true)
ON CONFLICT (id) DO NOTHING;

-- Insert Top-up Packages for Free Fire
INSERT INTO topup_packages (id, game_id, name, description, price, original_price, currency, stock, is_featured, is_active) VALUES
-- Budget Packs
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '100 Diamonds', '100 Free Fire Diamonds - Instant Delivery', 99.00, 120.00, 'BDT', 1000, false, true),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '210 Diamonds', '210 Free Fire Diamonds + 21 Bonus', 199.00, 240.00, 'BDT', 1000, true, true),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '310 Diamonds', '310 Free Fire Diamonds + 31 Bonus', 299.00, 360.00, 'BDT', 1000, false, true),

-- Standard Packs (Popular)
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '520 Diamonds', '520 Free Fire Diamonds + 52 Bonus', 499.00, 600.00, 'BDT', 1000, true, true),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '1060 Diamonds', '1060 Free Fire Diamonds + 106 Bonus', 999.00, 1200.00, 'BDT', 1000, true, true),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', '2180 Diamonds', '2180 Free Fire Diamonds + 218 Bonus', 1999.00, 2400.00, 'BDT', 1000, false, true),

-- Premium Packs (Big)
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', '5600 Diamonds', '5600 Free Fire Diamonds + 560 Bonus', 4999.00, 6000.00, 'BDT', 500, true, true),
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', '11200 Diamonds', '11200 Free Fire Diamonds + 1120 Bonus', 9999.00, 12000.00, 'BDT', 500, false, true),

-- Membership
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440001', 'Weekly Membership', 'Weekly Membership - 7 Days Benefits', 149.00, 200.00, 'BDT', 1000, false, true),
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Monthly Membership', 'Monthly Membership - 30 Days Benefits', 499.00, 600.00, 'BDT', 1000, true, true)

ON CONFLICT (id) DO NOTHING;

-- Insert Top-up Packages for PUBG Mobile
INSERT INTO topup_packages (id, game_id, name, description, price, original_price, currency, stock, is_featured, is_active) VALUES
('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', '60 UC', '60 PUBG Mobile UC - Instant', 99.00, 120.00, 'BDT', 1000, false, true),
('650e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', '325 UC', '325 PUBG Mobile UC + Bonus', 499.00, 600.00, 'BDT', 1000, true, true),
('650e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440002', '660 UC', '660 PUBG Mobile UC + Bonus', 999.00, 1200.00, 'BDT', 1000, true, true),
('650e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440002', '1800 UC', '1800 PUBG Mobile UC + Bonus', 2499.00, 3000.00, 'BDT', 500, false, true),
('650e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440002', '3850 UC', '3850 PUBG Mobile UC + Bonus', 4999.00, 6000.00, 'BDT', 500, true, true)

ON CONFLICT (id) DO NOTHING;

-- Insert Top-up Packages for Mobile Legends
INSERT INTO topup_packages (id, game_id, name, description, price, original_price, currency, stock, is_featured, is_active) VALUES
('650e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440003', '86 Diamonds', '86 Mobile Legends Diamonds', 99.00, 120.00, 'BDT', 1000, false, true),
('650e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440003', '172 Diamonds', '172 Mobile Legends Diamonds + Bonus', 199.00, 240.00, 'BDT', 1000, false, true),
('650e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440003', '429 Diamonds', '429 Mobile Legends Diamonds + Bonus', 499.00, 600.00, 'BDT', 1000, true, true),
('650e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440003', '878 Diamonds', '878 Mobile Legends Diamonds + Bonus', 999.00, 1200.00, 'BDT', 1000, true, true),
('650e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440003', '2195 Diamonds', '2195 Mobile Legends Diamonds + Bonus', 2499.00, 3000.00, 'BDT', 500, false, true)

ON CONFLICT (id) DO NOTHING;

-- Create admin user (you need to create this user in Supabase Auth first)
-- Then update their metadata with this SQL:
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'gunjonarka@gmail.com';

-- Insert sample orders (optional - for testing)
-- Note: Replace user_id with actual user IDs from auth.users table
-- INSERT INTO orders (user_id, product_id, quantity, unit_price, total_amount, status, player_id, player_name, contact_email)
-- VALUES 
-- ('user-uuid-here', '650e8400-e29b-41d4-a716-446655440001', 1, 99.00, 99.00, 'completed', '123456789', 'Test Player', 'test@example.com');

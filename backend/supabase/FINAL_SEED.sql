-- ============================================
-- NRX DIAMOND STORE - FINAL SEED DATA
-- ============================================
-- Version: 3.0 FINAL
-- Date: 2026-02-23
-- Description: Complete sample data for testing
-- ============================================

-- ============================================
-- GAMES DATA
-- ============================================

INSERT INTO games (id, name, name_bn, slug, description, description_bn, image_url, banner_url, category, is_active, is_featured, sort_order) VALUES

-- Free Fire
('550e8400-e29b-41d4-a716-446655440001', 
 'Free Fire', 
 'ফ্রি ফায়ার',
 'free-fire', 
 'Garena Free Fire - The most popular battle royale game in Bangladesh. Get diamonds instantly and unlock exclusive items, characters, and skins.',
 'গারেনা ফ্রি ফায়ার - বাংলাদেশের সবচেয়ে জনপ্রিয় ব্যাটেল রয়্যাল গেম। তাৎক্ষণিক ডায়মন্ড পান এবং এক্সক্লুসিভ আইটেম, ক্যারেক্টার এবং স্কিন আনলক করুন।',
 'https://i.ibb.co/placeholder/freefire.jpg',
 'https://i.ibb.co/placeholder/freefire-banner.jpg',
 'standard', 
 true, 
 true, 
 1),

-- PUBG Mobile
('550e8400-e29b-41d4-a716-446655440002', 
 'PUBG Mobile', 
 'পাবজি মোবাইল',
 'pubg-mobile', 
 'PUBG Mobile - Experience the thrill of battle royale. Get UC instantly for Royal Pass, skins, and exclusive items.',
 'পাবজি মোবাইল - ব্যাটেল রয়্যালের রোমাঞ্চ অনুভব করুন। রয়্যাল পাস, স্কিন এবং এক্সক্লুসিভ আইটেমের জন্য তাৎক্ষণিক UC পান।',
 'https://i.ibb.co/placeholder/pubg.jpg',
 'https://i.ibb.co/placeholder/pubg-banner.jpg',
 'standard', 
 true, 
 true, 
 2),

-- Mobile Legends
('550e8400-e29b-41d4-a716-446655440003', 
 'Mobile Legends', 
 'মোবাইল লিজেন্ডস',
 'mobile-legends', 
 'Mobile Legends: Bang Bang - The ultimate MOBA experience. Get diamonds for heroes, skins, and battle passes.',
 'মোবাইল লিজেন্ডস: ব্যাং ব্যাং - চূড়ান্ত MOBA অভিজ্ঞতা। হিরো, স্কিন এবং ব্যাটেল পাসের জন্য ডায়মন্ড পান।',
 'https://i.ibb.co/placeholder/ml.jpg',
 'https://i.ibb.co/placeholder/ml-banner.jpg',
 'standard', 
 true, 
 true, 
 3)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    name_bn = EXCLUDED.name_bn,
    description = EXCLUDED.description,
    description_bn = EXCLUDED.description_bn,
    updated_at = NOW();

-- ============================================
-- TOPUP PACKAGES - FREE FIRE
-- ============================================

INSERT INTO topup_packages (id, game_id, name, name_bn, description, description_bn, price, original_price, currency, diamonds, image_url, stock, is_featured, is_active, badge, sort_order, rating) VALUES

-- Budget Packs
('650e8400-e29b-41d4-a716-446655440001', 
 '550e8400-e29b-41d4-a716-446655440001',
 '100 Diamonds', 
 '১০০ ডায়মন্ড',
 'Perfect starter pack for new players. Get 100 diamonds instantly delivered to your account.',
 'নতুন খেলোয়াড়দের জন্য নিখুঁত স্টার্টার প্যাক। আপনার অ্যাকাউন্টে তাৎক্ষণিক ১০০ ডায়মন্ড পান।',
 99.00, 
 120.00, 
 'BDT', 
 100,
 'https://i.ibb.co/placeholder/ff-100.jpg',
 1000, 
 false, 
 true, 
 null,
 1,
 4.8),

('650e8400-e29b-41d4-a716-446655440002', 
 '550e8400-e29b-41d4-a716-446655440001',
 '210 Diamonds', 
 '২১০ ডায়মন্ড',
 'Popular choice! 210 diamonds with 21 bonus diamonds. Best value for casual players.',
 'জনপ্রিয় পছন্দ! ২১০ ডায়মন্ড সহ ২১ বোনাস ডায়মন্ড। নৈমিত্তিক খেলোয়াড়দের জন্য সেরা মূল্য।',
 199.00, 
 240.00, 
 'BDT', 
 210,
 'https://i.ibb.co/placeholder/ff-210.jpg',
 1000, 
 true, 
 true, 
 'HOT',
 2,
 4.9),

('650e8400-e29b-41d4-a716-446655440003', 
 '550e8400-e29b-41d4-a716-446655440001',
 '310 Diamonds', 
 '৩১০ ডায়মন্ড',
 '310 diamonds with 31 bonus. Great for unlocking characters and weapons.',
 '৩১০ ডায়মন্ড সহ ৩১ বোনাস। ক্যারেক্টার এবং অস্ত্র আনলক করার জন্য দুর্দান্ত।',
 299.00, 
 360.00, 
 'BDT', 
 310,
 'https://i.ibb.co/placeholder/ff-310.jpg',
 1000, 
 false, 
 true, 
 null,
 3,
 4.7),

('650e8400-e29b-41d4-a716-446655440004', 
 '550e8400-e29b-41d4-a716-446655440001',
 '520 Diamonds', 
 '৫২০ ডায়মন্ড',
 'Best seller! 520 diamonds with 52 bonus. Perfect for elite pass and premium items.',
 'সেরা বিক্রেতা! ৫২০ ডায়মন্ড সহ ৫২ বোনাস। এলিট পাস এবং প্রিমিয়াম আইটেমের জন্য নিখুঁত।',
 499.00, 
 600.00, 
 'BDT', 
 520,
 'https://i.ibb.co/placeholder/ff-520.jpg',
 1000, 
 true, 
 true, 
 'BEST VALUE',
 4,
 4.9),

('650e8400-e29b-41d4-a716-446655440005', 
 '550e8400-e29b-41d4-a716-446655440001',
 '1060 Diamonds', 
 '১০৬০ ডায়মন্ড',
 'Premium pack with 1060 diamonds + 106 bonus. Get multiple elite passes and exclusive items.',
 'প্রিমিয়াম প্যাক ১০৬০ ডায়মন্ড + ১০৬ বোনাস সহ। একাধিক এলিট পাস এবং এক্সক্লুসিভ আইটেম পান।',
 999.00, 
 1200.00, 
 'BDT', 
 1060,
 'https://i.ibb.co/placeholder/ff-1060.jpg',
 1000, 
 true, 
 true, 
 'POPULAR',
 5,
 4.9),

('650e8400-e29b-41d4-a716-446655440006', 
 '550e8400-e29b-41d4-a716-446655440001',
 '2180 Diamonds', 
 '২১৮০ ডায়মন্ড',
 'Mega pack! 2180 diamonds + 218 bonus. Ultimate choice for serious gamers.',
 'মেগা প্যাক! ২১৮০ ডায়মন্ড + ২১৮ বোনাস। গুরুতর গেমারদের জন্য চূড়ান্ত পছন্দ।',
 1999.00, 
 2400.00, 
 'BDT', 
 2180,
 'https://i.ibb.co/placeholder/ff-2180.jpg',
 1000, 
 false, 
 true, 
 null,
 6,
 4.8)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    updated_at = NOW();

-- ============================================
-- TOPUP PACKAGES - PUBG MOBILE
-- ============================================

INSERT INTO topup_packages (id, game_id, name, name_bn, description, description_bn, price, original_price, currency, diamonds, image_url, stock, is_featured, is_active, badge, sort_order, rating) VALUES

('650e8400-e29b-41d4-a716-446655440007', 
 '550e8400-e29b-41d4-a716-446655440002',
 '60 UC', 
 '৬০ ইউসি',
 'Basic UC pack for PUBG Mobile. Perfect for starter items.',
 'পাবজি মোবাইলের জন্য বেসিক ইউসি প্যাক। স্টার্টার আইটেমের জন্য নিখুঁত।',
 99.00, 
 120.00, 
 'BDT', 
 60,
 'https://i.ibb.co/placeholder/pubg-60.jpg',
 1000, 
 false, 
 true, 
 null,
 1,
 4.7),

('650e8400-e29b-41d4-a716-446655440008', 
 '550e8400-e29b-41d4-a716-446655440002',
 '325 UC', 
 '৩২৫ ইউসি',
 'Popular UC pack! Get Royal Pass and premium crates.',
 'জনপ্রিয় ইউসি প্যাক! রয়্যাল পাস এবং প্রিমিয়াম ক্রেট পান।',
 499.00, 
 600.00, 
 'BDT', 
 325,
 'https://i.ibb.co/placeholder/pubg-325.jpg',
 1000, 
 true, 
 true, 
 'HOT',
 2,
 4.9),

('650e8400-e29b-41d4-a716-446655440009', 
 '550e8400-e29b-41d4-a716-446655440002',
 '660 UC', 
 '৬৬০ ইউসি',
 'Best value! 660 UC for Royal Pass Elite and exclusive skins.',
 'সেরা মূল্য! রয়্যাল পাস এলিট এবং এক্সক্লুসিভ স্কিনের জন্য ৬৬০ ইউসি।',
 999.00, 
 1200.00, 
 'BDT', 
 660,
 'https://i.ibb.co/placeholder/pubg-660.jpg',
 1000, 
 true, 
 true, 
 'BEST VALUE',
 3,
 4.9),

('650e8400-e29b-41d4-a716-446655440010', 
 '550e8400-e29b-41d4-a716-446655440002',
 '1800 UC', 
 '১৮০০ ইউসি',
 'Premium UC pack! Get multiple Royal Passes and legendary items.',
 'প্রিমিয়াম ইউসি প্যাক! একাধিক রয়্যাল পাস এবং কিংবদন্তি আইটেম পান।',
 2999.00, 
 3600.00, 
 'BDT', 
 1800,
 'https://i.ibb.co/placeholder/pubg-1800.jpg',
 1000, 
 false, 
 true, 
 null,
 4,
 4.8)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    updated_at = NOW();

-- ============================================
-- TOPUP PACKAGES - MOBILE LEGENDS
-- ============================================

INSERT INTO topup_packages (id, game_id, name, name_bn, description, description_bn, price, original_price, currency, diamonds, image_url, stock, is_featured, is_active, badge, sort_order, rating) VALUES

('650e8400-e29b-41d4-a716-446655440011', 
 '550e8400-e29b-41d4-a716-446655440003',
 '86 Diamonds', 
 '৮৬ ডায়মন্ড',
 'Starter pack for Mobile Legends. Get your first hero!',
 'মোবাইল লিজেন্ডসের জন্য স্টার্টার প্যাক। আপনার প্রথম হিরো পান!',
 99.00, 
 120.00, 
 'BDT', 
 86,
 'https://i.ibb.co/placeholder/ml-86.jpg',
 1000, 
 false, 
 true, 
 null,
 1,
 4.7),

('650e8400-e29b-41d4-a716-446655440012', 
 '550e8400-e29b-41d4-a716-446655440003',
 '172 Diamonds', 
 '১৭২ ডায়মন্ড',
 'Popular choice! Perfect for buying heroes and skins.',
 'জনপ্রিয় পছন্দ! হিরো এবং স্কিন কেনার জন্য নিখুঁত।',
 199.00, 
 240.00, 
 'BDT', 
 172,
 'https://i.ibb.co/placeholder/ml-172.jpg',
 1000, 
 true, 
 true, 
 'HOT',
 2,
 4.8),

('650e8400-e29b-41d4-a716-446655440013', 
 '550e8400-e29b-41d4-a716-446655440003',
 '344 Diamonds', 
 '৩৪৪ ডায়মন্ড',
 'Best value! Get multiple heroes and premium skins.',
 'সেরা মূল্য! একাধিক হিরো এবং প্রিমিয়াম স্কিন পান।',
 399.00, 
 480.00, 
 'BDT', 
 344,
 'https://i.ibb.co/placeholder/ml-344.jpg',
 1000, 
 true, 
 true, 
 'BEST VALUE',
 3,
 4.9),

('650e8400-e29b-41d4-a716-446655440014', 
 '550e8400-e29b-41d4-a716-446655440003',
 '706 Diamonds', 
 '৭০৬ ডায়মন্ড',
 'Premium pack! Unlock exclusive heroes and legendary skins.',
 'প্রিমিয়াম প্যাক! এক্সক্লুসিভ হিরো এবং কিংবদন্তি স্কিন আনলক করুন।',
 799.00, 
 960.00, 
 'BDT', 
 706,
 'https://i.ibb.co/placeholder/ml-706.jpg',
 1000, 
 false, 
 true, 
 null,
 4,
 4.8)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    updated_at = NOW();

-- ============================================
-- SAMPLE ORDERS (for testing)
-- ============================================
-- Note: Replace user_id with actual user ID from your auth.users table
-- You can get it by running: SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Sample Order 1 - Completed
INSERT INTO orders (
  id, 
  user_id, 
  product_id, 
  quantity, 
  unit_price, 
  total_amount, 
  currency,
  status, 
  payment_status,
  delivery_status,
  player_id, 
  player_name,
  contact_email,
  contact_phone,
  payment_method,
  transaction_id,
  payment_proof_url,
  verification_status,
  verified_at,
  notes,
  created_at,
  completed_at
) VALUES (
  'bd92d210-98ad-4e32-bb7c-7d5d1cfe19c1',
  (SELECT id FROM auth.users WHERE email = 'gunjonarka@gmail.com' LIMIT 1),
  '650e8400-e29b-41d4-a716-446655440002', -- 210 Diamonds
  1,
  199.00,
  199.00,
  'BDT',
  'completed',
  'paid',
  'delivered',
  '123456789',
  'Player One',
  'gunjonarka@gmail.com',
  '+8801883800356',
  'bkash',
  'BKX123456789',
  'https://i.ibb.co/placeholder/payment-proof.jpg',
  'verified',
  NOW() - INTERVAL '2 hours',
  'Fast delivery please',
  NOW() - INTERVAL '3 hours',
  NOW() - INTERVAL '1 hour'
) ON CONFLICT (id) DO NOTHING;

-- Sample Order 2 - Processing
INSERT INTO orders (
  id,
  user_id, 
  product_id, 
  quantity, 
  unit_price, 
  total_amount, 
  currency,
  status, 
  payment_status,
  delivery_status,
  player_id, 
  contact_email,
  payment_method,
  transaction_id,
  payment_proof_url,
  verification_status,
  verified_at,
  created_at
) VALUES (
  'bd92d210-98ad-4e32-bb7c-7d5d1cfe19c2',
  (SELECT id FROM auth.users WHERE email = 'gunjonarka@gmail.com' LIMIT 1),
  '650e8400-e29b-41d4-a716-446655440004', -- 520 Diamonds
  1,
  499.00,
  499.00,
  'BDT',
  'processing',
  'paid',
  'processing',
  '987654321',
  'gunjonarka@gmail.com',
  'nagad',
  'NGD987654321',
  'https://i.ibb.co/placeholder/payment-proof-2.jpg',
  'verified',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '1 hour'
) ON CONFLICT (id) DO NOTHING;

-- Sample Order 3 - Pending Verification
INSERT INTO orders (
  id,
  user_id, 
  product_id, 
  quantity, 
  unit_price, 
  total_amount, 
  currency,
  status, 
  payment_status,
  delivery_status,
  player_id, 
  contact_email,
  contact_phone,
  payment_method,
  transaction_id,
  payment_proof_url,
  verification_status,
  notes,
  created_at
) VALUES (
  'bd92d210-98ad-4e32-bb7c-7d5d1cfe19c3',
  (SELECT id FROM auth.users WHERE email = 'gunjonarka@gmail.com' LIMIT 1),
  '650e8400-e29b-41d4-a716-446655440001', -- 100 Diamonds
  1,
  99.00,
  99.00,
  'BDT',
  'pending',
  'pending',
  'pending',
  '555666777',
  'gunjonarka@gmail.com',
  '+8801883800356',
  'bkash',
  'BKX555666777',
  'https://i.ibb.co/placeholder/payment-proof-3.jpg',
  'pending',
  'Please verify quickly',
  NOW() - INTERVAL '15 minutes'
) ON CONFLICT (id) DO NOTHING;

-- Sample Order 4 - Completed (older)
INSERT INTO orders (
  id,
  user_id, 
  product_id, 
  quantity, 
  unit_price, 
  total_amount, 
  currency,
  status, 
  payment_status,
  delivery_status,
  player_id, 
  contact_email,
  payment_method,
  transaction_id,
  verification_status,
  verified_at,
  created_at,
  completed_at
) VALUES (
  'bd92d210-98ad-4e32-bb7c-7d5d1cfe19c4',
  (SELECT id FROM auth.users WHERE email = 'gunjonarka@gmail.com' LIMIT 1),
  '650e8400-e29b-41d4-a716-446655440005', -- 1060 Diamonds
  1,
  999.00,
  999.00,
  'BDT',
  'completed',
  'paid',
  'delivered',
  '111222333',
  'gunjonarka@gmail.com',
  'rocket',
  'RKT111222333',
  'verified',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '2 days'
) ON CONFLICT (id) DO NOTHING;

-- Sample Order 5 - Pending
INSERT INTO orders (
  id,
  user_id, 
  product_id, 
  quantity, 
  unit_price, 
  total_amount, 
  currency,
  status, 
  payment_status,
  delivery_status,
  player_id, 
  contact_email,
  payment_method,
  transaction_id,
  payment_proof_url,
  verification_status,
  created_at
) VALUES (
  'bd92d210-98ad-4e32-bb7c-7d5d1cfe19c5',
  (SELECT id FROM auth.users WHERE email = 'gunjonarka@gmail.com' LIMIT 1),
  '650e8400-e29b-41d4-a716-446655440003', -- 310 Diamonds
  1,
  299.00,
  299.00,
  'BDT',
  'pending',
  'pending',
  'pending',
  '444555666',
  'gunjonarka@gmail.com',
  'bkash',
  'BKX444555666',
  'https://i.ibb.co/placeholder/payment-proof-5.jpg',
  'pending',
  NOW() - INTERVAL '5 minutes'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SAMPLE NOTIFICATIONS
-- ============================================

INSERT INTO notifications (user_id, title, message, type, order_id, link, is_read) VALUES
(
  (SELECT id FROM auth.users WHERE email = 'gunjonarka@gmail.com' LIMIT 1),
  'অর্ডার সম্পন্ন! 🎉',
  'আপনার অর্ডার #BD92D210 সম্পন্ন হয়েছে। 210 ডায়মন্ড আপনার একাউন্টে যোগ হয়েছে!',
  'success',
  'bd92d210-98ad-4e32-bb7c-7d5d1cfe19c1',
  '/dashboard',
  false
),
(
  (SELECT id FROM auth.users WHERE email = 'gunjonarka@gmail.com' LIMIT 1),
  'পেমেন্ট ভেরিফাই সফল! ✅',
  'আপনার অর্ডার #BD92D210 ভেরিফাই হয়েছে। 520 ডায়মন্ড শীঘ্রই পৌঁছাবে!',
  'success',
  'bd92d210-98ad-4e32-bb7c-7d5d1cfe19c2',
  '/dashboard',
  false
),
(
  (SELECT id FROM auth.users WHERE email = 'gunjonarka@gmail.com' LIMIT 1),
  'নতুন অফার! 🎁',
  '520 ডায়মন্ড প্যাকে ২০% ছাড়! এখনই কিনুন।',
  'info',
  NULL,
  '/store',
  false
)
ON CONFLICT DO NOTHING;

-- ============================================
-- SAMPLE REVIEWS
-- ============================================

INSERT INTO reviews (product_id, user_id, order_id, rating, title, comment, is_approved, is_featured) VALUES
(
  '650e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM auth.users WHERE email = 'gunjonarka@gmail.com' LIMIT 1),
  'bd92d210-98ad-4e32-bb7c-7d5d1cfe19c1',
  5,
  'দ্রুত ডেলিভারি!',
  'খুবই দ্রুত ডায়মন্ড পেয়েছি। মাত্র ৫ মিনিটে! সার্ভিস অসাধারণ। ধন্যবাদ NRX Store!',
  true,
  true
)
ON CONFLICT (product_id, user_id) DO NOTHING;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'SEED DATA INSERTED SUCCESSFULLY!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Data inserted:';
    RAISE NOTICE '  ✓ 3 Games (Free Fire, PUBG, Mobile Legends)';
    RAISE NOTICE '  ✓ 14 Products (various diamond packages)';
    RAISE NOTICE '  ✓ 5 Sample Orders (different statuses)';
    RAISE NOTICE '  ✓ 3 Sample Notifications';
    RAISE NOTICE '  ✓ 1 Sample Review';
    RAISE NOTICE '';
    RAISE NOTICE 'Order statuses:';
    RAISE NOTICE '  ✓ 2 Completed orders';
    RAISE NOTICE '  ✓ 1 Processing order';
    RAISE NOTICE '  ✓ 2 Pending orders (need verification)';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '  1. Set admin role: UPDATE auth.users SET raw_user_meta_data = ';
    RAISE NOTICE '     raw_user_meta_data || ''{"role": "admin"}''::jsonb';
    RAISE NOTICE '     WHERE email = ''gunjonarka@gmail.com'';';
    RAISE NOTICE '  2. Restart backend server';
    RAISE NOTICE '  3. Test the application';
    RAISE NOTICE '============================================';
END $$;

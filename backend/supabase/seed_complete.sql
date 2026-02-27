-- ============================================
-- NRX Diamond Store - Complete Seed Data
-- ============================================
-- Version: 2.0
-- Description: Sample data for testing and initial setup
-- ============================================

-- ============================================
-- GAMES
-- ============================================

INSERT INTO games (id, name, name_bn, slug, description, description_bn, image_url, banner_url, category, is_active, is_featured, sort_order) VALUES
-- Free Fire
('550e8400-e29b-41d4-a716-446655440001', 
 'Free Fire', 
 'ফ্রি ফায়ার',
 'free-fire', 
 'Garena Free Fire - The most popular battle royale game. Get diamonds instantly and unlock exclusive items, characters, and skins.',
 'গারেনা ফ্রি ফায়ার - সবচেয়ে জনপ্রিয় ব্যাটেল রয়্যাল গেম। তাৎক্ষণিক ডায়মন্ড পান এবং এক্সক্লুসিভ আইটেম, ক্যারেক্টার এবং স্কিন আনলক করুন।',
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
 'premium', 
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
 3),

-- Call of Duty Mobile
('550e8400-e29b-41d4-a716-446655440004', 
 'Call of Duty Mobile', 
 'কল অফ ডিউটি মোবাইল',
 'cod-mobile', 
 'Call of Duty Mobile - Premium FPS action. Get CP for Battle Pass, legendary weapons, and operator skins.',
 'কল অফ ডিউটি মোবাইল - প্রিমিয়াম FPS অ্যাকশন। ব্যাটেল পাস, কিংবদন্তি অস্ত্র এবং অপারেটর স্কিনের জন্য CP পান।',
 'https://i.ibb.co/placeholder/cod.jpg',
 'https://i.ibb.co/placeholder/cod-banner.jpg',
 'premium', 
 true, 
 false, 
 4)

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
 'জনপ্রিয় পছন্দ! ২১ বোনাস ডায়মন্ড সহ ২১০ ডায়মন্ড। নৈমিত্তিক খেলোয়াড়দের জন্য সেরা মূল্য।',
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
 '৩১ বোনাস সহ ৩১০ ডায়মন্ড। ক্যারেক্টার এবং অস্ত্র আনলক করার জন্য দুর্দান্ত।',
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

-- Standard Packs (Popular)
('650e8400-e29b-41d4-a716-446655440004', 
 '550e8400-e29b-41d4-a716-446655440001',
 '520 Diamonds', 
 '৫২০ ডায়মন্ড',
 'Most popular pack! 520 diamonds with 52 bonus. Perfect for elite passes and bundles.',
 'সবচেয়ে জনপ্রিয় প্যাক! ৫২ বোনাস সহ ৫২০ ডায়মন্ড। এলিট পাস এবং বান্ডেলের জন্য নিখুঁত।',
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
 5.0),

('650e8400-e29b-41d4-a716-446655440005', 
 '550e8400-e29b-41d4-a716-446655440001',
 '1060 Diamonds', 
 '১০৬০ ডায়মন্ড',
 'Premium pack with 1060 diamonds + 106 bonus. Get multiple elite passes and exclusive items.',
 '১০৬ বোনাস সহ ১০৬০ ডায়মন্ড প্রিমিয়াম প্যাক। একাধিক এলিট পাস এবং এক্সক্লুসিভ আইটেম পান।',
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
 'Big pack! 2180 diamonds with 218 bonus. Perfect for serious gamers.',
 'বড় প্যাক! ২১৮ বোনাস সহ ২১৮০ ডায়মন্ড। গুরুতর গেমারদের জন্য নিখুঁত।',
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
 4.8),

-- Premium Packs (Big)
('650e8400-e29b-41d4-a716-446655440007', 
 '550e8400-e29b-41d4-a716-446655440001',
 '5600 Diamonds', 
 '৫৬০০ ডায়মন্ড',
 'Mega pack! 5600 diamonds with 560 bonus. Unlock everything you want!',
 'মেগা প্যাক! ৫৬০ বোনাস সহ ৫৬০০ ডায়মন্ড। আপনার চাওয়া সবকিছু আনলক করুন!',
 4999.00, 
 6000.00, 
 'BDT', 
 5600,
 'https://i.ibb.co/placeholder/ff-5600.jpg',
 500, 
 true, 
 true, 
 'MEGA DEAL',
 7,
 5.0),

('650e8400-e29b-41d4-a716-446655440008', 
 '550e8400-e29b-41d4-a716-446655440001',
 '11200 Diamonds', 
 '১১২০০ ডায়মন্ড',
 'Ultimate pack! 11200 diamonds with 1120 bonus. For the ultimate gaming experience.',
 'আলটিমেট প্যাক! ১১২০ বোনাস সহ ১১২০০ ডায়মন্ড। চূড়ান্ত গেমিং অভিজ্ঞতার জন্য।',
 9999.00, 
 12000.00, 
 'BDT', 
 11200,
 'https://i.ibb.co/placeholder/ff-11200.jpg',
 500, 
 false, 
 true, 
 null,
 8,
 4.9),

-- Membership
('650e8400-e29b-41d4-a716-446655440009', 
 '550e8400-e29b-41d4-a716-446655440001',
 'Weekly Membership', 
 'সাপ্তাহিক মেম্বারশিপ',
 '7 days of exclusive benefits: Daily diamonds, exclusive badges, and special discounts.',
 '৭ দিনের এক্সক্লুসিভ সুবিধা: দৈনিক ডায়মন্ড, এক্সক্লুসিভ ব্যাজ এবং বিশেষ ছাড়।',
 149.00, 
 200.00, 
 'BDT', 
 0,
 'https://i.ibb.co/placeholder/ff-weekly.jpg',
 1000, 
 false, 
 true, 
 'NEW',
 9,
 4.6),

('650e8400-e29b-41d4-a716-446655440010', 
 '550e8400-e29b-41d4-a716-446655440001',
 'Monthly Membership', 
 'মাসিক মেম্বারশিপ',
 '30 days of premium benefits: Daily diamonds, exclusive items, priority support, and more!',
 '৩০ দিনের প্রিমিয়াম সুবিধা: দৈনিক ডায়মন্ড, এক্সক্লুসিভ আইটেম, অগ্রাধিকার সহায়তা এবং আরও অনেক কিছু!',
 499.00, 
 600.00, 
 'BDT', 
 0,
 'https://i.ibb.co/placeholder/ff-monthly.jpg',
 1000, 
 true, 
 true, 
 'BEST DEAL',
 10,
 4.9)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    updated_at = NOW();

-- ============================================
-- TOPUP PACKAGES - PUBG MOBILE
-- ============================================

INSERT INTO topup_packages (id, game_id, name, name_bn, description, description_bn, price, original_price, currency, diamonds, image_url, stock, is_featured, is_active, badge, sort_order, rating) VALUES

('650e8400-e29b-41d4-a716-446655440011', 
 '550e8400-e29b-41d4-a716-446655440002',
 '60 UC', 
 '৬০ UC',
 'Starter UC pack for PUBG Mobile. Perfect for Royal Pass or small purchases.',
 'PUBG Mobile এর জন্য স্টার্টার UC প্যাক। রয়্যাল পাস বা ছোট কেনাকাটার জন্য নিখুঁত।',
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

('650e8400-e29b-41d4-a716-446655440012', 
 '550e8400-e29b-41d4-a716-446655440002',
 '325 UC', 
 '৩২৫ UC',
 'Popular UC pack with bonus. Great for Royal Pass and crate openings.',
 'বোনাস সহ জনপ্রিয় UC প্যাক। রয়্যাল পাস এবং ক্রেট খোলার জন্য দুর্দান্ত।',
 499.00, 
 600.00, 
 'BDT', 
 325,
 'https://i.ibb.co/placeholder/pubg-325.jpg',
 1000, 
 true, 
 true, 
 'POPULAR',
 2,
 4.9),

('650e8400-e29b-41d4-a716-446655440013', 
 '550e8400-e29b-41d4-a716-446655440002',
 '660 UC', 
 '৬৬০ UC',
 'Best value UC pack! Perfect for Royal Pass Elite and premium items.',
 'সেরা মূল্যের UC প্যাক! রয়্যাল পাস এলিট এবং প্রিমিয়াম আইটেমের জন্য নিখুঁত।',
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
 5.0),

('650e8400-e29b-41d4-a716-446655440014', 
 '550e8400-e29b-41d4-a716-446655440002',
 '1800 UC', 
 '১৮০০ UC',
 'Premium UC pack for serious players. Get multiple Royal Passes and exclusive skins.',
 'গুরুতর খেলোয়াড়দের জন্য প্রিমিয়াম UC প্যাক। একাধিক রয়্যাল পাস এবং এক্সক্লুসিভ স্কিন পান।',
 2499.00, 
 3000.00, 'BDT', 
 1800,
 'https://i.ibb.co/placeholder/pubg-1800.jpg',
 500, 
 false, 
 true, 
 null,
 4,
 4.8),

('650e8400-e29b-41d4-a716-446655440015', 
 '550e8400-e29b-41d4-a716-446655440002',
 '3850 UC', 
 '৩৮৫০ UC',
 'Ultimate UC pack! Get everything you need for the complete PUBG experience.',
 'আলটিমেট UC প্যাক! সম্পূর্ণ PUBG অভিজ্ঞতার জন্য আপনার প্রয়োজনীয় সবকিছু পান।',
 4999.00, 
 6000.00, 
 'BDT', 
 3850,
 'https://i.ibb.co/placeholder/pubg-3850.jpg',
 500, 
 true, 
 true, 
 'MEGA DEAL',
 5,
 5.0)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    updated_at = NOW();

-- ============================================
-- TOPUP PACKAGES - MOBILE LEGENDS
-- ============================================

INSERT INTO topup_packages (id, game_id, name, name_bn, description, description_bn, price, original_price, currency, diamonds, image_url, stock, is_featured, is_active, badge, sort_order, rating) VALUES

('650e8400-e29b-41d4-a716-446655440016', 
 '550e8400-e29b-41d4-a716-446655440003',
 '86 Diamonds', 
 '৮৬ ডায়মন্ড',
 'Starter pack for Mobile Legends. Perfect for new heroes and skins.',
 'মোবাইল লিজেন্ডসের জন্য স্টার্টার প্যাক। নতুন হিরো এবং স্কিনের জন্য নিখুঁত।',
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

('650e8400-e29b-41d4-a716-446655440017', 
 '550e8400-e29b-41d4-a716-446655440003',
 '172 Diamonds', 
 '১৭২ ডায়মন্ড',
 '172 diamonds with bonus. Great for unlocking heroes and basic skins.',
 'বোনাস সহ ১৭২ ডায়মন্ড। হিরো এবং বেসিক স্কিন আনলক করার জন্য দুর্দান্ত।',
 199.00, 
 240.00, 
 'BDT', 
 172,
 'https://i.ibb.co/placeholder/ml-172.jpg',
 1000, 
 false, 
 true, 
 null,
 2,
 4.6),

('650e8400-e29b-41d4-a716-446655440018', 
 '550e8400-e29b-41d4-a716-446655440003',
 '429 Diamonds', 
 '৪২৯ ডায়মন্ড',
 'Popular choice! Perfect for battle passes and premium skins.',
 'জনপ্রিয় পছন্দ! ব্যাটেল পাস এবং প্রিমিয়াম স্কিনের জন্য নিখুঁত।',
 499.00, 
 600.00, 
 'BDT', 
 429,
 'https://i.ibb.co/placeholder/ml-429.jpg',
 1000, 
 true, 
 true, 
 'HOT',
 3,
 4.9),

('650e8400-e29b-41d4-a716-446655440019', 
 '550e8400-e29b-41d4-a716-446655440003',
 '878 Diamonds', 
 '৮৭৮ ডায়মন্ড',
 'Best value pack! Get multiple heroes and epic skins.',
 'সেরা মূল্যের প্যাক! একাধিক হিরো এবং এপিক স্কিন পান।',
 999.00, 
 1200.00, 
 'BDT', 
 878,
 'https://i.ibb.co/placeholder/ml-878.jpg',
 1000, 
 true, 
 true, 
 'BEST VALUE',
 4,
 5.0),

('650e8400-e29b-41d4-a716-446655440020', 
 '550e8400-e29b-41d4-a716-446655440003',
 '2195 Diamonds', 
 '২১৯৫ ডায়মন্ড',
 'Premium pack for serious players. Unlock legendary skins and exclusive items.',
 'গুরুতর খেলোয়াড়দের জন্য প্রিমিয়াম প্যাক। কিংবদন্তি স্কিন এবং এক্সক্লুসিভ আইটেম আনলক করুন।',
 2499.00, 
 3000.00, 
 'BDT', 
 2195,
 'https://i.ibb.co/placeholder/ml-2195.jpg',
 500, 
 false, 
 true, 
 null,
 5,
 4.8)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    updated_at = NOW();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Seed data inserted successfully!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Data inserted:';
    RAISE NOTICE '  - 4 games (Free Fire, PUBG, ML, COD)';
    RAISE NOTICE '  - 20 topup packages';
    RAISE NOTICE '    * 10 Free Fire packages';
    RAISE NOTICE '    * 5 PUBG Mobile packages';
    RAISE NOTICE '    * 5 Mobile Legends packages';
    RAISE NOTICE '';
    RAISE NOTICE 'Note: Image URLs are placeholders.';
    RAISE NOTICE 'Replace with real images from ImgBB:';
    RAISE NOTICE '  1. Upload images to https://imgbb.com/';
    RAISE NOTICE '  2. Copy direct links';
    RAISE NOTICE '  3. Update via Admin Dashboard or SQL';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '  1. Set admin role for your user';
    RAISE NOTICE '  2. Update image URLs';
    RAISE NOTICE '  3. Test the application';
    RAISE NOTICE '============================================';
END $$;


-- ============================================
-- SAMPLE ORDERS (for testing)
-- ============================================
-- Note: Replace user_id with actual user ID from your database
-- You can get user ID by running: SELECT id FROM auth.users LIMIT 1;

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
  payment_method,
  transaction_id,
  player_id, 
  player_name,
  verification_status,
  admin_notes,
  created_at,
  updated_at
) VALUES (
  '750e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM auth.users WHERE email = 'gunjonarka@gmail.com' LIMIT 1),
  '650e8400-e29b-41d4-a716-446655440001', -- 100 Diamonds Free Fire
  1,
  120.00,
  120.00,
  'BDT',
  'completed',
  'verified',
  'bkash',
  'TXN123456789',
  '1234567890',
  'Test Player',
  'verified',
  'Order completed successfully. Diamonds delivered.',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '1 day'
);

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
  payment_method,
  transaction_id,
  player_id, 
  player_name,
  verification_status,
  admin_notes,
  created_at,
  updated_at
) VALUES (
  '750e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM auth.users WHERE email = 'gunjonarka@gmail.com' LIMIT 1),
  '650e8400-e29b-41d4-a716-446655440005', -- 500 Diamonds Free Fire
  1,
  550.00,
  550.00,
  'BDT',
  'processing',
  'paid',
  'nagad',
  'TXN987654321',
  '9876543210',
  'Test Player 2',
  'pending',
  'Payment verified. Processing order.',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '12 hours'
);

-- Sample Order 3 - Pending
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
  payment_method,
  transaction_id,
  player_id, 
  player_name,
  verification_status,
  created_at,
  updated_at
) VALUES (
  '750e8400-e29b-41d4-a716-446655440003',
  (SELECT id FROM auth.users WHERE email = 'gunjonarka@gmail.com' LIMIT 1),
  '650e8400-e29b-41d4-a716-446655440010', -- 1000 Diamonds PUBG
  1,
  1100.00,
  1100.00,
  'BDT',
  'pending',
  'pending',
  'bkash',
  'TXN555666777',
  '5556667777',
  'Test Player 3',
  'pending',
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '6 hours'
);

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
  payment_method,
  transaction_id,
  player_id, 
  player_name,
  verification_status,
  admin_notes,
  created_at,
  updated_at
) VALUES (
  '750e8400-e29b-41d4-a716-446655440004',
  (SELECT id FROM auth.users WHERE email = 'gunjonarka@gmail.com' LIMIT 1),
  '650e8400-e29b-41d4-a716-446655440015', -- 878 Diamonds Mobile Legends
  1,
  999.00,
  999.00,
  'BDT',
  'completed',
  'verified',
  'rocket',
  'TXN111222333',
  '1112223333',
  'Test Player 4',
  'verified',
  'Successfully delivered. Thank you!',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '4 days'
);

-- Sample Order 5 - Cancelled
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
  payment_method,
  transaction_id,
  player_id, 
  player_name,
  verification_status,
  admin_notes,
  created_at,
  updated_at
) VALUES (
  '750e8400-e29b-41d4-a716-446655440005',
  (SELECT id FROM auth.users WHERE email = 'gunjonarka@gmail.com' LIMIT 1),
  '650e8400-e29b-41d4-a716-446655440003', -- 210 Diamonds Free Fire
  1,
  240.00,
  240.00,
  'BDT',
  'cancelled',
  'failed',
  'bkash',
  'TXN444555666',
  '4445556666',
  'Test Player 5',
  'rejected',
  'Payment verification failed. Order cancelled.',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
);

-- ============================================
-- END OF SEED DATA
-- ============================================
-- To apply this seed data:
-- 1. Go to Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire file
-- 4. Click "Run" to execute
-- ============================================

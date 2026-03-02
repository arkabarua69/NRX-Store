-- ============================================
-- Add eFootball Game and Packages
-- ============================================

-- Insert eFootball game
INSERT INTO games (
  id, 
  name, 
  name_bn, 
  slug, 
  description, 
  description_bn, 
  image_url, 
  banner_url, 
  category, 
  is_active, 
  is_featured, 
  requires_account,
  sort_order
) VALUES (
  '550e8400-e29b-41d4-a716-446655440004',
  'eFootball',
  'ইফুটবল',
  'efootball',
  'eFootball (formerly PES) - The ultimate football gaming experience. Get eFootball Coins instantly for players, managers, and special items.',
  'ইফুটবল (পূর্বে PES) - চূড়ান্ত ফুটবল গেমিং অভিজ্ঞতা। খেলোয়াড়, ম্যানেজার এবং বিশেষ আইটেমের জন্য তাৎক্ষণিক ইফুটবল কয়েন পান।',
  'https://i.ibb.co/placeholder/efootball.jpg',
  'https://i.ibb.co/placeholder/efootball-banner.jpg',
  'standard',
  true,
  true,
  true,
  4
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  requires_account = EXCLUDED.requires_account,
  updated_at = NOW();

-- Insert eFootball packages
INSERT INTO topup_packages (
  id, 
  game_id, 
  name, 
  name_bn, 
  description, 
  description_bn, 
  price, 
  original_price, 
  currency, 
  diamonds, 
  image_url, 
  stock, 
  is_featured, 
  is_active, 
  badge, 
  sort_order, 
  rating
) VALUES

-- 100 Coins
(
  '650e8400-e29b-41d4-a716-446655440015',
  '550e8400-e29b-41d4-a716-446655440004',
  '100 eFootball Coins',
  '১০০ ইফুটবল কয়েন',
  'Perfect starter pack. Get 100 eFootball Coins for players and items.',
  'স্টার্টার প্যাক। খেলোয়াড় এবং আইটেমের জন্য ১০০ ইফুটবল কয়েন পান।',
  150.00,
  180.00,
  'BDT',
  100,
  'https://i.ibb.co/placeholder/efootball-100.jpg',
  1000,
  false,
  true,
  null,
  1,
  4.7
),

-- 310 Coins
(
  '650e8400-e29b-41d4-a716-446655440016',
  '550e8400-e29b-41d4-a716-446655440004',
  '310 eFootball Coins',
  '৩১০ ইফুটবল কয়েন',
  'Popular choice! Get featured players and managers.',
  'জনপ্রিয় পছন্দ! ফিচার্ড খেলোয়াড় এবং ম্যানেজার পান।',
  450.00,
  540.00,
  'BDT',
  310,
  'https://i.ibb.co/placeholder/efootball-310.jpg',
  1000,
  true,
  true,
  'HOT',
  2,
  4.8
),

-- 600 Coins
(
  '650e8400-e29b-41d4-a716-446655440017',
  '550e8400-e29b-41d4-a716-446655440004',
  '600 eFootball Coins',
  '৬০০ ইফুটবল কয়েন',
  'Best value! Get multiple featured players and special items.',
  'সেরা মূল্য! একাধিক ফিচার্ড খেলোয়াড় এবং বিশেষ আইটেম পান।',
  850.00,
  1020.00,
  'BDT',
  600,
  'https://i.ibb.co/placeholder/efootball-600.jpg',
  1000,
  true,
  true,
  'BEST VALUE',
  3,
  4.9
),

-- 1200 Coins
(
  '650e8400-e29b-41d4-a716-446655440018',
  '550e8400-e29b-41d4-a716-446655440004',
  '1200 eFootball Coins',
  '১২০০ ইফুটবল কয়েন',
  'Premium pack! Build your dream team with legendary players.',
  'প্রিমিয়াম প্যাক! কিংবদন্তি খেলোয়াড়দের সাথে আপনার স্বপ্নের দল তৈরি করুন।',
  1650.00,
  1980.00,
  'BDT',
  1200,
  'https://i.ibb.co/placeholder/efootball-1200.jpg',
  1000,
  false,
  true,
  null,
  4,
  4.8
),

-- 2500 Coins
(
  '650e8400-e29b-41d4-a716-446655440019',
  '550e8400-e29b-41d4-a716-446655440004',
  '2500 eFootball Coins',
  '২৫০০ ইফুটবল কয়েন',
  'Mega pack! Get all the featured players and build the ultimate squad.',
  'মেগা প্যাক! সব ফিচার্ড খেলোয়াড় পান এবং চূড়ান্ত স্কোয়াড তৈরি করুন।',
  3300.00,
  3960.00,
  'BDT',
  2500,
  'https://i.ibb.co/placeholder/efootball-2500.jpg',
  1000,
  false,
  true,
  null,
  5,
  4.9
)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  updated_at = NOW();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'eFootball Game Added Successfully!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Game added:';
    RAISE NOTICE '  ✓ eFootball (requires account login)';
    RAISE NOTICE '';
    RAISE NOTICE 'Packages added:';
    RAISE NOTICE '  ✓ 100 Coins - ৳150';
    RAISE NOTICE '  ✓ 310 Coins - ৳450';
    RAISE NOTICE '  ✓ 600 Coins - ৳850 (Best Value)';
    RAISE NOTICE '  ✓ 1200 Coins - ৳1650';
    RAISE NOTICE '  ✓ 2500 Coins - ৳3300';
    RAISE NOTICE '';
    RAISE NOTICE 'Note: eFootball requires Konami account login';
    RAISE NOTICE 'Users must provide account credentials for top-up.';
    RAISE NOTICE '============================================';
END $$;

-- ============================================
-- FIX REVIEWS TABLE FOR GENERAL REVIEWS
-- ============================================
-- This script updates the reviews table to support general reviews
-- (not just product-specific reviews)

-- Step 1: Make product_id optional (nullable)
ALTER TABLE reviews 
ALTER COLUMN product_id DROP NOT NULL;

-- Step 2: Add user_name column for display
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS user_name VARCHAR(255);

-- Step 3: Add user_avatar column for profile pictures
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS user_avatar TEXT;

-- Step 4: Add is_verified column for verified users
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT true;

-- Step 5: Add unique constraint on user_id (one review per user for general reviews)
-- First drop old constraint if exists
ALTER TABLE reviews 
DROP CONSTRAINT IF EXISTS reviews_product_id_user_id_key;

-- Add new constraint: one review per user (for general reviews without product_id)
-- Users can only leave ONE general review
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_one_per_user 
ON reviews(user_id) 
WHERE product_id IS NULL;

-- Step 6: Update existing reviews to set is_verified = true
UPDATE reviews 
SET is_verified = true 
WHERE is_verified IS NULL;

-- Step 7: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id) WHERE product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- Step 8: Enable RLS (Row Level Security)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Step 9: Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;

-- Step 10: Create RLS policies

-- Allow anyone to view approved reviews
CREATE POLICY "Anyone can view approved reviews"
ON reviews FOR SELECT
USING (is_approved = true);

-- Allow authenticated users to create reviews
CREATE POLICY "Users can create reviews"
ON reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own reviews
CREATE POLICY "Users can update their own reviews"
ON reviews FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to delete their own reviews
CREATE POLICY "Users can delete their own reviews"
ON reviews FOR DELETE
USING (auth.uid() = user_id);

-- Step 11: Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'reviews'
ORDER BY ordinal_position;

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================
-- Changes made:
-- ✅ product_id is now optional (nullable)
-- ✅ Added user_name column
-- ✅ Added user_avatar column
-- ✅ Added is_verified column
-- ✅ Added unique constraint: ONE review per user (for general reviews)
-- ✅ Added performance indexes
-- ✅ Enabled RLS with proper policies
--
-- Now supports:
-- - General reviews (without product_id) - ONE per user
-- - Product-specific reviews (with product_id)
-- - User display information (name, avatar)
-- - Verified user badges
--
-- IMPORTANT: Each user can only submit ONE general review!
-- ============================================

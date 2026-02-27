-- ============================================
-- CREATE REVIEWS TABLE
-- ============================================
-- This script creates the reviews table for customer reviews

-- Step 1: Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES topup_packages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    -- Review Content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    
    -- User Display Info
    user_name VARCHAR(255),
    user_avatar TEXT,
    
    -- Status
    is_verified BOOLEAN DEFAULT true,
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create unique index for one review per user (for general reviews)
-- Users can only leave ONE general review (without product_id)
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_one_per_user 
ON reviews(user_id) 
WHERE product_id IS NULL;

-- Step 3: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id) WHERE product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;

-- Step 4: Enable RLS (Row Level Security)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;

-- Step 6: Create RLS policies

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

-- Step 7: Create updated_at trigger
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reviews_updated_at ON reviews;

CREATE TRIGGER reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_reviews_updated_at();

-- Step 8: Insert sample reviews (optional)
INSERT INTO reviews (user_id, rating, comment, user_name, user_avatar, is_verified, is_approved)
VALUES 
    (
        (SELECT id FROM auth.users LIMIT 1),
        5,
        'অসাধারণ সেবা! মাত্র ৫ মিনিটে ডায়মন্ড পেয়ে গেছি। দাম ও অনেক কম।',
        'রাফি আহমেদ',
        'https://ui-avatars.com/api/?name=রাফি+আহমেদ&background=FF3B30&color=fff&bold=true',
        true,
        true
    ),
    (
        (SELECT id FROM auth.users LIMIT 1 OFFSET 1),
        5,
        'খুবই ভালো অভিজ্ঞতা। সাপোর্ট টিম অনেক সহায়ক। আবারও কিনবো।',
        'সাকিব হাসান',
        'https://ui-avatars.com/api/?name=সাকিব+হাসান&background=FF3B30&color=fff&bold=true',
        true,
        true
    ),
    (
        (SELECT id FROM auth.users LIMIT 1 OFFSET 2),
        5,
        'বিশ্বস্ত এবং দ্রুত সেবা। সবাইকে রেকমেন্ড করবো।',
        'তানভীর ইসলাম',
        'https://ui-avatars.com/api/?name=তানভীর+ইসলাম&background=FF3B30&color=fff&bold=true',
        true,
        true
    )
ON CONFLICT DO NOTHING;

-- Step 9: Verify the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'reviews'
ORDER BY ordinal_position;

-- ============================================
-- TABLE CREATION COMPLETE!
-- ============================================
-- Table: reviews
-- Features:
-- ✅ General reviews (product_id nullable)
-- ✅ Product-specific reviews (product_id optional)
-- ✅ One review per user for general reviews
-- ✅ User display info (name, avatar)
-- ✅ Verified user badges
-- ✅ Auto-approval support
-- ✅ RLS enabled with proper policies
-- ✅ Performance indexes
-- ✅ Updated_at trigger
-- ✅ Sample data inserted
-- ============================================

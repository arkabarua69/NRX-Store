-- ============================================
-- QUICK CREATE REVIEWS TABLE
-- ============================================
-- Copy and paste this entire file into Supabase SQL Editor and click RUN

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES topup_packages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    user_name VARCHAR(255),
    user_avatar TEXT,
    is_verified BOOLEAN DEFAULT true,
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- One review per user (for general reviews without product_id)
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_one_per_user 
ON reviews(user_id) WHERE product_id IS NULL;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop old policies if exist
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;

-- Create RLS Policies
CREATE POLICY "Anyone can view approved reviews"
ON reviews FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create reviews"
ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
ON reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Done! Table created successfully
SELECT 'Reviews table created successfully!' as status;

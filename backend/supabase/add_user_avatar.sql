-- ============================================
-- ADD USER AVATAR TO USERS TABLE
-- ============================================

-- Add avatar_url column to users table if not exists
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add display_name column if not exists
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_avatar ON users(avatar_url);

-- Verify columns added
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('avatar_url', 'display_name')
ORDER BY ordinal_position;

-- ============================================
-- COLUMNS ADDED SUCCESSFULLY!
-- ============================================
-- users.avatar_url - Stores uploaded avatar URL
-- users.display_name - Stores user's display name
-- ============================================

-- ============================================
-- UPDATE REVIEW AVATARS
-- ============================================
-- This script updates existing reviews to add avatar URLs

-- Update reviews that don't have avatars
-- Generate avatar URL based on user_name
UPDATE reviews
SET user_avatar = 'https://ui-avatars.com/api/?name=' || 
                  REPLACE(COALESCE(user_name, 'User'), ' ', '+') || 
                  '&background=FF3B30&color=fff&bold=true&size=128'
WHERE user_avatar IS NULL 
   OR user_avatar = ''
   OR NOT user_avatar LIKE 'http%';

-- Verify the update
SELECT 
    id,
    user_name,
    user_avatar,
    rating,
    LEFT(comment, 50) as comment_preview
FROM reviews
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- UPDATE COMPLETE!
-- ============================================
-- All reviews now have avatar URLs
-- Either from OAuth provider or generated from ui-avatars.com
-- ============================================

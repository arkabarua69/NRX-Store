-- ============================================
-- Fix Notification User IDs
-- ============================================
-- Ensure all notifications have correct user_id
-- ============================================

-- Check current notification distribution
DO $$
DECLARE
    total_notifications INTEGER;
    notifications_with_user INTEGER;
    notifications_without_user INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_notifications FROM notifications;
    SELECT COUNT(*) INTO notifications_with_user FROM notifications WHERE user_id IS NOT NULL;
    SELECT COUNT(*) INTO notifications_without_user FROM notifications WHERE user_id IS NULL;
    
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Current Notification Status:';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Total notifications: %', total_notifications;
    RAISE NOTICE 'With user_id: %', notifications_with_user;
    RAISE NOTICE 'Without user_id: %', notifications_without_user;
    RAISE NOTICE '============================================';
END $$;

-- Delete notifications without user_id (orphaned notifications)
DELETE FROM notifications WHERE user_id IS NULL;

-- Add index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);

-- Add constraint to ensure user_id is always present
ALTER TABLE notifications 
ALTER COLUMN user_id SET NOT NULL;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Notification User IDs Fixed!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Changes made:';
    RAISE NOTICE '  ✓ Deleted orphaned notifications (no user_id)';
    RAISE NOTICE '  ✓ Added indexes for faster queries';
    RAISE NOTICE '  ✓ Made user_id required (NOT NULL)';
    RAISE NOTICE '';
    RAISE NOTICE 'Now each user will only see their own notifications!';
    RAISE NOTICE '============================================';
END $$;

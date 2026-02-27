-- ============================================
-- ADD RECIPIENT_TYPE TO NOTIFICATIONS TABLE
-- ============================================

-- Add recipient_type column to differentiate user vs admin notifications
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS recipient_type VARCHAR(20) DEFAULT 'user';

-- Update existing notifications to have recipient_type
UPDATE notifications 
SET recipient_type = 'user' 
WHERE recipient_type IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_type ON notifications(recipient_type);

-- Create composite index for admin queries
CREATE INDEX IF NOT EXISTS idx_notifications_admin_important 
ON notifications(recipient_type, is_important, is_read, created_at DESC) 
WHERE recipient_type = 'admin';

-- ============================================
-- RECIPIENT TYPES
-- ============================================
-- 'user': Notifications for regular users
-- 'admin': Notifications for admin users
-- ============================================

-- ============================================
-- COLUMN ADDED SUCCESSFULLY!
-- ============================================

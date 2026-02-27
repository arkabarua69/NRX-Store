-- ============================================
-- VERIFY AND FIX ADMIN_LOGS TABLE STRUCTURE
-- ============================================
-- This script ensures admin_logs table has correct column names
-- Run this if you're experiencing column name errors

-- Check current admin_logs structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'admin_logs'
ORDER BY ordinal_position;

-- If you see 'entity_type' and 'entity_id' columns, run these commands:
-- (Uncomment if needed)

/*
-- Rename old columns to new names
ALTER TABLE admin_logs 
RENAME COLUMN entity_type TO target_type;

ALTER TABLE admin_logs 
RENAME COLUMN entity_id TO target_id;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'admin_logs'
ORDER BY ordinal_position;
*/

-- Expected columns:
-- id (uuid)
-- admin_id (uuid)
-- action (varchar)
-- target_type (varchar)
-- target_id (uuid)
-- old_values (jsonb)
-- new_values (jsonb)
-- details (jsonb)
-- ip_address (inet)
-- user_agent (text)
-- created_at (timestamp with time zone)

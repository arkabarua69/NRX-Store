-- ============================================
-- ADMIN LOGIN SETUP - Simple Version
-- ============================================
-- This script creates settings table with admin credentials
-- Run this in Supabase SQL Editor

-- Step 1: Drop existing settings table (if any)
DROP TABLE IF EXISTS settings CASCADE;

-- Step 2: Create settings table
CREATE TABLE settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row_check CHECK (id = 1)
);

-- Step 3: Create index for faster queries
CREATE INDEX idx_settings_data ON settings USING GIN (data);

-- Step 4: Insert default settings with admin credentials
INSERT INTO settings (id, data) VALUES (1, '{
    "adminCredentials": {
        "email": "gunjonarka@gmail.com",
        "password": "Admin@123456"
    },
    "adminEmails": ["gunjonarka@gmail.com"],
    "paymentMethods": {
        "bkash": {
            "number": "+8801883800356",
            "type": "Send Money",
            "logo": "https://freelogopng.com/images/all_img/1656234745bkash-app-logo-png.png",
            "enabled": true
        },
        "nagad": {
            "number": "+8801883800356",
            "type": "Send Money",
            "logo": "https://freelogopng.com/images/all_img/1679248787Nagad-Logo.png",
            "enabled": true
        },
        "rocket": {
            "number": "+8801580831611",
            "type": "Send Money",
            "logo": "https://static.vecteezy.com/system/resources/thumbnails/068/706/013/small/rocket-color-logo-mobile-banking-icon-free-png.png",
            "enabled": true
        }
    },
    "siteName": "NRX Store",
    "siteNameBn": "এনআরএক্স স্টোর",
    "supportWhatsapp": "+8801883800356",
    "supportEmail": "support@nrxstore.com",
    "maintenanceMode": false,
    "announcementBanner": {
        "enabled": false,
        "message": "",
        "messageBn": "",
        "type": "info"
    }
}'::jsonb);

-- Step 5: Enable Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Step 6: Create policies
CREATE POLICY "Allow public read access to settings"
    ON settings FOR SELECT
    USING (true);

CREATE POLICY "Allow admin update access to settings"
    ON settings FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow admin insert access to settings"
    ON settings FOR INSERT
    WITH CHECK (true);

-- Step 7: Verify the setup
SELECT 
    id,
    data->'adminCredentials' as admin_credentials,
    data->'adminEmails' as admin_emails,
    created_at
FROM settings;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Default Admin Credentials:
--   Email: gunjonarka@gmail.com
--   Password: Admin@123456
--
-- Next Steps:
--   1. Restart your backend server
--   2. Go to http://localhost:5173/admin
--   3. Login with the credentials above
--   4. Go to Settings → Admin Login to change credentials
-- ============================================

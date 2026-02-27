-- Update settings table to add/update admin credentials
-- This script updates admin login credentials in the existing settings table

-- Check if settings exists and update/insert accordingly
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM settings WHERE id = 1) THEN
        -- Insert default settings if not exists
        INSERT INTO settings (id, data) VALUES (1, '{
            "adminCredentials": {
                "email": "gunjonarka@gmail.com",
                "password": "Admin@123456"
            },
            "adminEmails": ["gunjonarka@gmail.com"],
            "paymentMethods": {
                "bkash": {"number": "+8801883800356", "type": "Send Money", "enabled": true},
                "nagad": {"number": "+8801883800356", "type": "Send Money", "enabled": true},
                "rocket": {"number": "+8801580831611", "type": "Send Money", "enabled": true}
            },
            "siteName": "NRX Store",
            "siteNameBn": "এনআরএক্স স্টোর",
            "supportWhatsapp": "+8801883800356",
            "supportEmail": "support@nrxstore.com",
            "maintenanceMode": false,
            "announcementBanner": {"enabled": false, "message": "", "messageBn": "", "type": "info"}
        }'::jsonb);
        
        RAISE NOTICE 'Settings table created with default admin credentials';
    ELSE
        -- Update existing settings with admin credentials
        UPDATE settings 
        SET data = jsonb_set(
            data,
            '{adminCredentials}',
            '{"email": "gunjonarka@gmail.com", "password": "Admin@123456"}'::jsonb
        )
        WHERE id = 1;
        
        RAISE NOTICE 'Admin credentials updated in existing settings';
    END IF;
END $$;

-- Verify the update
SELECT 
    data->'adminCredentials' as admin_credentials,
    data->'adminEmails' as admin_emails
FROM settings WHERE id = 1;


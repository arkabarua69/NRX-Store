-- Create settings table to store application settings
-- This table uses a single row pattern with id=1 for global settings

-- Drop existing settings table if exists
DROP TABLE IF EXISTS settings CASCADE;

-- Create settings table
CREATE TABLE settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row_check CHECK (id = 1)
);

-- Create index on data for faster queries
CREATE INDEX IF NOT EXISTS idx_settings_data ON settings USING GIN (data);

-- Insert default settings with admin credentials
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
}'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
    data = EXCLUDED.data,
    updated_at = NOW();

-- Enable Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read settings
CREATE POLICY "Allow public read access to settings"
    ON settings FOR SELECT
    USING (true);

-- Create policy to allow only admins to update settings
CREATE POLICY "Allow admin update access to settings"
    ON settings FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Create policy to allow only admins to insert settings
CREATE POLICY "Allow admin insert access to settings"
    ON settings FOR INSERT
    WITH CHECK (true);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_settings_updated_at_trigger
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_settings_updated_at();

-- Add comments
COMMENT ON TABLE settings IS 'Application settings stored as JSONB';
COMMENT ON COLUMN settings.id IS 'Always 1 - single row table';
COMMENT ON COLUMN settings.data IS 'Settings data in JSON format';


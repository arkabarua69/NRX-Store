-- ============================================
-- Add Account Info Fields to Orders Table
-- ============================================
-- For games that require account login (like eFootball)
-- ============================================

-- Add new columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS account_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS account_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS account_password TEXT,
ADD COLUMN IF NOT EXISTS account_backup TEXT;

-- Add comment to explain the fields
COMMENT ON COLUMN orders.account_type IS 'Account type: gmail, facebook, konami, etc.';
COMMENT ON COLUMN orders.account_email IS 'Account email or phone number for login';
COMMENT ON COLUMN orders.account_password IS 'Account password (encrypted)';
COMMENT ON COLUMN orders.account_backup IS 'Backup account info if available';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_account_type ON orders(account_type);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Account Info Fields Added Successfully!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'New fields added to orders table:';
    RAISE NOTICE '  ✓ account_type (gmail, facebook, konami)';
    RAISE NOTICE '  ✓ account_email (email or phone)';
    RAISE NOTICE '  ✓ account_password (encrypted)';
    RAISE NOTICE '  ✓ account_backup (backup info)';
    RAISE NOTICE '';
    RAISE NOTICE 'These fields are optional and only required';
    RAISE NOTICE 'for games like eFootball that need account login.';
    RAISE NOTICE '============================================';
END $$;

-- Add category column to topup_packages table
ALTER TABLE topup_packages 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'standard';

-- Add comment
COMMENT ON COLUMN topup_packages.category IS 'Product category: budget, standard, premium, membership';

-- Update existing products to have a default category
UPDATE topup_packages 
SET category = 'standard' 
WHERE category IS NULL;

-- You can manually update products to different categories:
-- UPDATE topup_packages SET category = 'budget' WHERE price < 200;
-- UPDATE topup_packages SET category = 'premium' WHERE price > 1000;
-- UPDATE topup_packages SET category = 'membership' WHERE name ILIKE '%membership%';

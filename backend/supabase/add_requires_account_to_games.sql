-- ============================================
-- Add requires_account field to games table
-- ============================================
-- To identify which games need account login info
-- ============================================

-- Add new column
ALTER TABLE games 
ADD COLUMN IF NOT EXISTS requires_account BOOLEAN DEFAULT FALSE;

-- Add comment
COMMENT ON COLUMN games.requires_account IS 'Whether this game requires account login info (e.g., eFootball)';

-- Update eFootball to require account info
UPDATE games 
SET requires_account = TRUE 
WHERE name ILIKE '%efootball%' OR name ILIKE '%pes%' OR slug ILIKE '%efootball%';

-- Create index
CREATE INDEX IF NOT EXISTS idx_games_requires_account ON games(requires_account);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'requires_account Field Added Successfully!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Games that require account info:';
    RAISE NOTICE '  ✓ eFootball / PES';
    RAISE NOTICE '';
    RAISE NOTICE 'Other games (Free Fire, PUBG, ML) do not';
    RAISE NOTICE 'require account login - only Player ID.';
    RAISE NOTICE '============================================';
END $$;

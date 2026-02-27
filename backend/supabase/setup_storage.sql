-- ============================================
-- SUPABASE STORAGE SETUP FOR IMAGE UPLOADS
-- ============================================
-- This script creates storage bucket for images
-- Run this in Supabase SQL Editor

-- Step 1: Create 'images' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'images',
    'images',
    true,  -- Public bucket
    5242880,  -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- Step 2: Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Step 3: Create storage policies for public access

-- Allow public to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'images' 
    AND auth.role() = 'authenticated'
);

-- Step 4: Verify bucket creation
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types,
    created_at
FROM storage.buckets
WHERE id = 'images';

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Bucket: images
-- Public: Yes (anyone can view)
-- Upload: Authenticated users only
-- Max Size: 5MB
-- Allowed: JPG, PNG, GIF, WEBP
--
-- Folder Structure:
--   /products/YYYY/MM/filename.ext
--   /games/YYYY/MM/filename.ext
--   /avatars/YYYY/MM/filename.ext
--
-- Public URL Format:
--   https://[PROJECT].supabase.co/storage/v1/object/public/images/[path]
-- ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase configuration missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload image directly to Supabase Storage from frontend
 * @param file - File object from input
 * @param bucket - Storage bucket name
 * @param folder - Folder path
 * @returns Public URL of uploaded image
 */
export async function uploadImageToSupabase(
  file: File,
  bucket: string = 'products',
  folder: string = 'images'
): Promise<string> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${folder}/${timestamp}_${randomStr}.${extension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    return publicUrl;
  } catch (error: any) {
    console.error('Supabase upload error:', error.message);
    throw error;
  }
}

/**
 * Delete image from Supabase Storage
 * @param url - Public URL of the image
 * @param bucket - Storage bucket name
 */
export async function deleteImageFromSupabase(
  url: string,
  bucket: string = 'products'
): Promise<void> {
  try {
    // Extract filename from URL
    const urlParts = url.split('/');
    const filename = urlParts.slice(-2).join('/'); // folder/filename

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filename]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error: any) {
    console.error('Error deleting from Supabase:', error.message);
    throw error;
  }
}

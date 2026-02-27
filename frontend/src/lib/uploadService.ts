import { API_URL } from "@/lib/config";
import { getAuthToken } from "@/lib/supabase";

export interface UploadResponse {
  url: string;
  path: string;
  filename: string;
  size: number;
  type: string;
}

/**
 * Upload image to Supabase Storage via backend
 * @param file - File object from input
 * @param type - Upload type (product, game, avatar, etc.)
 * @returns Promise with upload response containing public URL
 */
export async function uploadImage(
  file: File,
  type: string = 'product'
): Promise<UploadResponse> {
  try {
    console.log("=== UPLOADING IMAGE ===");
    console.log("File:", file.name, file.type, file.size);
    console.log("Type:", type);

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Allowed: JPG, PNG, WEBP, GIF");
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File too large. Maximum size: 5MB");
    }

    // Get auth token
    const token = await getAuthToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    console.log("Uploading to:", `${API_URL}/upload/image`);

    // Upload to backend
    const response = await fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      console.error("Upload error:", errorData);
      throw new Error(errorData.error || `Upload failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("Upload result:", result);

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Upload failed');
    }

    console.log("✅ Image uploaded successfully!");
    console.log("   URL:", result.data.url);

    return result.data;
  } catch (error: any) {
    console.error("=== UPLOAD ERROR ===");
    console.error("Error:", error);
    throw error;
  }
}

/**
 * Delete image from Supabase Storage
 * @param filePath - Path of the file in storage
 */
export async function deleteImage(filePath: string): Promise<void> {
  try {
    console.log("=== DELETING IMAGE ===");
    console.log("Path:", filePath);

    const token = await getAuthToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_URL}/upload/image/${encodeURIComponent(filePath)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Delete failed' }));
      throw new Error(errorData.error || 'Delete failed');
    }

    console.log("✅ Image deleted successfully!");
  } catch (error: any) {
    console.error("=== DELETE ERROR ===");
    console.error("Error:", error);
    throw error;
  }
}

import { API_URL } from "@/lib/config";
import { supabase } from "@/lib/supabase";

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAllReviews(): Promise<Review[]> {
  try {
    const response = await fetch(`${API_URL}/reviews`);
    if (!response.ok) {
      console.error("Failed to fetch reviews, status:", response.status);
      return [];
    }
    
    const result = await response.json();
    console.log("Reviews API response:", result);
    
    // Handle different response formats
    // Backend returns: { success: true, data: [...] }
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    
    // Fallback for direct array
    if (Array.isArray(result)) {
      return result;
    }
    
    // Fallback for { reviews: [...] }
    if (result.reviews && Array.isArray(result.reviews)) {
      return result.reviews;
    }
    
    console.warn("Unexpected reviews response format:", result);
    return [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function submitReview(
  rating: number, 
  comment: string, 
  productId?: string
): Promise<Review> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("লগইন করুন রিভিউ দিতে");
    }

    if (!rating || rating < 1 || rating > 5) {
      throw new Error("রেটিং ১ থেকে ৫ এর মধ্যে হতে হবে");
    }

    if (!comment || comment.trim().length < 3) {
      throw new Error("কমেন্ট কমপক্ষে ৩ অক্ষরের হতে হবে");
    }

    const requestBody: any = { 
      rating: parseInt(rating.toString()), 
      comment: comment.trim() 
    };

    if (productId) {
      requestBody.productId = productId;
    }

    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.details || "রিভিউ জমা দিতে ব্যর্থ");
    }

    return data;
  } catch (error: any) {
    console.error("Error submitting review:", error);
    throw error;
  }
}

export async function deleteReview(reviewId: string): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_URL}/reviews?id=${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete review");
  } catch (error: any) {
    console.error("Error deleting review:", error);
    throw error;
  }
}

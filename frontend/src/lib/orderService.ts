import { Order } from "@/lib/types";
import { supabase, getAuthToken } from "./supabase";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const createOrder = async (
  userId: string,
  userEmail: string,
  userName: string,
  orderData: any,
  product: { name: string; diamonds: number | string; price: number }
): Promise<string> => {
  try {
    // Validation
    if (!userId || !userEmail || !userName) {
      throw new Error("ইউজার তথ্য প্রয়োজন");
    }

    if (!orderData.gameId || orderData.gameId.trim().length < 3) {
      throw new Error("সঠিক Game ID দিন (কমপক্ষে ৩ অক্ষর)");
    }

    if (!orderData.paymentMethod) {
      throw new Error("পেমেন্ট মাধ্যম সিলেক্ট করুন");
    }

    if (!orderData.transactionId || orderData.transactionId.trim().length < 5) {
      throw new Error("সঠিক Transaction ID দিন (কমপক্ষে ৫ অক্ষর)");
    }

    // Get fresh token
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error("আগে লগইন করুন। Please login first.");
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        product_id: orderData.productId,
        quantity: 1,
        player_id: orderData.gameId.trim(),
        player_name: userName,
        payment_method: orderData.paymentMethod,
        transaction_id: orderData.transactionId.trim(),
        contact_phone: orderData.phoneNumber || null,
        notes: `Phone: ${orderData.phoneNumber || 'N/A'}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Order creation failed:", errorData);
      throw new Error(errorData.error || errorData.details || "অর্ডার তৈরি করতে ব্যর্থ");
    }

    const data = await response.json();
    console.log("Order created successfully:", data);
    
    // Backend returns { success: true, data: { id: "...", ... } }
    if (data.data && data.data.id) {
      return data.data.id;
    }
    
    // Fallback if structure is different
    if (data.id) {
      return data.id;
    }
    
    throw new Error("অর্ডার ID পাওয়া যায়নি");
  } catch (error: any) {
    console.error("Error creating order:", error);
    throw new Error(error.message || "অর্ডার তৈরি করতে সমস্যা হয়েছে");
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const token = await getAuthToken();
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}/orders/${orderId}`, {
      headers
    });
    
    if (!response.ok) {
      console.error("Failed to fetch order:", response.status);
      return null;
    }
    
    const result = await response.json();
    console.log("Order API response:", result);
    
    // Handle different response formats
    if (result.success && result.data) {
      return result.data;
    }
    
    if (result.data) {
      return result.data;
    }
    
    // Direct order object
    if (result.id) {
      return result;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    console.log('📡 Fetching orders for user:', userId);
    
    const token = await getAuthToken();
    if (!token) {
      console.error('❌ No auth token found');
      return [];
    }

    const response = await fetch(`${API_BASE}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Orders API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Orders API error:', errorText);
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Orders API result:', result);

    // Handle different response formats
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    } else if (Array.isArray(result)) {
      return result;
    } else {
      console.warn('⚠️ Unexpected response format:', result);
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    return [];
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"],
  adminNotes?: string
): Promise<void> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        status,
        admin_notes: adminNotes 
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to update order status" }));
      throw new Error(errorData.error || "Failed to update order status");
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const verifyOrder = async (
  orderId: string,
  verify: boolean,
  notes?: string
): Promise<void> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE}/orders/${orderId}/verify`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        verify,
        notes,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to verify order" }));
      throw new Error(errorData.error || "Failed to verify order");
    }
  } catch (error) {
    console.error("Error verifying order:", error);
    throw error;
  }
};

export const uploadPaymentProof = async (
  orderId: string,
  imageFile: File,
  paymentMethod: string,
  transactionId: string
): Promise<string> => {
  try {
    // Convert image to base64
    const reader = new FileReader();
    
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });

    const base64Data = await base64Promise;
    
    // Upload to ImgBB - API key should be in environment variable
    const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
    
    if (!IMGBB_API_KEY) {
      throw new Error("ImgBB API key not configured");
    }
    
    const formData = new FormData();
    formData.append('image', base64Data);
    
    const uploadResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("ImgBB error:", errorText);
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();
    
    if (!uploadData.success || !uploadData.data.url) {
      throw new Error("Invalid response from ImgBB");
    }

    const imageUrl = uploadData.data.url;

    // Get fresh token
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error("আগে লগইন করুন। Please login first.");
    }

    // Update order with the image URL
    const response = await fetch(`${API_BASE}/orders/${orderId}/payment-proof`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        proof_url: imageUrl,
        payment_method: paymentMethod,
        transaction_id: transactionId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update order with payment proof");
    }

    return imageUrl;
  } catch (error: any) {
    console.error("Error uploading payment proof:", error);
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Network error! Check your internet connection");
    }
    throw new Error(error.message || "Failed to upload payment proof");
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_BASE}/orders`);
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }
};

export const getPendingVerifications = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_BASE}/orders`);
    if (!response.ok) throw new Error("Failed to fetch orders");
    const orders = await response.json();
    return orders.filter((order: Order) => order.verificationStatus === "pending");
  } catch (error) {
    console.error("Error fetching pending verifications:", error);
    return [];
  }
};

export const cancelOrder = async (orderId: string): Promise<void> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error("আগে লগইন করুন। Please login first.");
    }

    const response = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to cancel order" }));
      throw new Error(errorData.error || "অর্ডার বাতিল করতে ব্যর্থ");
    }

    const result = await response.json();
    console.log("Order cancelled successfully:", result);
  } catch (error: any) {
    console.error("Error cancelling order:", error);
    throw new Error(error.message || "অর্ডার বাতিল করতে সমস্যা হয়েছে");
  }
};

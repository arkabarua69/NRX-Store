import { API_URL } from "@/lib/config";
import { getAuthToken } from "@/lib/supabase";

export async function checkAdminStatus(email: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/admin/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.isAdmin;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function getAdminStats() {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return null;
  }
}

export async function getAllOrders() {
  try {
    const token = await getAuthToken();
    console.log("=== FETCHING ALL ORDERS (ADMIN) ===");
    console.log("Token:", token ? "Present" : "Missing");
    
    if (!token) {
      console.error("❌ No token available");
      // Force logout and redirect
      window.location.href = '/login?expired=true';
      throw new Error("Please login again - session expired");
    }
    
    const response = await fetch(`${API_URL}/orders/admin/all`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    console.log("Response status:", response.status);
    
    // If 401, the session is completely invalid - force logout
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token completely invalid");
      console.log("🔄 Attempting token refresh...");
      
      // Try to refresh token one more time
      const { supabase } = await import('./supabase');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !refreshData.session) {
        console.error("❌ Token refresh failed - forcing logout");
        
        // Clear all auth data
        localStorage.clear();
        await supabase.auth.signOut();
        
        // Redirect to login
        window.location.href = '/login?expired=true';
        throw new Error("Session expired. Redirecting to login...");
      }
      
      // Retry with new token
      console.log("✅ Token refreshed, retrying request...");
      const newToken = refreshData.session.access_token;
      
      const retryResponse = await fetch(`${API_URL}/orders/admin/all`, {
        headers: {
          "Authorization": `Bearer ${newToken}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!retryResponse.ok) {
        console.error("❌ Retry failed even with fresh token");
        localStorage.clear();
        await supabase.auth.signOut();
        window.location.href = '/login?expired=true';
        throw new Error("Authentication failed. Please login again.");
      }
      
      const result = await retryResponse.json();
      if (result.data && Array.isArray(result.data)) {
        return result.data;
      }
      if (Array.isArray(result)) {
        return result;
      }
      return [];
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Response error:", errorText);
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("Orders API response:", result);
    
    // Handle paginated response: { data: [...], page: 1, total: 10 }
    if (result.data && Array.isArray(result.data)) {
      console.log("✅ Orders loaded:", result.data.length);
      return result.data;
    }
    
    // Handle direct array
    if (Array.isArray(result)) {
      console.log("✅ Orders loaded (direct array):", result.length);
      return result;
    }
    
    console.error("❌ Unexpected orders response format:", result);
    return [];
  } catch (error) {
    console.error("=== ERROR FETCHING ORDERS ===");
    console.error("Error:", error);
    
    // If it's an auth error, it's already handled above
    if (error instanceof Error && error.message.includes("Session expired")) {
      throw error;
    }
    
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string,
  updates: {
    status?: string;
    verificationStatus?: string;
    verificationNotes?: string;
    adminNotes?: string;
  }
) {
  try {
    const token = await getAuthToken();
    console.log("=== UPDATING ORDER STATUS ===");
    console.log("Order ID:", orderId);
    console.log("Updates:", updates);
    
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        status: updates.status,
        admin_notes: updates.adminNotes,
      }),
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to update order" }));
      console.error("Error response:", errorData);
      throw new Error(errorData.error || "Failed to update order");
    }
    
    const result = await response.json();
    console.log("✅ Order status updated");
    return result;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}

export async function verifyOrder(
  orderId: string,
  verify: boolean,
  notes?: string
) {
  try {
    const token = await getAuthToken();
    console.log("=== VERIFYING ORDER ===");
    console.log("Order ID:", orderId);
    console.log("Verify:", verify);
    console.log("Notes:", notes);
    
    const response = await fetch(`${API_URL}/orders/${orderId}/verify`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        verify,
        notes,
      }),
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to verify order" }));
      console.error("Error response:", errorData);
      throw new Error(errorData.error || "Failed to verify order");
    }
    
    const result = await response.json();
    console.log("✅ Order verification updated");
    return result;
  } catch (error) {
    console.error("Error verifying order:", error);
    throw error;
  }
}

export async function getAllProducts(includeInactive = false) {
  try {
    // Add cache busting parameter to force fresh data
    const timestamp = new Date().getTime();
    const url = includeInactive 
      ? `${API_URL}/products?includeInactive=true&_t=${timestamp}`
      : `${API_URL}/products?_t=${timestamp}`;
    
    console.log("=== FETCHING PRODUCTS ===");
    console.log("URL:", url);
    console.log("Include Inactive:", includeInactive);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Response error:", errorText);
      throw new Error(`Failed to fetch products: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log("Products API response:", JSON.stringify(result, null, 2));
    
    // Backend returns { success: true, data: { products: [...], summary: {...} } }
    if (result.success && result.data && result.data.products) {
      console.log("✅ Successfully parsed products:", result.data.products.length);
      console.log("Summary:", result.data.summary);
      return result.data.products;
    }
    
    // Fallback for direct array response
    if (Array.isArray(result)) {
      console.log("✅ Direct array response:", result.length);
      return result;
    }
    
    // Check if data is nested differently
    if (result.data && Array.isArray(result.data)) {
      console.log("✅ Nested array response:", result.data.length);
      return result.data;
    }
    
    console.error("❌ Unexpected products response format:", result);
    console.error("Result keys:", Object.keys(result));
    return [];
  } catch (error) {
    console.error("=== ERROR FETCHING PRODUCTS ===");
    console.error("Error:", error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    return [];
  }
}

export async function createProduct(product: any) {
  try {
    console.log("=== CREATE PRODUCT API CALL ===");
    console.log("Input product data:", product);
    
    const token = await getAuthToken();
    console.log("Auth token:", token ? "Present" : "Missing");
    
    if (!token) {
      throw new Error("Authentication required. Please log in again.");
    }
    
    // Map frontend data to backend schema
    const backendData = {
      game_id: product.gameId || product.game_id || "00000000-0000-0000-0000-000000000001", // Default game ID if not provided
      name: product.name,
      description: product.description || "",
      price: Number(product.price),
      original_price: product.originalPrice ? Number(product.originalPrice) : null,
      currency: product.currency || "BDT",
      stock: product.stock || 999,
      is_featured: product.isFeatured || product.is_featured || false,
      is_active: product.isActive !== false ? true : product.isActive, // Default to true
      image_url: product.image || product.imageUrl || product.image_url || null, // Add image URL
      diamonds: product.diamonds || 0, // Add diamonds field
      category: product.category || 'standard', // Add category field
    };
    
    console.log("Mapped backend data:", backendData);
    console.log("API endpoint:", `${API_URL}/admin/products`);
    
    const response = await fetch(`${API_URL}/admin/products`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(backendData),
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to create product" }));
      console.error("Error response:", errorData);
      throw new Error(errorData.error || errorData.message || "Failed to create product");
    }
    
    const result = await response.json();
    console.log("Success response:", result);
    console.log("=== CREATE PRODUCT SUCCESS ===");
    return result;
  } catch (error) {
    console.error("=== CREATE PRODUCT ERROR ===");
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function updateProduct(productId: string, updates: any) {
  try {
    console.log("=== UPDATE PRODUCT API CALL ===");
    console.log("Product ID:", productId);
    console.log("Updates:", updates);
    
    const token = await getAuthToken();
    console.log("Auth token:", token ? "Present" : "Missing");
    
    if (!token) {
      throw new Error("Authentication required. Please log in again.");
    }
    
    // Map frontend data to backend schema
    const backendData: any = {};
    
    if (updates.name) backendData.name = updates.name;
    if (updates.description !== undefined) backendData.description = updates.description;
    if (updates.price !== undefined) backendData.price = Number(updates.price);
    if (updates.originalPrice !== undefined) backendData.original_price = updates.originalPrice ? Number(updates.originalPrice) : null;
    if (updates.currency) backendData.currency = updates.currency;
    if (updates.stock !== undefined) backendData.stock = updates.stock;
    if (updates.isFeatured !== undefined) backendData.is_featured = updates.isFeatured;
    if (updates.is_featured !== undefined) backendData.is_featured = updates.is_featured;
    if (updates.isActive !== undefined) backendData.is_active = updates.isActive;
    if (updates.is_active !== undefined) backendData.is_active = updates.is_active;
    if (updates.gameId) backendData.game_id = updates.gameId;
    if (updates.game_id) backendData.game_id = updates.game_id;
    if (updates.image || updates.imageUrl || updates.image_url) {
      backendData.image_url = updates.image || updates.imageUrl || updates.image_url;
    }
    if (updates.diamonds !== undefined) backendData.diamonds = updates.diamonds; // Add diamonds field
    
    console.log("Mapped backend data:", backendData);
    
    const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(backendData),
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to update product" }));
      console.error("Error response:", errorData);
      throw new Error(errorData.error || errorData.message || "Failed to update product");
    }
    
    const result = await response.json();
    console.log("Success response:", result);
    console.log("=== UPDATE PRODUCT SUCCESS ===");
    return result;
  } catch (error) {
    console.error("=== UPDATE PRODUCT ERROR ===");
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProduct(productId: string, hardDelete = false) {
  try {
    console.log("=== DELETE PRODUCT API CALL ===");
    console.log("Product ID:", productId);
    console.log("Hard delete:", hardDelete);
    
    const token = await getAuthToken();
    console.log("Auth token:", token ? "Present" : "Missing");
    
    if (!token) {
      throw new Error("Authentication required. Please log in again.");
    }
    
    const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to delete product" }));
      console.error("Error response:", error);
      throw new Error(error.error || error.message || "Failed to delete product");
    }
    
    const result = await response.json();
    console.log("Success response:", result);
    console.log("=== DELETE PRODUCT SUCCESS ===");
    return result;
  } catch (error) {
    console.error("=== DELETE PRODUCT ERROR ===");
    console.error("Error deleting product:", error);
    throw error;
  }
}

export async function duplicateProduct(productId: string, modifications?: any) {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("Authentication required. Please log in again.");
    }
    
    const response = await fetch(`${API_URL}/admin/products/duplicate`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, modifications }),
    });
    if (!response.ok) throw new Error("Failed to duplicate product");
    return response.json();
  } catch (error) {
    console.error("Error duplicating product:", error);
    throw error;
  }
}

export async function bulkProductAction(action: string, productIds: string[]) {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("Authentication required. Please log in again.");
    }
    
    const response = await fetch(`${API_URL}/admin/products/bulk`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ action, productIds }),
    });
    if (!response.ok) throw new Error("Failed to perform bulk action");
    return response.json();
  } catch (error) {
    console.error("Error performing bulk action:", error);
    throw error;
  }
}

export async function getSettings() {
  try {
    console.log("=== FETCHING SETTINGS ===");
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/settings`, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
      },
    });
    
    console.log("Settings response status:", response.status);
    
    if (!response.ok) throw new Error("Failed to fetch settings");
    const result = await response.json();
    
    console.log("✅ Settings loaded:", result);
    
    return result.data || result;
  } catch (error) {
    console.error("❌ Error fetching settings:", error);
    return null;
  }
}

export async function updateSettings(updates: any) {
  try {
    console.log("=== UPDATING SETTINGS ===");
    console.log("Updates:", updates);
    
    const token = await getAuthToken();
    if (!token) {
      throw new Error("Authentication required. Please log in again.");
    }
    
    const response = await fetch(`${API_URL}/settings`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    
    console.log("Update response status:", response.status);
    
    if (!response.ok) throw new Error("Failed to update settings");
    const result = await response.json();
    
    console.log("✅ Settings updated:", result);
    
    return result.data || result;
  } catch (error) {
    console.error("❌ Error updating settings:", error);
    throw error;
  }
}


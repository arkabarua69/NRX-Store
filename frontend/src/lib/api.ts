import { supabase, getAuthToken } from './supabase';

// Remove trailing slash to prevent double slashes in URLs
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// Generic API helper (for backward compatibility)
export const api = {
  get: async <T = any>(endpoint: string): Promise<T> => {
    return apiCall(endpoint, { method: 'GET' });
  },
  post: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    return apiCall(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  put: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    return apiCall(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  patch: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    return apiCall(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  delete: async <T = any>(endpoint: string, options?: RequestInit): Promise<T> => {
    return apiCall(endpoint, {
      method: 'DELETE',
      ...options,
    });
  },
};

// ==================== AUTH API ====================

export const authAPI = {
  register: async (email: string, password: string, fullName: string) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
  },

  login: async (email: string, password: string) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return apiCall('/auth/logout', { method: 'POST' });
  },

  getCurrentUser: async () => {
    return apiCall('/auth/me');
  },
};

// ==================== PRODUCTS API ====================

export const productsAPI = {
  getAll: async (params?: {
    game_id?: string;
    is_featured?: boolean;
    search?: string;
    page?: number;
    page_size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiCall(`/products?${queryParams.toString()}`);
  },

  getById: async (id: string) => {
    return apiCall(`/products/${id}`);
  },

  getFeatured: async (limit = 10) => {
    return apiCall(`/products/featured?limit=${limit}`);
  },

  // Direct Supabase queries for real-time
  subscribeToProducts: (callback: (products: any[]) => void) => {
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'topup_packages',
        },
        () => {
          // Refetch products when changes occur
          productsAPI.getAll().then((response) => {
            callback(response.data || []);
          });
        }
      )
      .subscribe();

    // Initial fetch
    productsAPI.getAll().then((response) => {
      callback(response.data || []);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  },
};

// ==================== ORDERS API ====================

export const ordersAPI = {
  create: async (orderData: {
    product_id: string;
    quantity: number;
    player_id: string;
    player_name?: string;
    contact_email?: string;
    contact_phone?: string;
    notes?: string;
  }) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getMyOrders: async (page = 1, pageSize = 20) => {
    return apiCall(`/orders?page=${page}&page_size=${pageSize}`);
  },

  getById: async (id: string) => {
    return apiCall(`/orders/${id}`);
  },

  uploadPaymentProof: async (orderId: string, file: File) => {
    const formData = new FormData();
    formData.append('payment_proof', file);

    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/payment-proof`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    return response.json();
  },
};

// ==================== ADMIN API ====================

export const adminAPI = {
  // Orders Management
  getAllOrders: async (params?: {
    status?: string;
    page?: number;
    page_size?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiCall(`/admin/orders?${queryParams.toString()}`);
  },

  updateOrderStatus: async (orderId: string, status: string, adminNotes?: string) => {
    return apiCall(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, admin_notes: adminNotes }),
    });
  },

  // Games Management
  createGame: async (gameData: {
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    category: string;
    is_active?: boolean;
  }) => {
    return apiCall('/admin/games', {
      method: 'POST',
      body: JSON.stringify(gameData),
    });
  },

  updateGame: async (gameId: string, gameData: any) => {
    return apiCall(`/admin/games/${gameId}`, {
      method: 'PUT',
      body: JSON.stringify(gameData),
    });
  },

  deleteGame: async (gameId: string) => {
    return apiCall(`/admin/games/${gameId}`, {
      method: 'DELETE',
    });
  },

  // Products Management
  createProduct: async (productData: {
    game_id: string;
    name: string;
    description?: string;
    price: number;
    original_price?: number;
    currency?: string;
    stock?: number;
    is_featured?: boolean;
    is_active?: boolean;
  }) => {
    return apiCall('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (productId: string, productData: any) => {
    return apiCall(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (productId: string) => {
    return apiCall(`/admin/products/${productId}`, {
      method: 'DELETE',
    });
  },

  // Analytics
  getAnalytics: async () => {
    return apiCall('/admin/analytics');
  },
};

// ==================== GAMES API ====================

export const gamesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },
};

// ==================== NOTIFICATIONS API ====================

export const notificationsAPI = {
  getAll: async (params?: {
    unread_only?: boolean;
    important_only?: boolean;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.unread_only) queryParams.append('unread_only', 'true');
    if (params?.important_only) queryParams.append('important_only', 'true');
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return apiCall(`/notifications${query ? `?${query}` : ''}`);
  },

  markAsRead: async (notificationId: string) => {
    return apiCall(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  markAllAsRead: async () => {
    return apiCall('/notifications/mark-all-read', {
      method: 'PUT',
    });
  },

  delete: async (notificationId: string) => {
    return apiCall(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },

  clearAll: async () => {
    return apiCall('/notifications/clear-all', {
      method: 'DELETE',
    });
  },
};

// ==================== ADMIN NOTIFICATIONS API ====================

export const adminNotificationsAPI = {
  getAll: async (params?: {
    unread_only?: boolean;
    important_only?: boolean;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.unread_only) queryParams.append('unread_only', 'true');
    if (params?.important_only) queryParams.append('important_only', 'true');
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return apiCall(`/admin/notifications${query ? `?${query}` : ''}`);
  },

  getStats: async () => {
    return apiCall('/admin/notifications/stats');
  },

  markAsRead: async (notificationId: string) => {
    return apiCall(`/admin/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  markAllAsRead: async () => {
    return apiCall('/admin/notifications/mark-all-read', {
      method: 'PUT',
    });
  },

  delete: async (notificationId: string) => {
    return apiCall(`/admin/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },

  clearAll: async () => {
    return apiCall('/admin/notifications/clear-all', {
      method: 'DELETE',
    });
  },
};

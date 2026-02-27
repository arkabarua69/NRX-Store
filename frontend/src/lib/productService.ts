// Product Service - Real-time Product Management
// Handles all product-related API calls with auto-refresh

import { Product } from '@/lib/types';
import { API_URL } from '@/lib/config';

export type { Product };

export interface ProductSummary {
  total: number;
  active: number;
  inactive: number;
  showing: number;
}

export interface ProductsResponse {
  products: Product[];
  summary: ProductSummary;
}

// Get all active products (for Store frontend)
export async function getActiveProducts(): Promise<ProductsResponse> {
  try {
    const response = await fetch(`${API_URL}/products?onlyActive=true`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const json = await response.json();
    
    // Handle both response formats
    if (json.data) {
      // New format: { data: { products: [], summary: {} } }
      return {
        products: json.data.products || [],
        summary: json.data.summary || {
          total: 0,
          active: 0,
          inactive: 0,
          showing: 0
        }
      };
    } else if (json.products) {
      // Old format: { products: [], summary: {} }
      return {
        products: json.products || [],
        summary: json.summary || {
          total: 0,
          active: 0,
          inactive: 0,
          showing: 0
        }
      };
    }
    
    // Fallback
    return {
      products: [],
      summary: {
        total: 0,
        active: 0,
        inactive: 0,
        showing: 0
      }
    };
  } catch (error) {
    console.error('Error fetching active products:', error);
    // Return empty response on error
    return {
      products: [],
      summary: {
        total: 0,
        active: 0,
        inactive: 0,
        showing: 0
      }
    };
  }
}

// Get all inactive products (for Admin dashboard)
export async function getInactiveProducts(): Promise<ProductsResponse> {
  const response = await fetch(`${API_URL}/products?onlyInactive=true`);
  return await response.json();
}

// Get all products (active + inactive) for Admin
export async function getAllProducts(): Promise<ProductsResponse> {
  const response = await fetch(`${API_URL}/products?includeInactive=true`);
  return await response.json();
}

// Toggle product active status
export async function toggleProductStatus(
  productId: string,
  isActive: boolean
): Promise<{ product: Product; message: string }> {
  const response = await fetch(`${API_URL}/products/toggle-status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, isActive })
  });
  return await response.json();
}

// Create new product (always active by default)
export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...productData, isActive: true })
  });
  return await response.json();
}

// Update product
export async function updateProduct(
  productId: string,
  updates: Partial<Product>
): Promise<Product> {
  const response = await fetch(`${API_URL}/products`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: productId, ...updates })
  });
  return await response.json();
}

// Delete product (soft delete by default)
export async function deleteProduct(
  productId: string,
  hardDelete: boolean = false
): Promise<{ success: boolean; deleted: string }> {
  const response = await fetch(`${API_URL}/products`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: productId, hardDelete })
  });
  return await response.json();
}

// Real-time polling helper
export class ProductPoller {
  private intervalId: number | null = null;
  private callback: (products: ProductsResponse) => void;
  private filter: 'active' | 'inactive' | 'all';
  private intervalMs: number;

  constructor(
    callback: (products: ProductsResponse) => void,
    filter: 'active' | 'inactive' | 'all' = 'active',
    intervalMs: number = 5000 // 5 seconds default
  ) {
    this.callback = callback;
    this.filter = filter;
    this.intervalMs = intervalMs;
  }

  start() {
    // Fetch immediately
    this.fetch();

    // Then poll at interval
    this.intervalId = window.setInterval(() => {
      this.fetch();
    }, this.intervalMs);
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async fetch() {
    try {
      let response: ProductsResponse;

      if (this.filter === 'active') {
        response = await getActiveProducts();
      } else if (this.filter === 'inactive') {
        response = await getInactiveProducts();
      } else {
        response = await getAllProducts();
      }

      this.callback(response);
    } catch (error) {
      console.error('Product polling error:', error);
    }
  }
}

// Helper to format product for display
export function formatProduct(product: Product) {
  return {
    ...product,
    formattedPrice: `৳${product.price.toLocaleString()}`,
    formattedDiamonds: product.diamonds === 0 ? 'Membership' : `${product.diamonds} 💎`,
    statusBadge: product.is_active ? 'Active' : 'Inactive',
    statusColor: product.is_active ? 'green' : 'red',
  };
}

// Get product by ID
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${productId}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    
    // Handle both direct product and wrapped response
    if (data.data) {
      return data.data;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Subscribe to product updates
export function subscribeToProducts(callback: (products: Product[]) => void) {
  // Try to fetch products immediately
  const fetchProducts = async () => {
    try {
      const response = await getActiveProducts();
      if (response && response.products) {
        callback(response.products);
      } else {
        // If no products, return empty array
        callback([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return empty array on error
      callback([]);
    }
  };

  // Fetch immediately
  fetchProducts();

  // Set up polling every 30 seconds (less aggressive)
  const intervalId = setInterval(fetchProducts, 30000);

  // Return cleanup function
  return () => clearInterval(intervalId);
}

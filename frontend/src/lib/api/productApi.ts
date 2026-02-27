import { Product } from "@/lib/types";
import { API_URL, API_BASE } from "@/lib/config";

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function addProduct(product: Omit<Product, "id">): Promise<string> {
  const response = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error("Failed to add product");
  const data = await response.json();
  return data.id;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const response = await fetch(`${API_BASE}/products`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
  if (!response.ok) throw new Error("Failed to update product");
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/products`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) throw new Error("Failed to delete product");
}

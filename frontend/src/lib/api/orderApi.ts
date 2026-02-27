import { Order, OrderCreateRequest } from "@/lib/types";
import { API_URL, API_BASE } from "@/lib/config";

export async function fetchOrders(userId?: string, status?: string): Promise<Order[]> {
  const params = new URLSearchParams();
  if (userId) params.append("userId", userId);
  if (status) params.append("status", status);
  
  const response = await fetch(`${API_URL}/orders?${params}`);
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
}

export async function createOrder(orderData: OrderCreateRequest & {
  userId: string;
  userEmail: string;
  userName: string;
  productName: string;
  diamonds: number | string;
  price: number;
}): Promise<string> {
  const response = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error("Failed to create order");
  const data = await response.json();
  return data.orderId;
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  adminNotes?: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/orders`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: orderId, status, adminNotes }),
  });
  if (!response.ok) throw new Error("Failed to update order");
}

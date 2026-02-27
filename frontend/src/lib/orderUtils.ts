import { Order } from "./types";

/**
 * Normalize order data from backend to match frontend expectations
 * Handles both snake_case (database) and camelCase (frontend) field names
 */
export function normalizeOrder(order: any): Order {
  return {
    // Core fields
    id: order.id,
    user_id: order.user_id,
    product_id: order.product_id,
    
    // Product info
    productName: order.product_name || order.productName || "Unknown Product",
    product_name: order.product_name,
    product_name_bn: order.product_name_bn,
    diamonds: order.diamonds || 0,
    product_image: order.product_image || order.image_url,
    
    // Game info
    gameName: order.game_name || order.gameName || "Unknown Game",
    game_name: order.game_name,
    game_name_bn: order.game_name_bn,
    
    // Order details
    quantity: order.quantity || 1,
    unit_price: order.unit_price || 0,
    price: order.total_amount || order.price || 0,
    total_amount: order.total_amount || order.price || 0,
    currency: order.currency || "BDT",
    
    // Player info
    gameId: order.player_id || order.gameId || "",
    player_id: order.player_id || "",
    player_name: order.player_name,
    server_id: order.server_id,
    
    // Contact info
    contact_email: order.contact_email || order.user_email,
    contact_phone: order.contact_phone,
    userEmail: order.user_email || order.contact_email || "Unknown",
    userName: order.user_name || order.userName || "Unknown User",
    phoneNumber: order.contact_phone || order.phoneNumber || "",
    
    // Payment info
    payment_method: order.payment_method,
    paymentMethod: order.payment_method || order.paymentMethod || "Unknown",
    payment_account: order.payment_account,
    payment_proof_url: order.payment_proof_url,
    paymentProofImage: order.payment_proof_url || order.paymentProofImage,
    transaction_id: order.transaction_id,
    transactionId: order.transaction_id || order.transactionId || "",
    
    // Status
    status: order.status || "pending",
    payment_status: order.payment_status,
    paymentStatus: order.payment_status || order.paymentStatus,
    delivery_status: order.delivery_status,
    
    // Verification
    verification_status: order.verification_status || "pending",
    verificationStatus: order.verification_status || order.verificationStatus || "pending",
    verification_notes: order.verification_notes,
    verificationNotes: order.verification_notes || order.verificationNotes,
    verified_at: order.verified_at,
    verified_by: order.verified_by,
    
    // Delivery
    delivery_notes: order.delivery_notes,
    delivered_at: order.delivered_at,
    
    // Notes
    notes: order.notes,
    admin_notes: order.admin_notes,
    adminNotes: order.admin_notes || order.adminNotes,
    
    // Topup status
    topupStatus: order.topupStatus || order.topup_status,
    topupMessage: order.topupMessage || order.topup_message,
    topupAttempts: order.topupAttempts || order.topup_attempts || 0,
    
    // Timestamps
    createdAt: order.created_at || order.createdAt,
    created_at: order.created_at || order.createdAt,
    updatedAt: order.updated_at || order.updatedAt,
    updated_at: order.updated_at || order.updatedAt,
    completed_at: order.completed_at,
    
    // Order number
    orderNumber: order.orderNumber || order.order_number || order.id.slice(0, 8).toUpperCase(),
  };
}

/**
 * Normalize array of orders
 */
export function normalizeOrders(orders: any[]): Order[] {
  if (!Array.isArray(orders)) {
    console.warn("normalizeOrders: input is not an array", orders);
    return [];
  }
  return orders.map(normalizeOrder);
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    completed: "bg-green-100 text-green-700 border-green-200",
    processing: "bg-blue-100 text-blue-700 border-blue-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    failed: "bg-red-100 text-red-700 border-red-200",
    cancelled: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
}

/**
 * Get verification status badge color
 */
export function getVerificationColor(status: string): string {
  const colors: Record<string, string> = {
    verified: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };
  return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
}

/**
 * Format order date safely
 */
export function formatOrderDate(dateString: string | undefined): Date {
  if (!dateString) return new Date();
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date;
}

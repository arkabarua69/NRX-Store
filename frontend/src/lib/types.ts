// Product Type
export interface Product {
  id: string;
  name: string;
  nameBn?: string;
  name_bn?: string;
  description?: string;
  descriptionBn?: string;
  description_bn?: string;
  price: number;
  originalPrice?: number;
  diamonds: number | string;
  image: string;
  imageUrl?: string;
  image_url?: string;
  category: string;
  isFeatured?: boolean;
  is_featured?: boolean;
  badge?: string;
  soldCount?: number;
  sold_count?: number;
  viewCount?: number;
  view_count?: number;
  rating: number;
  reviewCount?: number;
  stock?: number;
  stockStatus?: string;
  stock_status?: string;
  isMembership?: boolean;
  gameName?: string;
  game_name?: string;
  gameId?: string;
  game_id?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  isActive?: boolean;
  is_active?: boolean;
}

// Order Type
export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  
  // Product info (enriched from backend)
  productName?: string;
  product_name?: string;
  product_name_bn?: string;
  diamonds?: number;
  product_image?: string;
  
  // Game info (enriched from backend)
  gameName?: string;
  game_name?: string;
  game_name_bn?: string;
  
  // Order details
  quantity: number;
  unit_price: number;
  price?: number; // Alias for total_amount
  total_amount: number;
  currency?: string;
  
  // Player info
  gameId?: string; // Alias for player_id
  player_id: string;
  player_name?: string;
  server_id?: string;
  
  // Contact info
  contact_email?: string;
  contact_phone?: string;
  userEmail?: string; // Alias for contact_email
  userName?: string; // From user metadata
  phoneNumber?: string; // Alias for contact_phone
  
  // Payment info
  payment_method?: string;
  paymentMethod?: string;
  payment_account?: string;
  payment_proof_url?: string;
  paymentProofImage?: string; // Alias for payment_proof_url
  transaction_id?: string;
  transactionId?: string;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
  payment_status?: 'pending' | 'paid' | 'verified' | 'failed';
  paymentStatus?: 'pending' | 'paid' | 'verified' | 'failed';
  delivery_status?: 'pending' | 'processing' | 'delivered' | 'failed';
  
  // Verification
  verification_status?: 'pending' | 'verified' | 'rejected';
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  verification_notes?: string;
  verificationNotes?: string;
  verified_at?: string;
  verified_by?: string;
  
  // Delivery
  delivery_notes?: string;
  delivered_at?: string;
  
  // Notes
  notes?: string;
  admin_notes?: string;
  adminNotes?: string;
  
  // Topup status (if applicable)
  topupStatus?: 'pending' | 'completed' | 'failed';
  topupMessage?: string;
  topupAttempts?: number;
  
  // Timestamps
  createdAt?: string;
  created_at: string;
  updatedAt?: string;
  updated_at?: string;
  completed_at?: string;
  
  // Order number (generated)
  orderNumber?: string;
}

// Order Create Request
export interface OrderCreateRequest {
  product_id: string;
  quantity?: number;
  player_id: string;
  player_name?: string;
  notes?: string;
}

export interface OrderVerificationRequest {
  verify: boolean;
  notes?: string;
}


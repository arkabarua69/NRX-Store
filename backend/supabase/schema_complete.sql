-- ============================================
-- NRX Diamond Store - Complete Database Schema
-- ============================================
-- Version: 2.0
-- Date: 2025
-- Description: Complete schema with all tables, indexes, RLS policies, and triggers
-- ============================================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS topup_packages CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLE: user_profiles
-- ============================================
-- Extended user information beyond auth.users
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Bangladesh',
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: games
-- ============================================
-- Available games for top-up
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100), -- Bengali name
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    description_bn TEXT, -- Bengali description
    image_url TEXT, -- Game logo/icon
    banner_url TEXT, -- Banner image for game page
    category VARCHAR(50) NOT NULL CHECK (category IN ('budget', 'standard', 'premium', 'membership')),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    meta_title VARCHAR(200),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: topup_packages
-- ============================================
-- Top-up packages/products for each game
CREATE TABLE topup_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    
    -- Basic Information
    name VARCHAR(200) NOT NULL,
    name_bn VARCHAR(200), -- Bengali name
    description TEXT,
    description_bn TEXT, -- Bengali description
    
    -- Pricing
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10, 2) CHECK (original_price >= 0),
    currency VARCHAR(3) DEFAULT 'BDT',
    discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    
    -- Product Details
    diamonds INTEGER DEFAULT 0, -- For diamond packages
    validity_days INTEGER, -- For membership packages
    image_url TEXT, -- Product-specific image
    
    -- Inventory
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    stock_status VARCHAR(20) DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
    
    -- Display & Marketing
    badge VARCHAR(50), -- e.g., "HOT", "BEST VALUE", "NEW"
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    
    -- Stats
    view_count INTEGER DEFAULT 0,
    sold_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    
    -- SEO
    meta_title VARCHAR(200),
    meta_description TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: orders
-- ============================================
-- Customer orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User Information
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Order Details
    product_id UUID NOT NULL REFERENCES topup_packages(id),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    currency VARCHAR(3) DEFAULT 'BDT',
    
    -- Order Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    
    -- Game Account Information
    player_id VARCHAR(100) NOT NULL, -- Game account ID
    player_name VARCHAR(100),
    server_id VARCHAR(50), -- For games with multiple servers
    
    -- Contact Information
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    -- Payment Information
    payment_method VARCHAR(50), -- e.g., "bkash", "nagad", "rocket"
    payment_account VARCHAR(100), -- Customer's payment account number
    payment_proof_url TEXT, -- Screenshot of payment
    transaction_id VARCHAR(100), -- Payment gateway transaction ID
    
    -- Verification
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verification_notes TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    
    -- Delivery
    delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'processing', 'delivered', 'failed')),
    delivery_notes TEXT,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Additional Information
    notes TEXT, -- Customer notes
    admin_notes TEXT, -- Internal admin notes
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- TABLE: transactions
-- ============================================
-- Payment transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Transaction Details
    type VARCHAR(50) NOT NULL, -- e.g., "payment", "refund"
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(3) DEFAULT 'BDT',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'cancelled')),
    
    -- Payment Gateway Information
    payment_gateway VARCHAR(50), -- e.g., "bkash", "nagad", "stripe"
    gateway_transaction_id VARCHAR(100),
    gateway_response JSONB,
    
    -- Additional Data
    metadata JSONB DEFAULT '{}',
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- TABLE: admin_logs
-- ============================================
-- Admin activity logs
CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Action Details
    action VARCHAR(100) NOT NULL, -- e.g., "order_verified", "product_updated"
    target_type VARCHAR(50), -- e.g., "order", "product", "user"
    target_id UUID,
    
    -- Change Details
    old_values JSONB,
    new_values JSONB,
    details JSONB DEFAULT '{}',
    
    -- Request Information
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- User Profiles
CREATE INDEX idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at DESC);

-- Games
CREATE INDEX idx_games_category ON games(category);
CREATE INDEX idx_games_slug ON games(slug);
CREATE INDEX idx_games_is_active ON games(is_active);
CREATE INDEX idx_games_is_featured ON games(is_featured);
CREATE INDEX idx_games_sort_order ON games(sort_order);
CREATE INDEX idx_games_created_at ON games(created_at DESC);

-- Topup Packages
CREATE INDEX idx_topup_packages_game_id ON topup_packages(game_id);
CREATE INDEX idx_topup_packages_is_featured ON topup_packages(is_featured);
CREATE INDEX idx_topup_packages_is_active ON topup_packages(is_active);
CREATE INDEX idx_topup_packages_price ON topup_packages(price);
CREATE INDEX idx_topup_packages_stock_status ON topup_packages(stock_status);
CREATE INDEX idx_topup_packages_sort_order ON topup_packages(sort_order);
CREATE INDEX idx_topup_packages_created_at ON topup_packages(created_at DESC);
CREATE INDEX idx_topup_packages_image_url ON topup_packages(image_url);
CREATE INDEX idx_topup_packages_rating ON topup_packages(rating DESC);
CREATE INDEX idx_topup_packages_sold_count ON topup_packages(sold_count DESC);

-- Orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_verification_status ON orders(verification_status);
CREATE INDEX idx_orders_delivery_status ON orders(delivery_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_player_id ON orders(player_id);
CREATE INDEX idx_orders_contact_email ON orders(contact_email);
CREATE INDEX idx_orders_transaction_id ON orders(transaction_id);

-- Transactions
CREATE INDEX idx_transactions_order_id ON transactions(order_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_gateway_transaction_id ON transactions(gateway_transaction_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Admin Logs
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_target_type ON admin_logs(target_type);
CREATE INDEX idx_admin_logs_target_id ON admin_logs(target_id);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topup_packages_updated_at BEFORE UPDATE ON topup_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update stock status based on stock level
CREATE OR REPLACE FUNCTION update_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock = 0 THEN
        NEW.stock_status = 'out_of_stock';
    ELSIF NEW.stock <= 10 THEN
        NEW.stock_status = 'low_stock';
    ELSE
        NEW.stock_status = 'in_stock';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_topup_packages_stock_status BEFORE INSERT OR UPDATE OF stock ON topup_packages
    FOR EACH ROW EXECUTE FUNCTION update_stock_status();

-- Function to update product sold count when order is completed
CREATE OR REPLACE FUNCTION update_product_sold_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        UPDATE topup_packages 
        SET sold_count = sold_count + NEW.quantity,
            stock = GREATEST(0, stock - NEW.quantity)
        WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_stats_on_order_complete AFTER INSERT OR UPDATE OF status ON orders
    FOR EACH ROW EXECUTE FUNCTION update_product_sold_count();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE topup_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: user_profiles
-- ============================================

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- ============================================
-- RLS POLICIES: games
-- ============================================

-- Games are viewable by everyone
CREATE POLICY "Games are viewable by everyone" ON games
    FOR SELECT USING (true);

-- Only admins can insert/update/delete games
CREATE POLICY "Admins can insert games" ON games
    FOR INSERT WITH CHECK (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

CREATE POLICY "Admins can update games" ON games
    FOR UPDATE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

CREATE POLICY "Admins can delete games" ON games
    FOR DELETE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- ============================================
-- RLS POLICIES: topup_packages
-- ============================================

-- Packages are viewable by everyone
CREATE POLICY "Packages are viewable by everyone" ON topup_packages
    FOR SELECT USING (true);

-- Only admins can insert/update/delete packages
CREATE POLICY "Admins can insert packages" ON topup_packages
    FOR INSERT WITH CHECK (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

CREATE POLICY "Admins can update packages" ON topup_packages
    FOR UPDATE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

CREATE POLICY "Admins can delete packages" ON topup_packages
    FOR DELETE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- ============================================
-- RLS POLICIES: orders
-- ============================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (
        auth.uid() = user_id OR
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- Users can create their own orders
CREATE POLICY "Users can create own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending orders
CREATE POLICY "Users can update own pending orders" ON orders
    FOR UPDATE USING (
        auth.uid() = user_id AND status = 'pending' OR
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- Admins can update any order
CREATE POLICY "Admins can update any order" ON orders
    FOR UPDATE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- ============================================
-- RLS POLICIES: transactions
-- ============================================

-- Users can view transactions for their own orders
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = transactions.order_id
            AND orders.user_id = auth.uid()
        ) OR
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- System can insert transactions
CREATE POLICY "System can insert transactions" ON transactions
    FOR INSERT WITH CHECK (true);

-- Admins can update transactions
CREATE POLICY "Admins can update transactions" ON transactions
    FOR UPDATE USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- ============================================
-- RLS POLICIES: admin_logs
-- ============================================

-- Only admins can view logs
CREATE POLICY "Admins can view logs" ON admin_logs
    FOR SELECT USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- Only admins can insert logs
CREATE POLICY "Admins can insert logs" ON admin_logs
    FOR INSERT WITH CHECK (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- ============================================
-- VIEWS
-- ============================================

-- View for product statistics
CREATE OR REPLACE VIEW product_stats AS
SELECT 
    tp.id,
    tp.name,
    tp.price,
    tp.stock,
    tp.sold_count,
    tp.view_count,
    tp.rating,
    tp.review_count,
    g.name as game_name,
    COUNT(DISTINCT o.id) as order_count,
    SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END) as total_revenue
FROM topup_packages tp
LEFT JOIN games g ON tp.game_id = g.id
LEFT JOIN orders o ON tp.id = o.product_id
GROUP BY tp.id, tp.name, tp.price, tp.stock, tp.sold_count, tp.view_count, tp.rating, tp.review_count, g.name;

-- View for order summary
CREATE OR REPLACE VIEW order_summary AS
SELECT 
    o.id,
    o.created_at,
    o.status,
    o.payment_status,
    o.total_amount,
    o.player_id,
    u.email as user_email,
    tp.name as product_name,
    g.name as game_name
FROM orders o
LEFT JOIN auth.users u ON o.user_id = u.id
LEFT JOIN topup_packages tp ON o.product_id = tp.id
LEFT JOIN games g ON tp.game_id = g.id;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to get admin statistics
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_orders', (SELECT COUNT(*) FROM orders),
        'pending_orders', (SELECT COUNT(*) FROM orders WHERE status = 'pending'),
        'completed_orders', (SELECT COUNT(*) FROM orders WHERE status = 'completed'),
        'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'completed'),
        'total_products', (SELECT COUNT(*) FROM topup_packages),
        'active_products', (SELECT COUNT(*) FROM topup_packages WHERE is_active = true),
        'total_games', (SELECT COUNT(*) FROM games),
        'active_games', (SELECT COUNT(*) FROM games WHERE is_active = true),
        'total_users', (SELECT COUNT(*) FROM auth.users),
        'today_orders', (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE),
        'today_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE DATE(created_at) = CURRENT_DATE AND status = 'completed')
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Database schema created successfully!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '  - user_profiles';
    RAISE NOTICE '  - games';
    RAISE NOTICE '  - topup_packages (with image_url)';
    RAISE NOTICE '  - orders';
    RAISE NOTICE '  - transactions';
    RAISE NOTICE '  - admin_logs';
    RAISE NOTICE '';
    RAISE NOTICE 'Features:';
    RAISE NOTICE '  - All tables use UUID for primary keys';
    RAISE NOTICE '  - Row Level Security (RLS) enabled';
    RAISE NOTICE '  - Automatic timestamps with triggers';
    RAISE NOTICE '  - Stock management with triggers';
    RAISE NOTICE '  - Comprehensive indexes for performance';
    RAISE NOTICE '  - Admin statistics function';
    RAISE NOTICE '  - Product and order views';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '  1. Run seed.sql to insert sample data';
    RAISE NOTICE '  2. Set admin role for your user:';
    RAISE NOTICE '     UPDATE auth.users SET raw_user_meta_data = ';
    RAISE NOTICE '     raw_user_meta_data || ''{"role": "admin"}''::jsonb';
    RAISE NOTICE '     WHERE email = ''your-email@example.com'';';
    RAISE NOTICE '============================================';
END $$;

-- ============================================
-- ORDER SUMMARY VIEW
-- ============================================
-- This view provides a comprehensive summary of orders
-- with all related information for admin dashboard
-- ============================================

CREATE OR REPLACE VIEW order_summary AS
SELECT 
    -- Order basic info
    o.id,
    o.user_id,
    o.product_id,
    o.quantity,
    o.unit_price,
    o.total_amount,
    o.currency,
    o.status,
    o.payment_status,
    o.delivery_status,
    
    -- Player info
    o.player_id,
    o.player_name,
    o.server_id,
    
    -- Contact info
    o.contact_email,
    o.contact_phone,
    
    -- Payment info
    o.payment_method,
    o.payment_account,
    o.payment_proof_url,
    o.transaction_id,
    
    -- Verification info
    o.verification_status,
    o.verification_notes,
    o.verified_at,
    o.verified_by,
    
    -- Delivery info
    o.delivery_notes,
    o.delivered_at,
    
    -- Notes
    o.notes,
    o.admin_notes,
    
    -- Timestamps
    o.created_at,
    o.updated_at,
    o.completed_at,
    
    -- User info (from auth.users)
    u.email as user_email,
    u.raw_user_meta_data->>'name' as user_name,
    u.raw_user_meta_data->>'phone' as user_phone,
    
    -- Product info
    p.name as product_name,
    p.name_bn as product_name_bn,
    p.diamonds,
    p.image_url as product_image,
    p.game_id,
    
    -- Game info
    g.name as game_name,
    g.name_bn as game_name_bn,
    g.image_url as game_image,
    
    -- Calculated fields
    CASE 
        WHEN o.status = 'completed' THEN 'Completed'
        WHEN o.status = 'processing' THEN 'Processing'
        WHEN o.status = 'pending' THEN 'Pending'
        WHEN o.status = 'cancelled' THEN 'Cancelled'
        ELSE 'Unknown'
    END as status_label,
    
    CASE 
        WHEN o.payment_status = 'paid' THEN 'Paid'
        WHEN o.payment_status = 'pending' THEN 'Pending'
        WHEN o.payment_status = 'failed' THEN 'Failed'
        ELSE 'Unknown'
    END as payment_status_label,
    
    CASE 
        WHEN o.verification_status = 'verified' THEN 'Verified'
        WHEN o.verification_status = 'pending' THEN 'Pending'
        WHEN o.verification_status = 'rejected' THEN 'Rejected'
        ELSE 'Unknown'
    END as verification_status_label,
    
    -- Time calculations
    EXTRACT(EPOCH FROM (NOW() - o.created_at)) / 3600 as hours_since_created,
    EXTRACT(EPOCH FROM (o.completed_at - o.created_at)) / 60 as completion_time_minutes

FROM orders o
LEFT JOIN auth.users u ON o.user_id = u.id
LEFT JOIN topup_packages p ON o.product_id = p.id
LEFT JOIN games g ON p.game_id = g.id;

-- Grant access to authenticated users
GRANT SELECT ON order_summary TO authenticated;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_order_summary_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_summary_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_summary_user_id ON orders(user_id);

-- ============================================
-- USAGE EXAMPLES
-- ============================================

-- Get all orders with full details
-- SELECT * FROM order_summary ORDER BY created_at DESC;

-- Get pending orders
-- SELECT * FROM order_summary WHERE status = 'pending';

-- Get orders by user
-- SELECT * FROM order_summary WHERE user_email = 'user@example.com';

-- Get orders needing verification
-- SELECT * FROM order_summary WHERE verification_status = 'pending';

-- Get today's orders
-- SELECT * FROM order_summary WHERE created_at >= CURRENT_DATE;

-- Get revenue by status
-- SELECT status, SUM(total_amount) as revenue, COUNT(*) as count
-- FROM order_summary
-- GROUP BY status;

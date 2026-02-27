-- ============================================
-- CREATE NOTIFICATIONS TABLE
-- ============================================

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'order_placed', 'order_verified', 'order_cancelled', 'order_completed', 'payment_pending', 'support_reply'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    is_read BOOLEAN DEFAULT FALSE,
    is_important BOOLEAN DEFAULT FALSE, -- For admin: only show important ones
    related_order_id UUID,
    related_support_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_is_important ON notifications(is_important);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Service role can do everything
CREATE POLICY "Service role full access"
    ON notifications FOR ALL
    USING (true);

-- ============================================
-- NOTIFICATION TYPES
-- ============================================
-- order_placed: New order created (IMPORTANT for admin)
-- order_verified: Order verified by admin (IMPORTANT for user)
-- order_cancelled: Order cancelled (IMPORTANT for both)
-- order_completed: Order completed (IMPORTANT for user)
-- payment_pending: Payment verification needed (IMPORTANT for admin)
-- support_reply: Support ticket replied (IMPORTANT for user)
-- order_processing: Order is being processed (normal for user)
-- ============================================

-- Sample notifications for testing
-- INSERT INTO notifications (user_id, type, title, message, priority, is_important) VALUES
-- (auth.uid(), 'order_placed', 'নতুন অর্ডার', 'আপনার অর্ডার সফলভাবে তৈরি হয়েছে', 'normal', false),
-- (auth.uid(), 'order_verified', 'অর্ডার যাচাই সম্পন্ন', 'আপনার পেমেন্ট যাচাই করা হয়েছে', 'high', true);

-- ============================================
-- TABLE CREATED SUCCESSFULLY!
-- ============================================

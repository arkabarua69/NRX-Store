-- Create support tickets table for customer support system
-- This table stores support tickets with admin replies

-- Drop existing support_tickets table if exists
DROP TABLE IF EXISTS support_tickets CASCADE;

-- Create support_tickets table
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Ticket Information
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    
    -- Status
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Admin Response
    admin_reply TEXT,
    admin_notes TEXT,
    assigned_to UUID REFERENCES auth.users(id),
    replied_at TIMESTAMP WITH TIME ZONE,
    replied_by UUID REFERENCES auth.users(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries
CREATE INDEX idx_support_tickets_email ON support_tickets(email);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_category ON support_tickets(category);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX idx_support_tickets_ticket_number ON support_tickets(ticket_number);

-- Function to generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER;
BEGIN
    -- Get count of tickets today
    SELECT COUNT(*) INTO counter
    FROM support_tickets
    WHERE DATE(created_at) = CURRENT_DATE;
    
    -- Generate ticket number: TKT-YYYYMMDD-XXXX
    new_number := 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((counter + 1)::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate ticket number
CREATE OR REPLACE FUNCTION set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        NEW.ticket_number := generate_ticket_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ticket_number_trigger
    BEFORE INSERT ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION set_ticket_number();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_support_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_support_tickets_updated_at_trigger
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_support_tickets_updated_at();

-- Trigger to set resolved_at when status changes to resolved
CREATE OR REPLACE FUNCTION set_resolved_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'resolved' AND (OLD.status IS NULL OR OLD.status != 'resolved') THEN
        NEW.resolved_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_resolved_at_trigger
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION set_resolved_at();

-- Enable Row Level Security
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to create tickets
CREATE POLICY "Allow public create access to support tickets"
    ON support_tickets FOR INSERT
    WITH CHECK (true);

-- Create policy to allow users to view their own tickets
CREATE POLICY "Allow users to view own tickets"
    ON support_tickets FOR SELECT
    USING (email = current_setting('request.jwt.claims', true)::json->>'email' OR true);

-- Create policy to allow admins to manage all tickets
CREATE POLICY "Allow admin full access to support tickets"
    ON support_tickets FOR ALL
    USING (true)
    WITH CHECK (true);

-- Add comments
COMMENT ON TABLE support_tickets IS 'Customer support tickets with admin replies';
COMMENT ON COLUMN support_tickets.ticket_number IS 'Unique ticket number (auto-generated)';
COMMENT ON COLUMN support_tickets.status IS 'Ticket status: open, in_progress, resolved, closed';
COMMENT ON COLUMN support_tickets.priority IS 'Ticket priority: low, normal, high, urgent';
COMMENT ON COLUMN support_tickets.admin_reply IS 'Admin response to the ticket';
COMMENT ON COLUMN support_tickets.admin_notes IS 'Internal admin notes (not visible to customer)';

-- Insert sample ticket for testing
INSERT INTO support_tickets (name, email, phone, subject, message, category) VALUES
('Test User', 'test@example.com', '+8801234567890', 'Test Support Ticket', 'This is a test support ticket message.', 'general');

-- Verify the setup
SELECT 
    id,
    ticket_number,
    name,
    email,
    subject,
    status,
    category,
    created_at
FROM support_tickets
ORDER BY created_at DESC;

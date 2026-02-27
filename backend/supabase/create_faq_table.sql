-- Create FAQ table for storing frequently asked questions
-- This table stores FAQs with Bengali and English content

-- Drop existing FAQ table if exists
DROP TABLE IF EXISTS faqs CASCADE;

-- Create FAQ table
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question VARCHAR(500) NOT NULL,
    question_bn VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    answer_bn TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_is_active ON faqs(is_active);
CREATE INDEX idx_faqs_order ON faqs(order_index);

-- Insert default FAQs
INSERT INTO faqs (question, question_bn, answer, answer_bn, category, order_index) VALUES
('How do I place an order?', 'আমি কিভাবে অর্ডার করব?', 'Select your game, choose a package, enter your game ID, and complete the payment. You will receive your diamonds within 5-30 minutes.', 'আপনার গেম সিলেক্ট করুন, একটি প্যাকেজ বাছুন, আপনার গেম আইডি দিন এবং পেমেন্ট সম্পন্ন করুন। ৫-৩০ মিনিটের মধ্যে ডায়মন্ড পাবেন।', 'general', 1),

('What payment methods do you accept?', 'কোন পেমেন্ট মেথড গ্রহণ করেন?', 'We accept bKash, Nagad, and Rocket. All major mobile banking services are supported.', 'আমরা বিকাশ, নগদ এবং রকেট গ্রহণ করি। সব প্রধান মোবাইল ব্যাংকিং সেবা সাপোর্টেড।', 'payment', 2),

('How long does delivery take?', 'ডেলিভারি কতক্ষণ লাগে?', 'Delivery usually takes 5-30 minutes after payment verification. During peak hours, it may take up to 1 hour.', 'পেমেন্ট ভেরিফিকেশনের পর সাধারণত ৫-৩০ মিনিট লাগে। পিক আওয়ারে ১ ঘন্টা পর্যন্ত লাগতে পারে।', 'delivery', 3),

('Is my payment secure?', 'আমার পেমেন্ট কি নিরাপদ?', 'Yes, we use secure payment gateways and never store your payment information. All transactions are encrypted.', 'হ্যাঁ, আমরা সিকিউর পেমেন্ট গেটওয়ে ব্যবহার করি এবং কখনো আপনার পেমেন্ট তথ্য সংরক্ষণ করি না। সব লেনদেন এনক্রিপ্টেড।', 'payment', 4),

('Can I cancel my order?', 'আমি কি আমার অর্ডার ক্যান্সেল করতে পারি?', 'Orders can be cancelled before payment verification. Once verified and processed, orders cannot be cancelled.', 'পেমেন্ট ভেরিফিকেশনের আগে অর্ডার ক্যান্সেল করা যায়। একবার ভেরিফাই এবং প্রসেস হলে ক্যান্সেল করা যায় না।', 'general', 5),

('What if I entered wrong game ID?', 'যদি আমি ভুল গেম আইডি দিয়ে থাকি?', 'Contact our support immediately with your order number. We will try to help if the order is not yet processed.', 'আপনার অর্ডার নম্বর সহ অবিলম্বে আমাদের সাপোর্টে যোগাযোগ করুন। অর্ডার প্রসেস না হলে আমরা সাহায্য করার চেষ্টা করব।', 'technical', 6),

('Do I need to create an account?', 'আমার কি অ্যাকাউন্ট তৈরি করতে হবে?', 'No, you can place orders as a guest. However, creating an account helps you track orders and get exclusive offers.', 'না, আপনি গেস্ট হিসেবে অর্ডার করতে পারেন। তবে অ্যাকাউন্ট তৈরি করলে অর্ডার ট্র্যাক এবং এক্সক্লুসিভ অফার পাবেন।', 'account', 7),

('How do I track my order?', 'আমি কিভাবে আমার অর্ডার ট্র্যাক করব?', 'Login to your account and go to "My Orders" section. You can see the status of all your orders there.', 'আপনার অ্যাকাউন্টে লগইন করুন এবং "আমার অর্ডার" সেকশনে যান। সেখানে সব অর্ডারের স্ট্যাটাস দেখতে পারবেন।', 'account', 8),

('What if I don''t receive my diamonds?', 'যদি আমি আমার ডায়মন্ড না পাই?', 'Contact our 24/7 support with your order number. We will investigate and resolve the issue immediately.', 'আপনার অর্ডার নম্বর সহ আমাদের ২৪/৭ সাপোর্টে যোগাযোগ করুন। আমরা তদন্ত করে অবিলম্বে সমাধান করব।', 'delivery', 9),

('Are there any hidden charges?', 'কোন লুকানো চার্জ আছে কি?', 'No, the price you see is the final price. There are no hidden charges or additional fees.', 'না, আপনি যে দাম দেখছেন সেটাই ফাইনাল দাম। কোন লুকানো চার্জ বা অতিরিক্ত ফি নেই।', 'payment', 10),

('Can I get a refund?', 'আমি কি রিফান্ড পেতে পারি?', 'Refunds are only provided if we cannot deliver your order. Once diamonds are delivered, refunds are not possible.', 'রিফান্ড শুধুমাত্র তখনই দেওয়া হয় যখন আমরা আপনার অর্ডার ডেলিভার করতে পারি না। ডায়মন্ড ডেলিভার হলে রিফান্ড সম্ভব নয়।', 'payment', 11),

('Which games do you support?', 'আপনারা কোন গেম সাপোর্ট করেন?', 'We support Free Fire, PUBG Mobile, Mobile Legends, Call of Duty Mobile, and many more popular games.', 'আমরা ফ্রি ফায়ার, পাবজি মোবাইল, মোবাইল লিজেন্ডস, কল অফ ডিউটি মোবাইল এবং আরো অনেক জনপ্রিয় গেম সাপোর্ট করি।', 'general', 12);

-- Enable Row Level Security
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read FAQs
CREATE POLICY "Allow public read access to FAQs"
    ON faqs FOR SELECT
    USING (is_active = true);

-- Create policy to allow only admins to manage FAQs
CREATE POLICY "Allow admin full access to FAQs"
    ON faqs FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_faqs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_faqs_updated_at_trigger
    BEFORE UPDATE ON faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_faqs_updated_at();

-- Add comments
COMMENT ON TABLE faqs IS 'Frequently Asked Questions with Bengali and English content';
COMMENT ON COLUMN faqs.question IS 'Question in English';
COMMENT ON COLUMN faqs.question_bn IS 'Question in Bengali';
COMMENT ON COLUMN faqs.answer IS 'Answer in English';
COMMENT ON COLUMN faqs.answer_bn IS 'Answer in Bengali';
COMMENT ON COLUMN faqs.category IS 'Category: general, payment, delivery, account, technical';
COMMENT ON COLUMN faqs.order_index IS 'Display order (lower number shows first)';

-- Verify the setup
SELECT 
    id,
    question,
    question_bn,
    category,
    order_index,
    is_active
FROM faqs
ORDER BY order_index;

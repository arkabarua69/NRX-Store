# 🗄️ Supabase Database Setup Guide

আপনার database এ tables missing আছে। এগুলো তৈরি করতে হবে।

## 🎯 Step 1: Supabase Dashboard এ যান

1. [supabase.com](https://supabase.com) এ login করুন
2. আপনার project সিলেক্ট করুন: `gitqowbfazbpycrixima`
3. Left sidebar এ **SQL Editor** ক্লিক করুন

---

## 📝 Step 2: Complete Schema Run করুন

SQL Editor এ **New Query** ক্লিক করুন এবং এই file এর content copy-paste করুন:

**File:** `backend/supabase/FINAL_SCHEMA.sql`

এটা run করলে সব tables তৈরি হবে:
- users
- topup_packages (products)
- orders
- notifications
- reviews
- settings
- support_messages
- faqs

**Run** button ক্লিক করুন।

---

## 🌱 Step 3: Sample Data Add করুন (Optional)

যদি test data চান, তাহলে আরেকটা New Query তৈরি করুন এবং run করুন:

**File:** `backend/supabase/FINAL_SEED.sql`

এটা sample products, reviews, settings add করবে।

---

## 🔐 Step 4: Admin User Setup করুন

আরেকটা New Query:

**File:** `backend/supabase/setup_admin_login.sql`

এটা admin user তৈরি করবে:
- Email: `admin@nrxstore.com`
- Password: `Admin@NRX2024`

---

## 📦 Step 5: Storage Setup করুন

File uploads এর জন্য storage bucket তৈরি করুন:

**File:** `backend/supabase/setup_storage.sql`

এটা `payment-proofs` এবং `product-images` buckets তৈরি করবে।

---

## ✅ Step 6: Verify করুন

SQL Editor এ এই query run করুন:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

আপনার দেখা উচিত:
- faqs
- notifications
- orders
- reviews
- settings
- support_messages
- topup_packages
- users

---

## 🔄 Step 7: Schema Cache Reload করুন

Supabase dashboard এ:

1. **Settings** → **API** এ যান
2. নিচে scroll করুন
3. **"Reload schema cache"** button খুঁজুন
4. ক্লিক করুন

এটা করলে "Could not find table in schema cache" error fix হবে।

---

## 🚀 Step 8: Backend Restart করুন

Local development server restart করুন:

```bash
cd backend
python run.py
```

অথবা Railway/Vercel এ deploy করলে automatic restart হবে।

---

## 🎉 Done!

এখন আপনার database সম্পূর্ণভাবে setup হয়ে গেছে!

### Quick Check:

Frontend এ যান এবং check করুন:
- ✅ Products দেখা যাচ্ছে
- ✅ Reviews দেখা যাচ্ছে
- ✅ Login কাজ করছে
- ✅ No more "table not found" errors

---

## ⚠️ যদি এখনও Error আসে

1. Supabase dashboard এ **Database** → **Tables** check করুন
2. সব tables আছে কিনা verify করুন
3. **Settings** → **API** → **Reload schema cache** আবার করুন
4. Backend restart করুন


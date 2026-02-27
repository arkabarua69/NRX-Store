# 🚂 Railway দিয়ে Backend Deploy করুন

Vercel এ Python apps deploy করা কঠিন। Railway অনেক ভালো এবং সহজ!

## ✅ কেন Railway?

- ✅ Python support excellent
- ✅ Free tier generous ($5 credit/month)
- ✅ Automatic HTTPS
- ✅ Easy deployment
- ✅ No dependency conflicts
- ✅ Better for Flask/Django apps

---

## 📦 Step 1: Railway Account তৈরি করুন

1. [railway.app](https://railway.app) এ যান
2. "Login" ক্লিক করুন
3. GitHub দিয়ে login করুন (same account যেটা দিয়ে code push করেছেন)
4. Railway আপনার GitHub repositories access চাইবে - Allow দিন

---

## 🚀 Step 2: New Project তৈরি করুন

1. Dashboard এ "New Project" button ক্লিক করুন
2. "Deploy from GitHub repo" সিলেক্ট করুন
3. আপনার `NRX-Store` repository খুঁজুন এবং সিলেক্ট করুন
4. "Deploy Now" ক্লিক করুন

---

## ⚙️ Step 3: Configure করুন

### 3.1 Root Directory Set করুন

1. Project settings এ যান
2. "Settings" tab ক্লিক করুন
3. "Root Directory" খুঁজুন
4. Value: `backend` দিন
5. Save করুন

### 3.2 Start Command Set করুন

1. Settings এ থাকুন
2. "Start Command" খুঁজুন
3. Value: `gunicorn run:app` দিন
4. Save করুন

---

## 🔐 Step 4: Environment Variables Add করুন

1. "Variables" tab এ যান
2. "New Variable" ক্লিক করে এই variables গুলো add করুন:

```
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=tUAwm4/3LWUxMTSsX/R9dNUWeFWjZ4wf4nC7Jv/LlRL7TzHWyjPqCuDZeC+EWGeypWzFZxlqebt7laFKeK9N9A==
SUPABASE_URL=https://gitqowbfazbpycrixima.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdHFvd2JmYXpicHljcml4aW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNjU2MDEsImV4cCI6MjA4Nzc0MTYwMX0.TDP7N-LjjfrJUoaxxPgdOmrJ3-KH46qimm6WaZziuUU
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdHFvd2JmYXpicHljcml4aW1hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE2NTYwMSwiZXhwIjoyMDg3NzQxNjAxfQ.bUuToFOfoLqx0UlfOZzkOcHzA8MtTBndDIm2fIyMy-w
JWT_SECRET=tUAwm4/3LWUxMTSsX/R9dNUWeFWjZ4wf4nC7Jv/LlRL7TzHWyjPqCuDZeC+EWGeypWzFZxlqebt7laFKeK9N9A==
ADMIN_EMAIL=admin@nrxstore.com
ADMIN_PASSWORD=Admin@NRX2024
PORT=5000
```

3. সব variables add হলে "Deploy" button ক্লিক করুন

---

## 🌐 Step 5: Backend URL পান

1. Deploy complete হলে "Settings" → "Domains" এ যান
2. "Generate Domain" ক্লিক করুন
3. Railway automatically একটা URL দেবে, যেমন:
   ```
   https://nrx-store-backend-production.up.railway.app
   ```
4. এই URL copy করুন

---

## 🔗 Step 6: Frontend এ Backend URL Update করুন

### Vercel Dashboard এ:

1. আপনার frontend project এ যান
2. "Settings" → "Environment Variables" এ যান
3. `VITE_API_URL` খুঁজুন
4. Edit করুন এবং নতুন value দিন:
   ```
   https://your-railway-url.up.railway.app/api
   ```
   (আপনার actual Railway URL দিন, শেষে `/api` যোগ করুন)
5. Save করুন
6. "Deployments" tab এ যান
7. Latest deployment এর পাশে "..." ক্লিক করুন
8. "Redeploy" সিলেক্ট করুন

---

## ✅ Step 7: Test করুন

1. আপনার frontend URL খুলুন (Vercel এ)
2. Homepage load হচ্ছে কিনা দেখুন
3. Login try করুন
4. Products দেখা যাচ্ছে কিনা check করুন

যদি সব ঠিক থাকে, তাহলে আপনার site সম্পূর্ণভাবে live! 🎉

---

## 🔄 Auto Deploy

Railway automatically deploy করবে যখনই আপনি GitHub এ code push করবেন। কোনো manual work লাগবে না!

---

## 💰 Railway Free Tier

- $5 credit প্রতি মাসে
- Small apps এর জন্য যথেষ্ট
- Credit শেষ হলে app sleep mode এ যাবে
- Upgrade করতে পারবেন যদি প্রয়োজন হয়

---

## 📊 Final Setup

```
Frontend:  https://nrx-store-frontend.vercel.app (Vercel)
Backend:   https://your-app.up.railway.app (Railway)
Database:  https://gitqowbfazbpycrixima.supabase.co (Supabase)
```

---

## 🎉 সম্পূর্ণ!

আপনার NRX Store এখন সম্পূর্ণভাবে production-ready এবং live!

**Railway > Vercel for Python** 🚂 > 🔺


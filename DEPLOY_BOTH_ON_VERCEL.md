# Frontend এবং Backend দুটোই Vercel এ Deploy করুন

## 🎯 Strategy: দুটি আলাদা Vercel Projects

আমরা দুটি আলাদা Vercel project তৈরি করব:
1. **Frontend Project** - React/Vite app
2. **Backend Project** - Flask API

---

## 📦 Project 1: Frontend Deploy

### Step 1: Frontend Project তৈরি করুন

1. [vercel.com/new](https://vercel.com/new) এ যান
2. আপনার `NRX-Store` repository সিলেক্ট করুন
3. Project name দিন: `nrx-store-frontend`

### Step 2: Configure করুন

**Framework Preset**: `Vite`

**Root Directory**: `frontend` ✅ (Important!)

**Build Command**: `npm run build`

**Output Directory**: `dist`

**Install Command**: `npm install`

### Step 3: Environment Variables

```
VITE_SUPABASE_URL=https://gitqowbfazbpycrixima.supabase.co

VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdHFvd2JmYXpicHljcml4aW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNjU2MDEsImV4cCI6MjA4Nzc0MTYwMX0.TDP7N-LjjfrJUoaxxPgdOmrJ3-KH46qimm6WaZziuUU

VITE_API_URL=https://nrx-store-backend.vercel.app/api
```

**Note**: Backend URL পরে update করবেন

### Step 4: Deploy করুন

"Deploy" button ক্লিক করুন। Frontend deploy হবে!

**Frontend URL**: `https://nrx-store-frontend.vercel.app`

---

## 🐍 Project 2: Backend Deploy

### Step 1: Backend Project তৈরি করুন

1. আবার [vercel.com/new](https://vercel.com/new) এ যান
2. একই `NRX-Store` repository সিলেক্ট করুন
3. Project name দিন: `nrx-store-backend`

### Step 2: Configure করুন

**Framework Preset**: `Other`

**Root Directory**: `backend` ✅ (Important!)

**Build Command**: `pip install -r requirements.txt`

**Output Directory**: `.` (dot - current directory)

**Install Command**: `pip install -r requirements.txt`

### Step 3: Environment Variables

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

### Step 4: Backend এর জন্য vercel.json তৈরি করুন

Backend folder এ একটি `vercel.json` file লাগবে। আমি তৈরি করে দিচ্ছি।

### Step 5: Deploy করুন

"Deploy" button ক্লিক করুন।

**Backend URL**: `https://nrx-store-backend.vercel.app`

---

## 🔗 Step 3: Frontend এ Backend URL Update করুন

1. Backend deploy সফল হলে URL copy করুন
2. Frontend project এ যান
3. Settings → Environment Variables
4. `VITE_API_URL` edit করুন
5. Value: `https://nrx-store-backend.vercel.app/api`
6. Save করুন
7. Redeploy করুন

---

## ⚠️ Backend Deploy এ যদি Error আসে

Vercel Python support limited। যদি backend deploy এ সমস্যা হয়:

### Alternative: Railway ব্যবহার করুন Backend এর জন্য

1. [railway.app](https://railway.app) এ যান
2. GitHub দিয়ে login করুন
3. "New Project" → "Deploy from GitHub"
4. `NRX-Store` repository সিলেক্ট করুন
5. Root Directory: `backend`
6. Environment variables add করুন
7. Deploy করুন

Railway এ Python apps খুব ভালো কাজ করে এবং ফ্রি!

---

## 📊 Final URLs

```
Frontend:  https://nrx-store-frontend.vercel.app
Backend:   https://nrx-store-backend.vercel.app (or Railway)
Admin:     https://nrx-store-frontend.vercel.app/admin
Database:  https://gitqowbfazbpycrixima.supabase.co
```

---

## ✅ Success Checklist

- [ ] Frontend Vercel project তৈরি হয়েছে
- [ ] Frontend deploy সফল
- [ ] Backend Vercel/Railway project তৈরি হয়েছে
- [ ] Backend deploy সফল
- [ ] Frontend এ backend URL update করা হয়েছে
- [ ] Frontend redeploy করা হয়েছে
- [ ] Homepage load হচ্ছে
- [ ] API calls কাজ করছে

---

## 🎉 Done!

আপনার Nrx Store এখন সম্পূর্ণভাবে live!

**সুপারিশ**: Backend এর জন্য Railway ব্যবহার করা ভালো কারণ:
- Python support excellent
- Free tier generous
- Easy to deploy
- Automatic HTTPS
- Good performance

Frontend Vercel এ perfect কাজ করবে! 🚀

# দুটি Vercel Projects - Quick Guide

## 🎯 আপনাকে দুটি আলাদা project তৈরি করতে হবে

---

## 📦 Project 1: Frontend (এখন যেটা করছেন)

### Vercel Dashboard Settings:

```
Project Name: nrx-store-frontend
Framework: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Environment Variables:
```
VITE_SUPABASE_URL=https://gitqowbfazbpycrixima.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdHFvd2JmYXpicHljcml4aW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNjU2MDEsImV4cCI6MjA4Nzc0MTYwMX0.TDP7N-LjjfrJUoaxxPgdOmrJ3-KH46qimm6WaZziuUU
VITE_API_URL=https://nrx-store-backend.vercel.app/api
```

**Deploy করুন!** ✅

---

## 🐍 Project 2: Backend (পরে করবেন)

### নতুন Vercel Project:

1. আবার vercel.com/new এ যান
2. একই repository সিলেক্ট করুন
3. নতুন project name দিন: `nrx-store-backend`

### Settings:

```
Project Name: nrx-store-backend
Framework: Other
Root Directory: backend
Build Command: pip install -r requirements.txt
Output Directory: .
```

### Environment Variables:
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
```

**Deploy করুন!** ✅

---

## 🔗 Backend Deploy হলে

1. Backend URL copy করুন
2. Frontend project এ যান
3. Settings → Environment Variables
4. `VITE_API_URL` update করুন
5. Redeploy করুন

---

## ⚠️ যদি Backend Vercel এ কাজ না করে

**Railway ব্যবহার করুন** (সবচেয়ে ভালো option):

1. [railway.app](https://railway.app)
2. GitHub দিয়ে login
3. "New Project" → "Deploy from GitHub"
4. Repository: `NRX-Store`
5. Root Directory: `backend`
6. Environment variables add করুন
7. Deploy!

Railway Python এর জন্য perfect এবং ফ্রি! 🚂

---

## 📊 Final Result

```
Frontend:  https://nrx-store-frontend.vercel.app
Backend:   https://nrx-store-backend.vercel.app (or Railway)
```

---

**এখন করুন**: Frontend project deploy করুন! 🚀

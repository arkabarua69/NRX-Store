# 🔧 CORS Error Fix করুন

আপনার Vercel backend এ CORS configuration missing আছে। Frontend domain allow করা নেই।

## ❌ Error:
```
Access to fetch at 'https://nrx-store-backend-mac-gunjons-projects.vercel.app/...' 
from origin 'https://nrx-store.vercel.app' has been blocked by CORS policy
```

## ✅ Solution: Vercel Backend এ CORS_ORIGINS Add করুন

### Step 1: Vercel Backend Dashboard এ যান

1. [vercel.com/dashboard](https://vercel.com/dashboard) এ যান
2. আপনার **backend** project ক্লিক করুন: `nrx-store-backend`

### Step 2: Environment Variable Add করুন

1. **Settings** tab ক্লিক করুন
2. Left sidebar এ **Environment Variables** ক্লিক করুন
3. **Add New** button ক্লিক করুন

### Step 3: CORS_ORIGINS Variable Add করুন

**Name (Key):**
```
CORS_ORIGINS
```

**Value:**
```
https://nrx-store.vercel.app,http://localhost:5173,http://localhost:3000
```

**Environment:** 
- ✅ Production
- ✅ Preview  
- ✅ Development

**Save** button ক্লিক করুন

### Step 4: Backend Redeploy করুন

1. **Deployments** tab এ যান
2. Latest deployment এর পাশে **"..."** (three dots) ক্লিক করুন
3. **"Redeploy"** সিলেক্ট করুন
4. Confirm করুন

---

## 🚀 Alternative: Railway ব্যবহার করুন (Recommended)

Vercel Python deployment এ অনেক সমস্যা। Railway অনেক ভালো কাজ করে।

### Railway এ Backend Deploy করুন:

1. [railway.app](https://railway.app) এ যান
2. "New Project" → "Deploy from GitHub repo"
3. `NRX-Store` repository সিলেক্ট করুন
4. Settings:
   - Root Directory: `backend`
   - Start Command: `gunicorn run:app`
5. Variables tab এ সব environment variables add করুন (including `CORS_ORIGINS`)
6. Deploy করুন

Railway URL পাবেন, যেমন: `https://nrx-backend.up.railway.app`

### Frontend এ Backend URL Update করুন:

1. Vercel frontend project এ যান
2. Settings → Environment Variables
3. `VITE_API_URL` edit করুন
4. Value: `https://nrx-backend.up.railway.app/api`
5. Redeploy করুন

---

## 📝 All Environment Variables for Backend:

Vercel/Railway backend এ এই সব variables add করুন:

```
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=bWRlvPAOjWEAz2lpGXPaEA2csJRERJnhOu4sgtB+ppz7W1a1EDDaoRNPYkK2tt2NvWPmYye/S42VJb2U8zA/lg==
CORS_ORIGINS=https://nrx-store.vercel.app,http://localhost:5173,http://localhost:3000
SUPABASE_URL=https://effevaifmlocktybkjhz.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmZmV2YWlmbWxvY2t0eWJramh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNjgyMjcsImV4cCI6MjA4Nzc0NDIyN30.emdG14k8HWK__IAl6dFhWIwt4h_x__E5FYeQ1thy95g
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmZmV2YWlmbWxvY2t0eWJramh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE2ODIyNywiZXhwIjoyMDg3NzQ0MjI3fQ.IFdBYgU8DCsxfIET7Cef-Eqy_f4hnLe3nGjA224KHjs
JWT_SECRET=bWRlvPAOjWEAz2lpGXPaEA2csJRERJnhOu4sgtB+ppz7W1a1EDDaoRNPYkK2tt2NvWPmYye/S42VJb2U8zA/lg==
ADMIN_EMAIL=admin@nrxstore.com
ADMIN_PASSWORD=Admin@NRX2024
PORT=5000
```

---

## ✅ Test করুন

Backend redeploy হলে frontend reload করুন। CORS error চলে যাবে এবং data show করবে! 🎉

---

## 🎯 Summary:

1. ✅ Vercel backend এ `CORS_ORIGINS` variable add করুন
2. ✅ Value: `https://nrx-store.vercel.app,http://localhost:5173,http://localhost:3000`
3. ✅ Backend redeploy করুন
4. ✅ Frontend reload করুন
5. ✅ Done!

অথবা Railway ব্যবহার করুন - এটা Python apps এর জন্য অনেক ভালো! 🚂


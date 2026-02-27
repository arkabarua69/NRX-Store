# 🚀 ডিপ্লয়মেন্ট সমস্যা সমাধান গাইড

## সমস্যা কি?
আপনার ওয়েবসাইটে ৩টি প্রধান সমস্যা আছে:
1. ❌ CORS Error - ফ্রন্টএন্ড ব্যাকএন্ডের সাথে কথা বলতে পারছে না
2. ❌ 404 Error - API endpoints খুঁজে পাচ্ছে না
3. ❌ Database কানেকশন কাজ করছে না

## ✅ সমাধান (ধাপে ধাপে)

### ধাপ ১: Render এ Backend সেটআপ করুন

1. এই লিংকে যান: https://dashboard.render.com
2. আপনার service **nrx-store** সিলেক্ট করুন
3. **Environment** ট্যাবে ক্লিক করুন
4. নিচের সব variables যোগ করুন/আপডেট করুন:

```
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=Fe1i9VbqKZ7+czy6aB6j0+bsnvwKgwvpUPXSVYqdV9mP+c9i7VP3XBS5G5SAp9fMxhpiNldmlYWaN7eH6xw+eQ==

CORS_ORIGINS=https://nrx-store.vercel.app,https://nrx-store-git-main-mac-gunjons-projects.vercel.app,http://localhost:5173

SUPABASE_URL=https://qphpeuknvnmsnjkvomnz.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHBldWtudm5tc25qa3ZvbW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzA4NTcsImV4cCI6MjA4Nzc0Njg1N30.2SLIDduYLCWaPtBkrBdd75GUjcKBO8w-oiMOHRUQZsI
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHBldWtudm5tc25qa3ZvbW56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE3MDg1NywiZXhwIjoyMDg3NzQ2ODU3fQ._h_OMGgnun12g4V5wRI2_WoWkFKu3OUd8goysZSPsI4

JWT_SECRET=Fe1i9VbqKZ7+czy6aB6j0+bsnvwKgwvpUPXSVYqdV9mP+c9i7VP3XBS5G5SAp9fMxhpiNldmlYWaN7eH6xw+eQ==

ADMIN_EMAIL=admin@nrxstore.com
ADMIN_PASSWORD=Admin@NRX2024

PORT=5000
```

5. **Save Changes** বাটনে ক্লিক করুন
6. Render automatically আপনার backend redeploy করবে (২-৩ মিনিট লাগবে)

### ধাপ ২: Vercel এ Frontend সেটআপ করুন

1. এই লিংকে যান: https://vercel.com/dashboard
2. আপনার project **nrx-store** সিলেক্ট করুন
3. **Settings** → **Environment Variables** এ যান
4. **Production** এর জন্য এই variables যোগ করুন:

```
VITE_SUPABASE_URL=https://qphpeuknvnmsnjkvomnz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHBldWtudm5tc25qa3ZvbW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzA4NTcsImV4cCI6MjA4Nzc0Njg1N30.2SLIDduYLCWaPtBkrBdd75GUjcKBO8w-oiMOHRUQZsI

VITE_API_URL=https://nrx-store.onrender.com/api

VITE_IMGBB_API_KEY=cfdf8c24a5b1249d8b721f1d8adb63a8
VITE_ADMIN_EMAILS=gunjonarka@gmail.com,admin@nrxstore.com
```

5. **Save** বাটনে ক্লিক করুন

### ধাপ ৩: Redeploy করুন

#### Backend (Render):
- Environment variables save করার পর automatically redeploy হবে
- অথবা manually: **Manual Deploy** → **Deploy latest commit**
- Logs দেখুন deployment complete হয়েছে কিনা

#### Frontend (Vercel):
- Code already GitHub এ push করা হয়েছে
- Vercel automatically deploy করবে
- Status দেখুন: https://vercel.com/dashboard

### ধাপ ৪: টেস্ট করুন

1. আপনার ওয়েবসাইট খুলুন: https://nrx-store.vercel.app
2. Browser console খুলুন (F12 চাপুন)
3. দেখুন:
   - ✅ কোন CORS error নেই
   - ✅ কোন 404 error নেই
   - ✅ Products দেখাচ্ছে
   - ✅ Data load হচ্ছে

## 🔍 সমস্যা হলে

### এখনও CORS error আসছে?
- Render এ CORS_ORIGINS ঠিক আছে কিনা চেক করুন
- Render logs দেখুন: Settings → Logs
- Backend redeploy হয়েছে কিনা নিশ্চিত করুন

### 404 error আসছে?
- VITE_API_URL শেষে `/api` আছে কিনা দেখুন (slash নেই)
- Backend test করুন: https://nrx-store.onrender.com/health

### Database কানেকশন fail করছে?
- Supabase credentials দুই জায়গায় same আছে কিনা দেখুন
- Supabase project active আছে কিনা: https://supabase.com/dashboard

### Backend slow/sleeping?
- Render free tier ১৫ মিনিট পর sleep করে
- প্রথম request এ ৩০-৬০ সেকেন্ড লাগতে পারে
- Paid tier নিলে always-on থাকবে

## 📝 গুরুত্বপূর্ণ নোট

1. **Environment Variables:**
   - Dashboard এর settings code এর `.env` file override করে
   - Production values সবসময় dashboard এ set করুন

2. **CORS Format:**
   - সব frontend URLs যোগ করতে হবে
   - Format: `https://url1.com,https://url2.com` (comma দিয়ে আলাদা, space নেই)

3. **API URL:**
   - Backend: `https://nrx-store.onrender.com`
   - API: `https://nrx-store.onrender.com/api/*`
   - শেষে slash দেবেন না!

## ✅ Checklist

- [ ] Render environment variables set করেছি
- [ ] Vercel environment variables set করেছি
- [ ] Backend redeploy হয়েছে
- [ ] Frontend redeploy হয়েছে
- [ ] Website খুলছে
- [ ] CORS error নেই
- [ ] Data দেখাচ্ছে
- [ ] Admin login কাজ করছে

## 🎯 সংক্ষেপে

আপনার frontend `.env.production` file আপডেট করা হয়েছে এবং GitHub এ push করা হয়েছে। এখন:

1. **Render dashboard** এ গিয়ে environment variables set করুন (উপরের list দেখুন)
2. **Vercel dashboard** এ গিয়ে environment variables set করুন (উপরের list দেখুন)
3. উভয় service redeploy হওয়ার জন্য ২-৩ মিনিট অপেক্ষা করুন
4. আপনার website test করুন

সব ঠিক হয়ে যাবে! 🎉

# ⚡ Quick Fix Checklist - Database Connection Issue

## 🎯 Problem
- ❌ CORS errors
- ❌ 404 errors  
- ❌ Database not working
- ❌ Frontend can't connect to backend

## ✅ Solution (2 Steps)

### Step 1: Configure Render (Backend)
📍 https://dashboard.render.com → Your Service → Environment

Copy-paste these EXACTLY:

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

⏱️ Wait 2-3 minutes for redeploy

---

### Step 2: Configure Vercel (Frontend)
📍 https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add these for **Production**:

```
VITE_SUPABASE_URL=https://qphpeuknvnmsnjkvomnz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHBldWtudm5tc25qa3ZvbW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzA4NTcsImV4cCI6MjA4Nzc0Njg1N30.2SLIDduYLCWaPtBkrBdd75GUjcKBO8w-oiMOHRUQZsI
VITE_API_URL=https://nrx-store.onrender.com/api
VITE_IMGBB_API_KEY=cfdf8c24a5b1249d8b721f1d8adb63a8
VITE_ADMIN_EMAILS=gunjonarka@gmail.com,admin@nrxstore.com
```

Then: Deployments → Redeploy

⏱️ Wait 1-2 minutes for redeploy

---

## 🧪 Test

1. Visit: https://nrx-store.vercel.app
2. Press F12 (open console)
3. Check:
   - ✅ No CORS errors
   - ✅ No 404 errors
   - ✅ Products loading
   - ✅ Data showing

---

## 📚 Detailed Guides

- **Render Setup:** See `RENDER_ENV_SETUP.md`
- **Vercel Setup:** See `VERCEL_ENV_SETUP.md`
- **Full Guide:** See `DEPLOYMENT_FIX_GUIDE.md`
- **Bangla Guide:** See `DEPLOYMENT_FIX_BANGLA.md`

---

## 🆘 Still Not Working?

### Check Render Logs:
https://dashboard.render.com → Your Service → Logs

Look for errors like:
- Database connection failed
- CORS configuration error
- Port binding error

### Check Vercel Logs:
https://vercel.com/dashboard → Your Project → Deployments → View Function Logs

### Test Backend Directly:
```
https://nrx-store.onrender.com/health
```
Should return: `{"status": "healthy"}`

### Test API Endpoint:
```
https://nrx-store.onrender.com/api/products?onlyActive=true
```
Should return products list

---

## ⚠️ Important Notes

1. **CORS_ORIGINS:** Must have NO SPACES, comma-separated
2. **VITE_API_URL:** Must end with `/api`, NO trailing slash
3. **Supabase:** Both services must use SAME database (qphpeuknvnmsnjkvomnz)
4. **Redeploy:** Both services must redeploy after env var changes
5. **Cache:** Clear browser cache (Ctrl+Shift+R) after changes

---

## ✅ Success Indicators

When everything works:
- ✅ Website loads fast
- ✅ Products display with images
- ✅ Can login/register
- ✅ Orders can be created
- ✅ Admin panel works
- ✅ No console errors

---

## 🎉 Done!

Your frontend (Vercel) and backend (Render) are now properly connected to the same Supabase database. All CORS and API routing issues are fixed.

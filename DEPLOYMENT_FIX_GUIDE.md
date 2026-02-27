# 🚀 Deployment Fix Guide - Vercel Frontend + Render Backend

## Current Issues
1. ❌ CORS errors blocking frontend requests to backend
2. ❌ 404 errors on API endpoints (double slashes in URLs)
3. ❌ Database connection not working between services

## ✅ Solution Steps

### Step 1: Configure Render Backend Environment Variables

Go to your Render dashboard and set these environment variables:

1. Visit: https://dashboard.render.com
2. Select your service: **nrx-store**
3. Click **Environment** tab
4. Add/Update these variables:

```env
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=Fe1i9VbqKZ7+czy6aB6j0+bsnvwKgwvpUPXSVYqdV9mP+c9i7VP3XBS5G5SAp9fMxhpiNldmlYWaN7eH6xw+eQ==

# CRITICAL: Add your Vercel frontend URLs here
CORS_ORIGINS=https://nrx-store.vercel.app,https://nrx-store-git-main-mac-gunjons-projects.vercel.app,http://localhost:5173

# Supabase Production Database
SUPABASE_URL=https://qphpeuknvnmsnjkvomnz.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHBldWtudm5tc25qa3ZvbW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzA4NTcsImV4cCI6MjA4Nzc0Njg1N30.2SLIDduYLCWaPtBkrBdd75GUjcKBO8w-oiMOHRUQZsI
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHBldWtudm5tc25qa3ZvbW56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE3MDg1NywiZXhwIjoyMDg3NzQ2ODU3fQ._h_OMGgnun12g4V5wRI2_WoWkFKu3OUd8goysZSPsI4

JWT_SECRET=Fe1i9VbqKZ7+czy6aB6j0+bsnvwKgwvpUPXSVYqdV9mP+c9i7VP3XBS5G5SAp9fMxhpiNldmlYWaN7eH6xw+eQ==

ADMIN_EMAIL=admin@nrxstore.com
ADMIN_PASSWORD=Admin@NRX2024

PORT=5000
```

4. Click **Save Changes**
5. Render will automatically redeploy your backend

### Step 2: Configure Vercel Frontend Environment Variables

1. Visit: https://vercel.com/dashboard
2. Select your project: **nrx-store**
3. Go to **Settings** → **Environment Variables**
4. Add/Update these variables for **Production**:

```env
VITE_SUPABASE_URL=https://qphpeuknvnmsnjkvomnz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHBldWtudm5tc25qa3ZvbW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzA4NTcsImV4cCI6MjA4Nzc0Njg1N30.2SLIDduYLCWaPtBkrBdd75GUjcKBO8w-oiMOHRUQZsI

# CRITICAL: Your Render backend URL (NO trailing slash)
VITE_API_URL=https://nrx-store.onrender.com/api

VITE_IMGBB_API_KEY=cfdf8c24a5b1249d8b721f1d8adb63a8
VITE_ADMIN_EMAILS=gunjonarka@gmail.com,admin@nrxstore.com
```

5. Click **Save**

### Step 3: Redeploy Services

#### Backend (Render):
- Render will auto-redeploy after environment variable changes
- Or manually trigger: **Manual Deploy** → **Deploy latest commit**
- Wait for deployment to complete (check logs)

#### Frontend (Vercel):
The code has been pushed to GitHub. Vercel will auto-deploy.
- Check deployment status at: https://vercel.com/dashboard
- Or manually trigger: **Deployments** → **Redeploy**

### Step 4: Verify Deployment

#### Test Backend Health:
```bash
curl https://nrx-store.onrender.com/health
```
Expected response: `{"status": "healthy", "service": "game-topup-api"}`

#### Test Backend API:
```bash
curl https://nrx-store.onrender.com/api/products?onlyActive=true
```
Should return products list (not 404)

#### Test Frontend:
1. Visit: https://nrx-store.vercel.app
2. Open browser console (F12)
3. Check for errors:
   - ✅ No CORS errors
   - ✅ No 404 errors
   - ✅ Data loads successfully

## 🔍 Troubleshooting

### Issue: Still getting CORS errors
**Solution:** 
- Verify CORS_ORIGINS in Render includes your exact Vercel URL
- Check Render logs: `Settings` → `Logs`
- Ensure backend redeployed after env var changes

### Issue: 404 errors on API endpoints
**Solution:**
- Verify VITE_API_URL ends with `/api` (no trailing slash)
- Check backend routes are registered correctly
- Test backend directly: `curl https://nrx-store.onrender.com/api/products`

### Issue: Database connection fails
**Solution:**
- Verify Supabase credentials are correct in both services
- Check Supabase project is active: https://supabase.com/dashboard
- Test Supabase connection from backend logs

### Issue: Render backend is slow/sleeping
**Solution:**
- Render free tier sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Consider upgrading to paid tier for always-on service

## 📝 Important Notes

1. **Environment Variables Priority:**
   - Vercel/Render dashboard settings override `.env` files
   - Always set production values in dashboard, not in code

2. **CORS Configuration:**
   - Must include ALL frontend URLs (production + preview branches)
   - Format: `https://domain1.com,https://domain2.com` (comma-separated, no spaces)

3. **API URL Format:**
   - Backend base: `https://nrx-store.onrender.com`
   - API endpoints: `https://nrx-store.onrender.com/api/*`
   - Frontend config: `VITE_API_URL=https://nrx-store.onrender.com/api` (NO trailing slash)

4. **Database:**
   - Both services must use the SAME Supabase project
   - Production database: `qphpeuknvnmsnjkvomnz.supabase.co`

## ✅ Checklist

- [ ] Render environment variables configured
- [ ] Vercel environment variables configured
- [ ] Backend redeployed on Render
- [ ] Frontend redeployed on Vercel
- [ ] Backend health check passes
- [ ] Frontend loads without CORS errors
- [ ] Data displays correctly on website
- [ ] Admin login works
- [ ] Orders can be created

## 🆘 Need Help?

If issues persist after following all steps:
1. Check Render logs: https://dashboard.render.com → Your Service → Logs
2. Check Vercel logs: https://vercel.com/dashboard → Your Project → Deployments → View Function Logs
3. Check browser console for specific error messages
4. Verify Supabase project status: https://supabase.com/dashboard

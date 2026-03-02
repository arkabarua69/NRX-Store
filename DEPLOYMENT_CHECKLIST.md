# 🚀 Complete Deployment Checklist

## Pre-Deployment

### Backend (Render)
- [x] Backend deployed to Render
- [x] Backend URL: `https://nrx-store.onrender.com`
- [ ] Backend `/health` endpoint returns `{"status": "healthy"}`
- [ ] Environment variables set in Render:
  - [ ] `FLASK_ENV=production`
  - [ ] `SECRET_KEY` (set)
  - [ ] `SUPABASE_URL` (set)
  - [ ] `SUPABASE_KEY` (set)
  - [ ] `SUPABASE_SERVICE_KEY` (set)
  - [ ] `JWT_SECRET` (set)
  - [ ] `ADMIN_EMAIL=gunjonarka@gmail.com`
  - [ ] `CORS_ORIGINS=https://nrx-store-delta.vercel.app,http://localhost:5173`

### Frontend (Vercel)
- [ ] Repository connected to Vercel
- [ ] Environment variables set in Vercel:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_API_URL=https://nrx-store.onrender.com/api`
  - [ ] `VITE_IMGBB_API_KEY`
  - [ ] `VITE_ADMIN_EMAILS`

### Database (Supabase)
- [ ] Supabase project created
- [ ] Tables created (run `FINAL_SCHEMA.sql`)
- [ ] Sample data inserted (run `FINAL_SEED.sql`)
- [ ] Realistic data added (run `REALISTIC_SEED.sql`)
- [ ] Auth configured:
  - [ ] Google OAuth enabled
  - [ ] Redirect URLs added
  - [ ] Site URL set

---

## Deployment Steps

### Step 1: Configure Vercel Environment Variables

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add these 5 variables (for Production, Preview, Development):

```
1. VITE_SUPABASE_URL
   Value: https://xgucnyuhwghctwihrkkh.supabase.co

2. VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhndWNueXVod2doY3R3aWhya2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMzM0OTksImV4cCI6MjA4NjgwOTQ5OX0.y7zqyLW7HsLnYQkmszu5k08-21KAKMQX1x9e8ZCFw2c

3. VITE_API_URL
   Value: https://nrx-store.onrender.com/api

4. VITE_IMGBB_API_KEY
   Value: cfdf8c24a5b1249d8b721f1d8adb63a8

5. VITE_ADMIN_EMAILS
   Value: gunjonarka@gmail.com,admin@nrxstore.com
```

### Step 2: Configure Supabase Auth

Go to: Supabase Dashboard → Authentication → URL Configuration

**Redirect URLs (add these):**
```
https://nrx-store-delta.vercel.app
https://nrx-store-delta.vercel.app/auth/callback
https://nrx-store-delta.vercel.app/login
https://nrx-store-delta.vercel.app/dashboard
http://localhost:5173
http://localhost:5173/auth/callback
```

**Site URL:**
```
https://nrx-store-delta.vercel.app
```

### Step 3: Update Render CORS

Go to: Render Dashboard → Your Backend Service → Environment

Update `CORS_ORIGINS`:
```
https://nrx-store-delta.vercel.app,http://localhost:5173
```

**Important:** No spaces, no trailing slashes!

### Step 4: Deploy

1. Push code to GitHub
2. Vercel will auto-deploy
3. Wait for deployment to complete (~2-3 minutes)

---

## Post-Deployment Testing

### Test 1: Backend Health Check
Visit: `https://nrx-store.onrender.com/health`

Expected response:
```json
{
  "status": "healthy",
  "service": "game-topup-api"
}
```

- [ ] Backend health check passes

### Test 2: Backend API Root
Visit: `https://nrx-store.onrender.com/`

Expected response:
```json
{
  "message": "NRX Store API",
  "status": "running",
  "version": "1.0.0"
}
```

- [ ] Backend root endpoint works

### Test 3: Products API
Visit: `https://nrx-store.onrender.com/api/products`

Expected: JSON with products list

- [ ] Products API returns data

### Test 4: Frontend Loads
Visit: `https://nrx-store-delta.vercel.app`

Expected: Homepage loads with products

- [ ] Homepage loads
- [ ] No console errors
- [ ] Products visible on store page

### Test 5: Connection Test Page
Visit: `https://nrx-store-delta.vercel.app/test-connection.html`

Run all tests:
- [ ] Environment variables ✓
- [ ] Backend API ✓
- [ ] Products endpoint ✓
- [ ] Supabase connection ✓
- [ ] CORS test ✓

### Test 6: Authentication
1. Click "Login with Google"
2. Complete Google OAuth
3. Should redirect back to site
4. Should see user profile in header

- [ ] Google login works
- [ ] User profile displays
- [ ] Can access dashboard

### Test 7: Store Functionality
1. Go to Store page
2. Click on a product
3. Add to cart
4. View cart

- [ ] Products load
- [ ] Product details work
- [ ] Add to cart works
- [ ] Cart displays items

### Test 8: Admin Access (if admin)
1. Login with admin email
2. Should see "Admin" in navigation
3. Click Admin panel
4. Should see dashboard

- [ ] Admin panel accessible
- [ ] Can view orders
- [ ] Can view products
- [ ] Can view stats

---

## Common Issues & Solutions

### Issue: Products not loading

**Symptoms:**
- Empty store page
- "Failed to fetch" error in console

**Solutions:**
1. Check `VITE_API_URL` in Vercel env vars
2. Verify backend is running: `https://nrx-store.onrender.com/health`
3. Check CORS settings in Render
4. Clear browser cache

**Test:**
```javascript
// In browser console:
fetch('https://nrx-store.onrender.com/api/products')
  .then(r => r.json())
  .then(console.log)
```

### Issue: CORS errors

**Symptoms:**
- "Access-Control-Allow-Origin" error in console
- API calls fail with CORS error

**Solutions:**
1. Update `CORS_ORIGINS` in Render to: `https://nrx-store-delta.vercel.app,http://localhost:5173`
2. No spaces, no trailing slashes
3. Wait for Render to redeploy
4. Clear browser cache

### Issue: Login not working

**Symptoms:**
- Redirect loop
- "Invalid redirect URL" error
- Stuck on login page

**Solutions:**
1. Add Vercel URL to Supabase redirect URLs
2. Set Site URL in Supabase
3. Clear browser cookies
4. Try incognito mode

### Issue: Environment variables not working

**Symptoms:**
- `undefined` values in console
- API calls to wrong URL

**Solutions:**
1. Verify all 5 env vars added to Vercel
2. Check they're enabled for Production, Preview, Development
3. Redeploy without cache
4. Check build logs for env var values

---

## Verification Commands

### Check Backend
```bash
# Health check
curl https://nrx-store.onrender.com/health

# Products API
curl https://nrx-store.onrender.com/api/products

# Root endpoint
curl https://nrx-store.onrender.com/
```

### Check Frontend Build
```bash
cd frontend
npm run build
# Should complete without errors
```

### Check Environment Variables
In Vercel deployment logs, look for:
```
VITE_SUPABASE_URL: https://xgucnyuhwghctwihrkkh.supabase.co
VITE_API_URL: https://nrx-store.onrender.com/api
```

---

## Success Criteria

Your deployment is successful when:

- [x] Backend health check returns 200 OK
- [x] Frontend loads without errors
- [x] Products display on store page
- [x] Google login works
- [x] User can access dashboard
- [x] No CORS errors in console
- [x] No 404 errors for API calls
- [x] Images load correctly
- [x] Cart functionality works
- [x] Admin panel accessible (for admin users)

---

## Monitoring

### Daily Checks
- [ ] Backend is running (check /health)
- [ ] Frontend is accessible
- [ ] No errors in Vercel logs
- [ ] No errors in Render logs

### Weekly Checks
- [ ] Review Supabase usage
- [ ] Check Render usage
- [ ] Review Vercel analytics
- [ ] Update products if needed

### Monthly Checks
- [ ] Update dependencies
- [ ] Review security
- [ ] Backup database
- [ ] Update content

---

## Support Resources

### Documentation
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Supabase Docs: https://supabase.com/docs

### Debugging Tools
- Vercel Logs: Dashboard → Deployments → View Function Logs
- Render Logs: Dashboard → Your Service → Logs
- Browser DevTools: F12 → Console & Network tabs

### Test Pages
- Connection Test: `/test-connection.html`
- Backend Health: `https://nrx-store.onrender.com/health`
- API Test: `https://nrx-store.onrender.com/api/products`

---

## Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | https://nrx-store-delta.vercel.app | Main website |
| Backend | https://nrx-store.onrender.com | API server |
| Backend API | https://nrx-store.onrender.com/api | API endpoints |
| Health Check | https://nrx-store.onrender.com/health | Backend status |
| Test Page | /test-connection.html | Connection test |
| Supabase | https://xgucnyuhwghctwihrkkh.supabase.co | Database |

---

## Emergency Rollback

If deployment fails:

1. Go to Vercel → Deployments
2. Find last working deployment
3. Click ⋯ → Promote to Production
4. Investigate issue in failed deployment logs

---

## Next Steps After Successful Deployment

1. [ ] Submit sitemap to Google Search Console
2. [ ] Set up monitoring/alerts
3. [ ] Configure custom domain (optional)
4. [ ] Set up analytics
5. [ ] Test on mobile devices
6. [ ] Share with test users
7. [ ] Collect feedback
8. [ ] Make improvements

---

**Last Updated:** 2026-02-27
**Status:** Ready for deployment ✅

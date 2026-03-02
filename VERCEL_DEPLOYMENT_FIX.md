# Vercel Deployment Fix Guide 🚀

## Issues Found & Solutions

### ❌ Issue 1: API URL Points to Localhost
**Problem:** `VITE_API_URL=http://192.168.0.113:5000/api` won't work on Vercel
**Solution:** Must point to your Render backend URL

### ❌ Issue 2: Missing Environment Variables on Vercel
**Problem:** Environment variables in `.env` file aren't deployed
**Solution:** Must add them in Vercel dashboard

### ❌ Issue 3: Supabase Auth Redirect URL
**Problem:** Auth redirects may fail if not configured for Vercel domain
**Solution:** Add Vercel URL to Supabase allowed redirect URLs

---

## 🔧 Step-by-Step Fix

### Step 1: Update Vercel Environment Variables

Go to your Vercel project → Settings → Environment Variables

Add these variables for **Production**, **Preview**, and **Development**:

```env
VITE_SUPABASE_URL=https://xgucnyuhwghctwihrkkh.supabase.co

VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhndWNueXVod2doY3R3aWhya2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMzM0OTksImV4cCI6MjA4NjgwOTQ5OX0.y7zqyLW7HsLnYQkmszu5k08-21KAKMQX1x9e8ZCFw2c

VITE_API_URL=https://nrx-store.onrender.com/api

VITE_IMGBB_API_KEY=cfdf8c24a5b1249d8b721f1d8adb63a8

VITE_ADMIN_EMAILS=gunjonarka@gmail.com,admin@nrxstore.com
```

**Important:** Make sure `VITE_API_URL` points to your Render backend!

### Step 2: Configure Supabase Auth

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add these URLs to **Redirect URLs**:

```
https://nrx-store-delta.vercel.app
https://nrx-store-delta.vercel.app/auth/callback
https://nrx-store-delta.vercel.app/login
https://nrx-store-delta.vercel.app/dashboard
http://localhost:5173
http://localhost:5173/auth/callback
```

3. Set **Site URL** to: `https://nrx-store-delta.vercel.app`

### Step 3: Update Render Backend CORS

In Render dashboard → Your backend service → Environment:

Update `CORS_ORIGINS` to:
```
https://nrx-store-delta.vercel.app,http://localhost:5173
```

**Important:** No trailing slashes, no spaces, comma-separated!

### Step 4: Redeploy

After updating environment variables:

1. Go to Vercel → Deployments
2. Click on latest deployment → ⋯ (three dots) → Redeploy
3. Check "Use existing Build Cache" is OFF
4. Click "Redeploy"

---

## 🧪 Testing Checklist

After deployment, test these:

### Authentication
- [ ] Google login works
- [ ] User can see dashboard after login
- [ ] User profile loads correctly
- [ ] Logout works

### API Calls
- [ ] Products load on store page
- [ ] Can view product details
- [ ] Cart functionality works
- [ ] Order creation works

### Admin Features (if admin)
- [ ] Can access admin panel
- [ ] Can view orders
- [ ] Can update order status
- [ ] Can manage products

### General
- [ ] No CORS errors in console
- [ ] No 404 errors for API calls
- [ ] Images load correctly
- [ ] Navigation works smoothly

---

## 🐛 Common Errors & Fixes

### Error: "Failed to fetch" or CORS Error

**Cause:** Backend CORS not configured or API URL wrong

**Fix:**
1. Check `VITE_API_URL` in Vercel env vars
2. Verify Render backend `CORS_ORIGINS` includes your Vercel URL
3. Make sure backend is running (check Render logs)

### Error: "Invalid login credentials"

**Cause:** Supabase redirect URL not configured

**Fix:**
1. Add Vercel URL to Supabase redirect URLs
2. Clear browser cache and cookies
3. Try login again

### Error: "Network request failed"

**Cause:** Backend is down or URL is wrong

**Fix:**
1. Check if backend is running: Visit `https://nrx-store.onrender.com/health`
2. Should return: `{"status": "healthy"}`
3. If not, check Render logs for errors

### Error: Products not loading

**Cause:** API URL pointing to wrong endpoint

**Fix:**
1. Verify `VITE_API_URL` ends with `/api`
2. Test endpoint: `https://nrx-store.onrender.com/api/products`
3. Should return JSON with products

---

## 📊 Verify Deployment

### 1. Check Environment Variables
```bash
# In Vercel deployment logs, you should see:
VITE_SUPABASE_URL: https://xgucnyuhwghctwihrkkh.supabase.co
VITE_API_URL: https://nrx-store.onrender.com/api
```

### 2. Test Backend Connection
Open browser console on your Vercel site and run:
```javascript
fetch(import.meta.env.VITE_API_URL + '/products')
  .then(r => r.json())
  .then(console.log)
```

Should return products list.

### 3. Test Auth
1. Click "Login with Google"
2. Should redirect to Google
3. After login, should redirect back to your site
4. Should see user profile in header

---

## 🔍 Debug Mode

If issues persist, enable debug mode:

### Check Vercel Logs
1. Go to Vercel → Your project → Deployments
2. Click on latest deployment
3. Click "View Function Logs"
4. Look for errors

### Check Browser Console
1. Open your site
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look for red errors
5. Check Network tab for failed requests

### Check Render Logs
1. Go to Render → Your backend service
2. Click "Logs" tab
3. Look for errors or CORS issues

---

## ✅ Success Indicators

Your deployment is working correctly when:

1. ✅ No CORS errors in browser console
2. ✅ Products load on store page
3. ✅ Google login works
4. ✅ User can access dashboard
5. ✅ API calls return data (not 404)
6. ✅ Images load correctly
7. ✅ No "Failed to fetch" errors

---

## 🆘 Still Having Issues?

### Quick Checklist:
- [ ] Environment variables added to Vercel (all 5 variables)
- [ ] Vercel URL added to Supabase redirect URLs
- [ ] Vercel URL added to Render CORS_ORIGINS
- [ ] Backend is running (check /health endpoint)
- [ ] Redeployed after adding env vars
- [ ] Cleared browser cache

### Get Specific Error:
1. Open browser console (F12)
2. Try the action that fails
3. Copy the exact error message
4. Check which API endpoint is failing
5. Test that endpoint directly in browser

---

## 📝 Environment Variables Reference

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Database connection |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Database auth |
| `VITE_API_URL` | `https://nrx-store.onrender.com/api` | Backend API |
| `VITE_IMGBB_API_KEY` | Your ImgBB key | Image uploads |
| `VITE_ADMIN_EMAILS` | Comma-separated emails | Admin access |

---

## 🎯 Final Steps

1. ✅ Add all environment variables to Vercel
2. ✅ Configure Supabase redirect URLs
3. ✅ Update Render CORS settings
4. ✅ Redeploy on Vercel
5. ✅ Test login and API calls
6. ✅ Check for console errors

Your site should now work perfectly! 🎉

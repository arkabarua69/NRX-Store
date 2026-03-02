# Quick Vercel Setup Guide ⚡

## 🎯 3-Minute Setup

### Step 1: Add Environment Variables to Vercel (2 minutes)

1. Go to: https://vercel.com/dashboard
2. Click your project: **nrx-store**
3. Go to: **Settings** → **Environment Variables**
4. Add these 5 variables (copy-paste each):

```
Variable 1:
Name: VITE_SUPABASE_URL
Value: https://xgucnyuhwghctwihrkkh.supabase.co
Environment: Production, Preview, Development

Variable 2:
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhndWNueXVod2doY3R3aWhya2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMzM0OTksImV4cCI6MjA4NjgwOTQ5OX0.y7zqyLW7HsLnYQkmszu5k08-21KAKMQX1x9e8ZCFw2c
Environment: Production, Preview, Development

Variable 3:
Name: VITE_API_URL
Value: https://nrx-store.onrender.com/api
Environment: Production, Preview, Development

Variable 4:
Name: VITE_IMGBB_API_KEY
Value: cfdf8c24a5b1249d8b721f1d8adb63a8
Environment: Production, Preview, Development

Variable 5:
Name: VITE_ADMIN_EMAILS
Value: gunjonarka@gmail.com,admin@nrxstore.com
Environment: Production, Preview, Development
```

5. Click **Save** after each variable

### Step 2: Configure Supabase (1 minute)

1. Go to: https://supabase.com/dashboard
2. Select your project: **xgucnyuhwghctwihrkkh**
3. Go to: **Authentication** → **URL Configuration**
4. Add to **Redirect URLs**:
   ```
   https://nrx-store-delta.vercel.app
   https://nrx-store-delta.vercel.app/auth/callback
   http://localhost:5173
   ```
5. Set **Site URL**: `https://nrx-store-delta.vercel.app`
6. Click **Save**

### Step 3: Update Render CORS (30 seconds)

1. Go to: https://dashboard.render.com
2. Select your backend service: **nrx-store**
3. Go to: **Environment** tab
4. Find `CORS_ORIGINS` variable
5. Update value to:
   ```
   https://nrx-store-delta.vercel.app,http://localhost:5173
   ```
6. Click **Save Changes** (will auto-redeploy)

### Step 4: Redeploy Vercel (30 seconds)

1. Go back to Vercel → **Deployments**
2. Click latest deployment → **⋯** (three dots) → **Redeploy**
3. Uncheck "Use existing Build Cache"
4. Click **Redeploy**

---

## ✅ Test Your Deployment

After redeployment completes (~2 minutes):

1. Visit: https://nrx-store-delta.vercel.app
2. Click **Login with Google**
3. Should redirect to Google login
4. After login, should see your profile
5. Go to **Store** page
6. Products should load

---

## 🐛 If Something Doesn't Work

### Products Not Loading?
- Check: https://nrx-store.onrender.com/health
- Should show: `{"status": "healthy"}`
- If not, backend is down - check Render logs

### Login Not Working?
- Clear browser cache and cookies
- Try incognito/private window
- Check Supabase redirect URLs are saved

### CORS Errors?
- Verify Render `CORS_ORIGINS` has no spaces
- Verify Render `CORS_ORIGINS` has no trailing slashes
- Wait for Render to finish redeploying

---

## 📋 Checklist

- [ ] Added 5 environment variables to Vercel
- [ ] Added redirect URLs to Supabase
- [ ] Updated CORS_ORIGINS in Render
- [ ] Redeployed Vercel (without cache)
- [ ] Tested login
- [ ] Tested products loading
- [ ] No errors in browser console

---

## 🎉 Done!

Your site should now be fully functional on Vercel!

**Live URL:** https://nrx-store-delta.vercel.app

**Backend API:** https://nrx-store.onrender.com/api

**Admin Email:** gunjonarka@gmail.com

# 🎯 Vercel Environment Variables Setup

## Step-by-Step Instructions

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2. Select Your Project
Click on your project: **nrx-store**

### 3. Go to Settings
Click on **Settings** tab at the top

### 4. Go to Environment Variables
Click on **Environment Variables** in the left sidebar

### 5. Add These Variables

For each variable below:
1. Click **Add New** button
2. Enter the Key
3. Enter the Value
4. Select **Production** environment
5. Click **Save**

---

**Variable 1:**
```
Key: VITE_SUPABASE_URL
Value: https://qphpeuknvnmsnjkvomnz.supabase.co
Environment: Production
```

---

**Variable 2:**
```
Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHBldWtudm5tc25qa3ZvbW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzA4NTcsImV4cCI6MjA4Nzc0Njg1N30.2SLIDduYLCWaPtBkrBdd75GUjcKBO8w-oiMOHRUQZsI
Environment: Production
```

---

**Variable 3 (MOST IMPORTANT):**
```
Key: VITE_API_URL
Value: https://nrx-store.onrender.com/api
Environment: Production
```
⚠️ **CRITICAL:** 
- Must be your Render backend URL
- Must end with `/api`
- NO trailing slash after `/api`

---

**Variable 4:**
```
Key: VITE_IMGBB_API_KEY
Value: cfdf8c24a5b1249d8b721f1d8adb63a8
Environment: Production
```

---

**Variable 5:**
```
Key: VITE_ADMIN_EMAILS
Value: gunjonarka@gmail.com,admin@nrxstore.com
Environment: Production
```

---

### 6. Redeploy

After adding all variables:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click the **⋯** (three dots) menu
4. Click **Redeploy**
5. Confirm the redeploy

OR just wait - Vercel will auto-deploy from your GitHub push.

---

## Quick Verification

After deployment completes (1-2 minutes):

1. **Visit Your Site:**
   ```
   https://nrx-store.vercel.app
   ```

2. **Open Browser Console (F12)**
   - Press F12 key
   - Click "Console" tab
   - Look for errors

3. **Check for Success:**
   - ✅ No CORS errors
   - ✅ No 404 errors
   - ✅ Products are loading
   - ✅ Images are showing

---

## Common Issues

### Issue: Still seeing old backend URL in errors
**Solution:** 
1. Make sure you saved all environment variables
2. Redeploy the project (Deployments → Redeploy)
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: VITE_API_URL not working
**Solution:** 
1. Verify it's exactly: `https://nrx-store.onrender.com/api`
2. NO trailing slash
3. Must include `/api` at the end
4. Redeploy after changing

### Issue: Environment variables not showing
**Solution:** 
1. Make sure you selected "Production" environment
2. Click "Save" after each variable
3. Redeploy the project

---

## Screenshot Guide

1. **Dashboard:** Shows all your projects
2. **Settings:** Top navigation bar
3. **Environment Variables:** Left sidebar under Settings
4. **Add New:** Button at top right
5. **Environment Selection:** Checkboxes for Production/Preview/Development

---

## Testing Your Deployment

### Test 1: Check API Connection
Open browser console and run:
```javascript
fetch('https://nrx-store.onrender.com/api/products?onlyActive=true')
  .then(r => r.json())
  .then(d => console.log('Products:', d))
```

Should show products, not CORS error.

### Test 2: Check Environment Variables
Open browser console and run:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL)
```

Should show: `https://nrx-store.onrender.com/api`

---

## Deployment Status

Check deployment status:
1. Go to **Deployments** tab
2. Latest deployment should show:
   - ✅ Green checkmark = Success
   - 🔄 Spinning = In progress
   - ❌ Red X = Failed

If failed, click on it to see error logs.

---

## Next Steps

After Vercel is configured:

1. ✅ Vercel frontend is done
2. ✅ Render backend should already be done
3. ⏭️ Test your website thoroughly
4. ⏭️ Check all features work (login, products, orders)

---

## Final Checklist

- [ ] All 5 environment variables added
- [ ] All set to "Production" environment
- [ ] All variables saved
- [ ] Project redeployed
- [ ] Deployment shows green checkmark
- [ ] Website loads without errors
- [ ] Products are showing
- [ ] Can login/register
- [ ] No CORS errors in console

---

## Need Help?

If you see errors:
1. Take a screenshot of browser console (F12)
2. Take a screenshot of Vercel deployment logs
3. Share the error messages

We can debug together! 🚀

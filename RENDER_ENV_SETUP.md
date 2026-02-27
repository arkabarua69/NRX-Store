# 🎯 Render Environment Variables Setup

## Step-by-Step Instructions

### 1. Go to Render Dashboard
Visit: https://dashboard.render.com

### 2. Select Your Service
Click on your service: **nrx-store**

### 3. Go to Environment Tab
Click on **Environment** in the left sidebar

### 4. Add These Variables

Click **Add Environment Variable** for each one below:

---

**Variable 1:**
```
Key: FLASK_ENV
Value: production
```

---

**Variable 2:**
```
Key: FLASK_DEBUG
Value: False
```

---

**Variable 3:**
```
Key: SECRET_KEY
Value: Fe1i9VbqKZ7+czy6aB6j0+bsnvwKgwvpUPXSVYqdV9mP+c9i7VP3XBS5G5SAp9fMxhpiNldmlYWaN7eH6xw+eQ==
```

---

**Variable 4 (MOST IMPORTANT FOR CORS):**
```
Key: CORS_ORIGINS
Value: https://nrx-store.vercel.app,https://nrx-store-git-main-mac-gunjons-projects.vercel.app,http://localhost:5173
```
⚠️ **CRITICAL:** Copy this EXACTLY - no spaces, comma-separated

---

**Variable 5:**
```
Key: SUPABASE_URL
Value: https://qphpeuknvnmsnjkvomnz.supabase.co
```

---

**Variable 6:**
```
Key: SUPABASE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHBldWtudm5tc25qa3ZvbW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzA4NTcsImV4cCI6MjA4Nzc0Njg1N30.2SLIDduYLCWaPtBkrBdd75GUjcKBO8w-oiMOHRUQZsI
```

---

**Variable 7:**
```
Key: SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHBldWtudm5tc25qa3ZvbW56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE3MDg1NywiZXhwIjoyMDg3NzQ2ODU3fQ._h_OMGgnun12g4V5wRI2_WoWkFKu3OUd8goysZSPsI4
```

---

**Variable 8:**
```
Key: JWT_SECRET
Value: Fe1i9VbqKZ7+czy6aB6j0+bsnvwKgwvpUPXSVYqdV9mP+c9i7VP3XBS5G5SAp9fMxhpiNldmlYWaN7eH6xw+eQ==
```

---

**Variable 9:**
```
Key: ADMIN_EMAIL
Value: admin@nrxstore.com
```

---

**Variable 10:**
```
Key: ADMIN_PASSWORD
Value: Admin@NRX2024
```

---

**Variable 11:**
```
Key: PORT
Value: 5000
```

---

### 5. Save Changes
Click **Save Changes** button at the bottom

### 6. Wait for Redeploy
Render will automatically redeploy your service (takes 2-3 minutes)

### 7. Check Logs
Click on **Logs** tab to see if deployment is successful

Look for:
- ✅ "Build successful"
- ✅ "Deploy live"
- ✅ No error messages

---

## Quick Verification

After deployment completes, test these URLs in your browser:

1. **Health Check:**
   ```
   https://nrx-store.onrender.com/health
   ```
   Should show: `{"status": "healthy", "service": "game-topup-api"}`

2. **API Test:**
   ```
   https://nrx-store.onrender.com/api/products?onlyActive=true
   ```
   Should show products list (not 404)

---

## Common Issues

### Issue: Variables not showing up
**Solution:** Make sure you clicked "Save Changes" after adding all variables

### Issue: Still getting CORS errors
**Solution:** 
1. Double-check CORS_ORIGINS has NO SPACES
2. Make sure it includes your exact Vercel URL
3. Wait for redeploy to complete (check Logs tab)

### Issue: 500 Internal Server Error
**Solution:** 
1. Check Logs tab for error details
2. Verify all Supabase credentials are correct
3. Make sure SUPABASE_URL and keys match your production database

---

## Screenshot Guide

If you need visual help:

1. **Dashboard:** You should see your service listed
2. **Environment Tab:** Left sidebar, looks like a gear icon
3. **Add Variable:** Blue button that says "+ Add Environment Variable"
4. **Save:** Bottom of page, blue button "Save Changes"

---

## Next Steps

After Render is configured:

1. ✅ Render backend is done
2. ⏭️ Now configure Vercel frontend (see DEPLOYMENT_FIX_GUIDE.md)
3. ⏭️ Test your website

---

## Need Help?

If you see errors in Render logs, copy the error message and we can debug it together.

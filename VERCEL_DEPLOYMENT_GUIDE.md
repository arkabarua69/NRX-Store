# 🚀 Vercel Deployment Guide - CORS Fix

## ✅ Your Changes Are Already Pushed!

Good news - your CORS fixes are already in the GitHub repository. Now you need to deploy them to Vercel.

## 🎯 Choose Your Deployment Method

### Option 1: Automatic Deployment (Recommended - Easiest)

If your Vercel projects are connected to GitHub, they should auto-deploy automatically.

**Check Deployment Status:**
1. Go to https://vercel.com/dashboard
2. Find your projects (frontend and backend)
3. Check "Deployments" tab
4. You should see new deployments triggered by your recent push

**If auto-deploy is working:**
- ✅ Wait for deployments to complete (usually 2-3 minutes)
- ✅ Skip to "Update Environment Variables" section below

### Option 2: Manual Deployment from Vercel Dashboard

If auto-deploy isn't working:

**For Frontend:**
1. Go to https://vercel.com/dashboard
2. Select your frontend project
3. Click "Deployments" tab
4. Click "..." menu on latest deployment
5. Click "Redeploy"
6. Select "Use existing Build Cache" → Redeploy

**For Backend:**
1. Go to your backend project
2. Follow same steps as frontend

### Option 3: Deploy via Vercel CLI (Advanced)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy Frontend
cd frontend
vercel --prod

# Deploy Backend
cd ../backend
vercel --prod
```

## 🔧 Update Environment Variables (CRITICAL!)

After deployment, you MUST update environment variables:

### Backend Environment Variables

1. Go to: https://vercel.com/dashboard → Backend Project → Settings → Environment Variables

2. Update or add these variables:

```
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=Fe1i9VbqKZ7+czy6aB6j0+bsnvwKgwvpUPXSVYqdV9mP+c9i7VP3XBS5G5SAp9fMxhpiNldmlYWaN7eH6xw+eQ==

CORS_ORIGINS=https://nrx-store.vercel.app,https://nrx-store-git-main-mac-gunjons-projects.vercel.app,http://localhost:5173,http://localhost:3000

SUPABASE_URL=https://qphpeuknvnmsnjkvomnz.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHBldWtudm5tc25qa3ZvbW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzA4NTcsImV4cCI6MjA4Nzc0Njg1N30.2SLIDduYLCWaPtBkrBdd75GUjcKBO8w-oiMOHRUQZsI
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHBldWtudm5tc25qa3ZvbW56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE3MDg1NywiZXhwIjoyMDg3NzQ2ODU3fQ._h_OMGgnun12g4V5wRI2_WoWkFKu3OUd8goysZSPsI4

JWT_SECRET=Fe1i9VbqKZ7+czy6aB6j0+bsnvwKgwvpUPXSVYqdV9mP+c9i7VP3XBS5G5SAp9fMxhpiNldmlYWaN7eH6xw+eQ==

PORT=5000
```

3. **IMPORTANT**: After adding/updating variables, click "Redeploy" to apply them

### Frontend Environment Variables

1. Go to: https://vercel.com/dashboard → Frontend Project → Settings → Environment Variables

2. Update or add these variables:

```
VITE_SUPABASE_URL=https://qphpeuknvnmsnjkvomnz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaHBldWtudm5tc25qa3ZvbW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzA4NTcsImV4cCI6MjA4Nzc0Njg1N30.2SLIDduYLCWaPtBkrBdd75GUjcKBO8w-oiMOHRUQZsI

VITE_API_URL=https://nrx-store-2xew8664t-mac-gunjons-projects.vercel.app/api
```

**Note**: Replace the backend URL with your actual backend Vercel URL if different.

3. **IMPORTANT**: After adding/updating variables, click "Redeploy" to apply them

## 🧪 Test Your Deployment

After both deployments complete:

1. Open: https://nrx-store.vercel.app
2. Open browser console (F12)
3. Check for errors:
   - ✅ No CORS errors
   - ✅ No 308 redirect errors
   - ✅ API calls return 200 OK

4. Test functionality:
   - ✅ Homepage loads
   - ✅ Products display
   - ✅ Reviews load
   - ✅ Settings work
   - ✅ Login works

## 🔍 Troubleshooting

### GitHub Action Failing?

The GitHub Action needs secrets configured. You have two options:

**Option A: Disable GitHub Action (Easier)**

If Vercel auto-deploys from GitHub, you don't need the action:

```bash
# Rename the workflow file to disable it
git mv .github/workflows/vercel-deploy.yml .github/workflows/vercel-deploy.yml.disabled
git commit -m "chore: Disable GitHub Action (using Vercel auto-deploy)"
git push
```

**Option B: Configure GitHub Secrets**

1. Go to: https://github.com/arkabarua69/NRX-Store/settings/secrets/actions
2. Add these secrets:
   - `VERCEL_TOKEN` - Get from https://vercel.com/account/tokens
   - `VERCEL_ORG_ID` - Get from Vercel project settings
   - `VERCEL_PROJECT_ID` - Get from Vercel project settings
   - `VITE_SUPABASE_URL` - Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `VITE_API_URL` - Your backend URL

### Still Getting CORS Errors?

1. **Verify environment variables are saved** on Vercel
2. **Clear browser cache** (Ctrl+Shift+R)
3. **Check Vercel logs** for errors
4. **Verify both projects redeployed** after env changes

### 308 Redirects Still Happening?

1. Check browser network tab for double slashes
2. Verify `VITE_API_URL` has no trailing slash
3. Check Vercel function logs

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Vercel
- [ ] Frontend deployed on Vercel
- [ ] Backend environment variables updated
- [ ] Frontend environment variables updated
- [ ] Both projects redeployed after env changes
- [ ] Website tested in browser
- [ ] No CORS errors in console
- [ ] No 308 redirect errors
- [ ] All API endpoints working

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Website loads without errors
- ✅ No CORS errors in browser console
- ✅ API calls return data (check Network tab)
- ✅ All features work (login, products, cart, etc.)

## 💡 Pro Tips

1. **Use Vercel's auto-deploy**: Connect GitHub repo to Vercel for automatic deployments
2. **Monitor deployments**: Check Vercel dashboard after each push
3. **Check logs**: Use Vercel function logs to debug issues
4. **Test preview deployments**: Vercel creates preview URLs for each branch

---

**Need Help?**
- Check Vercel deployment logs
- Check browser console for errors
- Verify environment variables are correct

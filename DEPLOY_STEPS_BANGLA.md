# 🚀 Vercel Deploy করার Steps - CORS Fix

## ✅ তোমার Code Already Push হয়ে গেছে!

এখন শুধু Vercel এ deploy করতে হবে।

## 🎯 Deployment Method

### সবচেয়ে সহজ: Automatic Deployment

1. যাও: https://vercel.com/dashboard
2. তোমার frontend এবং backend project খুঁজো
3. "Deployments" tab check করো
4. নতুন deployment শুরু হয়ে গেছে কিনা দেখো

**যদি auto-deploy কাজ না করে:**
- প্রতিটা project এ যাও
- "Redeploy" button click করো

## 🔧 Environment Variables Update করো (MUST!)

### Backend Project

Vercel Dashboard → Backend → Settings → Environment Variables

```
CORS_ORIGINS=https://nrx-store.vercel.app,https://nrx-store-git-main-mac-gunjons-projects.vercel.app,http://localhost:5173
```

**Important**: Variable add/update করার পর "Redeploy" click করো!

### Frontend Project

Vercel Dashboard → Frontend → Settings → Environment Variables

```
VITE_API_URL=https://nrx-store-2xew8664t-mac-gunjons-projects.vercel.app/api
```

**Important**: শেষে slash দিও না! এবং save করার পর "Redeploy" করো!

## 🧪 Test করো

1. খোলো: https://nrx-store.vercel.app
2. Browser console খোলো (F12)
3. Check করো:
   - ✅ কোনো CORS error নেই
   - ✅ কোনো 308 redirect নেই
   - ✅ API calls কাজ করছে

## 🔍 যদি GitHub Action Fail করে?

**সহজ সমাধান**: GitHub Action disable করো (Vercel auto-deploy use করো)

```bash
git mv .github/workflows/vercel-deploy.yml .github/workflows/vercel-deploy.yml.disabled
git commit -m "chore: Disable GitHub Action"
git push
```

## 📋 Checklist

- [ ] Code pushed ✅ (Already done!)
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Backend env variables updated
- [ ] Frontend env variables updated
- [ ] Both redeployed after env changes
- [ ] Website tested - no errors!

---

**বিস্তারিত guide**: `VERCEL_DEPLOYMENT_GUIDE.md` দেখো

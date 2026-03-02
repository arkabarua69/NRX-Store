# Fix Chatbot CORS Error

## Problem
The chatbot is getting CORS error when trying to connect from Vercel to Render backend:
```
Access to fetch at 'https://nrx-store.onrender.com/api/chatbot' from origin 'https://nrx-store.vercel.app' has been blocked by CORS policy
```

## Root Cause
The Render backend's `CORS_ORIGINS` environment variable doesn't include the Vercel frontend URL.

## Solution

### Step 1: Update Render Environment Variables

Go to your Render dashboard → Backend service → Environment → Add the following:

```
CORS_ORIGINS=https://nrx-store.vercel.app,http://localhost:5173,http://192.168.0.113:5173
```

**Important:** 
- No trailing slashes
- Comma-separated
- Include both production (Vercel) and development (localhost) URLs

### Step 2: Redeploy Backend

After updating the environment variable, Render will automatically redeploy. Wait for the deployment to complete.

### Step 3: Test

Open your Vercel site and try the chatbot. It should now work without CORS errors.

## Alternative: Update via Render CLI

If you prefer using CLI:

```bash
# Install Render CLI
npm install -g @render/cli

# Login
render login

# Update environment variable
render env set CORS_ORIGINS="https://nrx-store.vercel.app,http://localhost:5173,http://192.168.0.113:5173" --service=nrx-store-backend
```

## Verification

After the fix, you should see:
- ✅ No CORS errors in browser console
- ✅ Chatbot responds normally
- ✅ Professional responses from Rafi, Sania, etc.

## Frontend Fix Applied

Also fixed the double `/api/api/` issue in the chatbot component:
- Changed from: `${API_BASE}/api/chatbot`
- Changed to: `${API_BASE}/chatbot`

Since `VITE_API_URL` already includes `/api`, we don't need to add it again.

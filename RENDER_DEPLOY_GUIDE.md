# Render Deployment Guide for NRX Store Backend

## Quick Fix for "No open ports detected" Error

The issue was that the app wasn't properly exposing itself for Gunicorn. This has been fixed.

## What Was Changed

1. **run.py** - Changed default environment to 'production' and moved app creation outside `if __name__` block
2. **Procfile** - Added explicit port binding and worker configuration
3. **render.yaml** - Created configuration file for Render (optional but recommended)

## Deploy to Render

### Option 1: Using Render Dashboard (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `nrx-store-backend`
   - **Region**: Singapore (or closest to your users)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn run:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
   - **Plan**: Free

5. Add Environment Variables (from your `.env.production` file):
   ```
   FLASK_ENV=production
   FLASK_DEBUG=False
   SECRET_KEY=<your-secret-key>
   SUPABASE_URL=https://qphpeuknvnmsnjkvomnz.supabase.co
   SUPABASE_KEY=<your-anon-key>
   SUPABASE_SERVICE_KEY=<your-service-key>
   JWT_SECRET=<your-jwt-secret>
   CORS_ORIGINS=https://nrx-store.vercel.app,http://localhost:5173
   ADMIN_EMAIL=admin@nrxstore.com
   ADMIN_PASSWORD=<your-admin-password>
   ```

6. Click "Create Web Service"

### Option 2: Using render.yaml (Infrastructure as Code)

1. The `render.yaml` file is already created in the backend folder
2. Push to GitHub
3. In Render Dashboard, click "New +" → "Blueprint"
4. Connect your repository and select the `backend/render.yaml` file
5. Add your environment variables in the Render dashboard

## Testing Locally Before Deploy

Run this command to test if the app starts correctly:

```bash
cd backend
python test_startup.py
```

If you see "🎉 All checks passed!", you're ready to deploy.

## Verify Deployment

After deployment, test these endpoints:

1. **Health Check**: `https://your-app.onrender.com/health`
   - Should return: `{"status": "healthy", "service": "game-topup-api"}`

2. **API Test**: `https://your-app.onrender.com/api/products`
   - Should return product list or appropriate response

## Update Frontend

After successful deployment, update your frontend `.env.production`:

```env
VITE_API_URL=https://your-app.onrender.com/api
```

## Troubleshooting

### Port Binding Issues
- Render automatically sets the `PORT` environment variable
- Gunicorn binds to `0.0.0.0:$PORT` (all interfaces)
- Health check endpoint is at `/health`

### App Won't Start
1. Check Render logs for errors
2. Verify all environment variables are set
3. Run `python test_startup.py` locally to debug

### CORS Errors
- Make sure `CORS_ORIGINS` includes your frontend URL
- Format: `https://nrx-store.vercel.app,http://localhost:5173` (comma-separated, no spaces)

### Database Connection Issues
- Verify Supabase credentials are correct
- Check if Supabase project is accessible from Render's IP

## Free Tier Limitations

Render's free tier:
- Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free (enough for one service)

Consider upgrading to paid tier for production use.

## Next Steps

1. Deploy backend to Render
2. Get the Render URL (e.g., `https://nrx-store-backend.onrender.com`)
3. Update frontend environment variables
4. Redeploy frontend to Vercel
5. Test the full application

## Support

If you encounter issues:
- Check Render logs: Dashboard → Your Service → Logs
- Review environment variables
- Test health endpoint
- Verify Supabase connection

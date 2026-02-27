# Environment Files Guide

## ✅ তৈরি হয়েছে

আপনার project এ এখন এই .env files আছে:

```
frontend/.env                    # Local development
frontend/.env.production         # Production deployment
backend/.env                     # Local development
backend/.env.production          # Production deployment
```

---

## 📁 File Structure

```
Nrx/
├── frontend/
│   ├── .env                    ← Local development এর জন্য
│   └── .env.production         ← Vercel deployment এর জন্য
│
└── backend/
    ├── .env                    ← Local development এর জন্য
    └── .env.production         ← Production deployment এর জন্য
```

---

## 🔧 Local Development

### Frontend চালানোর জন্য:
```bash
cd frontend
npm install
npm run dev
```
এটা automatically `frontend/.env` file ব্যবহার করবে।

### Backend চালানোর জন্য:
```bash
cd backend
pip install -r requirements.txt
python run.py
```
এটা automatically `backend/.env` file ব্যবহার করবে।

---

## 🚀 Vercel Deployment

### Frontend Deploy করার সময়:

Vercel Dashboard এ এই environment variables add করুন:

```
VITE_SUPABASE_URL=https://gitqowbfazbpycrixima.supabase.co

VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdHFvd2JmYXpicHljcml4aW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNjU2MDEsImV4cCI6MjA4Nzc0MTYwMX0.TDP7N-LjjfrJUoaxxPgdOmrJ3-KH46qimm6WaZziuUU

VITE_API_URL=https://your-project-name.vercel.app/api
```

**Note**: `.env.production` file Vercel automatically use করবে না। আপনাকে manually Vercel Dashboard এ variables add করতে হবে।

---

## 🔑 Environment Variables Explained

### Frontend Variables (VITE_ prefix লাগবে):

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase public key | `eyJhbGc...` |
| `VITE_API_URL` | Backend API endpoint | `http://localhost:5000/api` |

### Backend Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `FLASK_ENV` | Flask environment | `development` or `production` |
| `FLASK_DEBUG` | Debug mode | `True` or `False` |
| `SECRET_KEY` | Flask secret key | Random string |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | Supabase anon key | `eyJhbGc...` |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | `eyJhbGc...` |
| `JWT_SECRET` | JWT signing secret | Random string |
| `ADMIN_EMAIL` | Admin user email | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin user password | Strong password |

---

## 🔒 Security Notes

### ⚠️ Important:

1. **Never commit .env files to Git**
   - Already in `.gitignore`
   - Contains sensitive credentials

2. **Different values for development and production**
   - Development: `FLASK_DEBUG=True`, `localhost` URLs
   - Production: `FLASK_DEBUG=False`, actual domain URLs

3. **Keep credentials safe**
   - Don't share .env files
   - Don't post on public forums
   - Use environment variables in hosting platforms

---

## 📝 How to Use

### Local Development:

1. **Frontend**:
   ```bash
   cd frontend
   npm run dev
   # Uses frontend/.env automatically
   ```

2. **Backend**:
   ```bash
   cd backend
   python run.py
   # Uses backend/.env automatically
   ```

### Production Deployment:

1. **Vercel (Frontend)**:
   - Go to Vercel Dashboard
   - Add environment variables manually
   - Deploy

2. **Railway/Render (Backend)**:
   - Go to hosting dashboard
   - Add environment variables from `backend/.env.production`
   - Deploy

---

## 🔄 Update Environment Variables

### Local:
Edit the `.env` files directly.

### Vercel:
1. Go to Project Settings
2. Environment Variables
3. Edit or add new variables
4. Redeploy

### Railway/Render:
1. Go to project settings
2. Variables section
3. Edit or add new variables
4. Redeploy

---

## ✅ Checklist

Before deploying, verify:

- [ ] `frontend/.env` exists with correct values
- [ ] `backend/.env` exists with correct values
- [ ] `.env` files are in `.gitignore`
- [ ] Vercel environment variables configured
- [ ] Backend hosting environment variables configured
- [ ] `VITE_API_URL` points to correct backend URL
- [ ] All sensitive keys are secure

---

## 🆘 Troubleshooting

### Frontend can't connect to backend:
- Check `VITE_API_URL` is correct
- Verify backend is running
- Check CORS settings in backend

### Environment variables not working:
- Ensure `VITE_` prefix for frontend variables
- Restart dev server after changing .env
- Clear browser cache

### Build fails on Vercel:
- Verify all required variables are set
- Check variable names are correct
- Ensure no typos in values

---

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Flask Configuration](https://flask.palletsprojects.com/en/2.3.x/config/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Status**: ✅ All .env files created and configured
**Ready for**: Local development and deployment

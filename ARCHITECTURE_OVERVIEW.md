# 🏗️ NRX Store Architecture Overview

## Current Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                                │
│                  (Browser/Mobile)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                         │
│  https://nrx-store.vercel.app                               │
│                                                              │
│  • React + TypeScript + Vite                                │
│  • Tailwind CSS + shadcn/ui                                 │
│  • Supabase Auth (Client-side)                              │
│                                                              │
│  Environment Variables:                                      │
│  ├─ VITE_API_URL=https://nrx-store.onrender.com/api        │
│  ├─ VITE_SUPABASE_URL=https://qphpeuknvnmsnjkvomnz...      │
│  └─ VITE_SUPABASE_ANON_KEY=eyJhbGci...                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ REST API Calls
                     │ (with CORS)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Render)                          │
│  https://nrx-store.onrender.com                             │
│                                                              │
│  • Python Flask                                              │
│  • Gunicorn WSGI Server                                      │
│  • Flask-CORS enabled                                        │
│                                                              │
│  API Routes:                                                 │
│  ├─ /api/auth/*      (Authentication)                       │
│  ├─ /api/products/*  (Products CRUD)                        │
│  ├─ /api/orders/*    (Orders Management)                    │
│  ├─ /api/admin/*     (Admin Operations)                     │
│  ├─ /api/users/*     (User Profile)                         │
│  └─ /api/reviews/*   (Reviews)                              │
│                                                              │
│  Environment Variables:                                      │
│  ├─ CORS_ORIGINS=https://nrx-store.vercel.app,...          │
│  ├─ SUPABASE_URL=https://qphpeuknvnmsnjkvomnz...           │
│  ├─ SUPABASE_SERVICE_KEY=eyJhbGci...                       │
│  └─ JWT_SECRET=Fe1i9VbqKZ7...                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ PostgreSQL Protocol
                     │ (Supabase Client)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (Supabase)                         │
│  https://qphpeuknvnmsnjkvomnz.supabase.co                  │
│                                                              │
│  • PostgreSQL Database                                       │
│  • Row Level Security (RLS)                                  │
│  • Real-time Subscriptions                                   │
│  • Storage for Images                                        │
│                                                              │
│  Tables:                                                     │
│  ├─ users          (User accounts)                          │
│  ├─ products       (Game packages)                          │
│  ├─ orders         (Purchase orders)                        │
│  ├─ reviews        (Product reviews)                        │
│  ├─ notifications  (User notifications)                     │
│  ├─ settings       (Site settings)                          │
│  ├─ support        (Support tickets)                        │
│  └─ faq            (FAQ items)                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Visits Website
```
User → Vercel CDN → React App Loads → Supabase Auth Check
```

### 2. Fetch Products
```
React Component → API Call → Render Backend → Supabase Query → Return Data
```

### 3. User Login
```
User Input → Supabase Auth (Client) → Get Token → Store in LocalStorage
```

### 4. Create Order
```
User → React Form → API Call (with Token) → Render Backend → 
Verify Token → Insert to Supabase → Return Order ID
```

### 5. Admin Operations
```
Admin → Login → Get Admin Token → API Calls → Backend Verifies Admin → 
Supabase Operations → Return Results
```

## Key Components

### Frontend (Vercel)
- **Hosting:** Vercel Edge Network (Global CDN)
- **Build:** Vite (Fast build tool)
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **State:** React Context API + Local State
- **Auth:** Supabase Auth Client
- **Routing:** React Router v6

### Backend (Render)
- **Hosting:** Render.com (US-based servers)
- **Runtime:** Python 3.11
- **Framework:** Flask 3.x
- **Server:** Gunicorn (4 workers)
- **CORS:** Flask-CORS
- **Auth:** JWT tokens + Supabase verification
- **Database Client:** Supabase Python SDK

### Database (Supabase)
- **Type:** PostgreSQL 15
- **Location:** AWS (US region)
- **Features:** 
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage buckets
  - Edge Functions
  - Auth management

## Security

### Authentication Flow
```
1. User logs in via Supabase Auth (Google OAuth or Email)
2. Supabase returns JWT token
3. Frontend stores token in localStorage
4. Every API call includes: Authorization: Bearer <token>
5. Backend verifies token with Supabase
6. Backend checks user permissions
7. Backend executes operation
```

### CORS Configuration
```
Frontend Origin: https://nrx-store.vercel.app
Backend CORS:    Allows above origin
Methods:         GET, POST, PUT, DELETE, PATCH, OPTIONS
Headers:         Content-Type, Authorization, Cache-Control
Credentials:     Enabled (for cookies/auth)
```

### Environment Variables Security
- ✅ Never committed to Git
- ✅ Stored in platform dashboards (Vercel/Render)
- ✅ Different values for dev/production
- ✅ Service keys only on backend
- ✅ Anon keys only on frontend

## Performance

### Frontend Optimization
- Code splitting (React.lazy)
- Image optimization (WebP format)
- Lazy loading components
- Caching strategies
- PWA support (Service Worker)

### Backend Optimization
- Gunicorn with multiple workers
- Connection pooling (Supabase)
- Response caching
- Gzip compression
- Efficient SQL queries

### Database Optimization
- Indexed columns (id, email, user_id)
- Foreign key constraints
- Materialized views for stats
- Query optimization
- Connection pooling

## Monitoring

### Frontend (Vercel)
- Deployment logs
- Function logs
- Analytics dashboard
- Error tracking

### Backend (Render)
- Application logs
- Health check endpoint: `/health`
- Error logs
- Performance metrics

### Database (Supabase)
- Query performance
- Connection stats
- Storage usage
- API usage

## Scaling Considerations

### Current Setup (Free/Hobby Tier)
- Frontend: Unlimited bandwidth (Vercel)
- Backend: Sleeps after 15 min inactivity (Render)
- Database: 500MB storage, 2GB bandwidth (Supabase)

### Upgrade Path
1. **Render Pro ($7/mo):** Always-on backend, no sleep
2. **Supabase Pro ($25/mo):** 8GB storage, 50GB bandwidth
3. **Vercel Pro ($20/mo):** Advanced analytics, more builds

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS_ORIGINS in Render
   - Verify frontend URL is exact match
   - Check browser console for details

2. **404 Errors**
   - Verify API_URL ends with `/api`
   - Check backend routes are registered
   - Test backend directly

3. **Database Connection**
   - Verify Supabase credentials
   - Check Supabase project is active
   - Test connection from backend logs

4. **Slow First Load**
   - Render free tier sleeps
   - First request wakes up backend (30-60s)
   - Consider upgrading to Pro

## Deployment Checklist

- [ ] Backend env vars set in Render
- [ ] Frontend env vars set in Vercel
- [ ] Both services deployed
- [ ] Health check passes
- [ ] CORS working
- [ ] Database connected
- [ ] Auth working
- [ ] All features tested

## URLs Reference

- **Production Frontend:** https://nrx-store.vercel.app
- **Production Backend:** https://nrx-store.onrender.com
- **Backend API:** https://nrx-store.onrender.com/api
- **Backend Health:** https://nrx-store.onrender.com/health
- **Database:** https://qphpeuknvnmsnjkvomnz.supabase.co
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard

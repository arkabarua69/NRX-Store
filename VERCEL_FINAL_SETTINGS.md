# Vercel Final Configuration Settings

## 🎯 এই Settings দিন Vercel Dashboard এ

### Application Preset (Framework)
```
Vite
```
(Dropdown থেকে সিলেক্ট করুন)

---

### Root Directory
```
frontend
```
**Important**: "Edit" button ক্লিক করে `frontend` লিখুন অথবা browse করে frontend folder সিলেক্ট করুন

---

### Build Command
```
npm run build
```

---

### Output Directory
```
dist
```

---

### Install Command
```
npm install
```

---

## 🔑 Environment Variables

"Add Environment Variable" button ক্লিক করে এই 3টি variable add করুন:

### Variable 1
```
Name: VITE_SUPABASE_URL
Value: https://gitqowbfazbpycrixima.supabase.co
Environment: Production, Preview, Development (সব check করুন)
```

### Variable 2
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdHFvd2JmYXpicHljcml4aW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNjU2MDEsImV4cCI6MjA4Nzc0MTYwMX0.TDP7N-LjjfrJUoaxxPgdOmrJ3-KH46qimm6WaZziuUU
Environment: Production, Preview, Development (সব check করুন)
```

### Variable 3
```
Name: VITE_API_URL
Value: http://localhost:5000/api
Environment: Production, Preview, Development (সব check করুন)
```

**Note**: Backend deploy করার পর এই URL update করবেন

---

## ✅ Final Checklist

Deploy করার আগে verify করুন:

- [ ] Framework: Vite selected
- [ ] Root Directory: `frontend` set করা আছে
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`
- [ ] 3টি environment variables add করা হয়েছে
- [ ] সব variables এ Production, Preview, Development check করা আছে

---

## 🚀 Deploy Button ক্লিক করুন!

সব settings ঠিক থাকলে "Deploy" button ক্লিক করুন।

Deploy শুরু হবে এবং 2-3 মিনিটে complete হবে! 🎉

---

## 📊 Deploy হওয়ার পর

1. ✅ Frontend live হয়ে যাবে
2. 🔗 Vercel URL পাবেন (যেমন: `https://nrx-store.vercel.app`)
3. 🧪 Homepage visit করে test করুন
4. 🚂 Backend Railway তে deploy করুন (পরে)
5. 🔄 Backend URL দিয়ে `VITE_API_URL` update করুন

---

**Ready to Deploy!** 🚀

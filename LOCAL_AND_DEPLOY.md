# 🚀 DEPLOY + LOCAL TEST - COMPLETE GUIDE

## ✅ LOCAL TEST (Hozir ko'ring!)

### Backend: RUNNING ✅
```
http://localhost:5000/api/health
```

### Frontend: RUNNING ✅
```
http://localhost:3000
```

**LOGIN QI'L:**
- Username: `ali` (yoki `admin`)
- Password: `seller123` (yoki `admin123`)

---

## 🌐 PRODUCTION DEPLOY (GitHub + Netlify + Render)

### STEP 1: GitHub'da Repo Yarating (2 minut)

1. https://github.com/new'ga boring
2. **Repository name**: `warehouse-app`
3. **Description**: `Warehouse Inventory & Sales Management`
4. **Public** tanlang
5. **Create repository** tugmasini bosing

### STEP 2: GitHub'ga Code Push Qiling

Terminal'da:
```powershell
cd c:\Users\user\Desktop\nothing\warehouse-app

# Git config (birinchi marta)
git config --global user.name "Your Full Name"
git config --global user.email "your.email@gmail.com"

# Remote qo'shish
git remote add origin https://github.com/YOUR_USERNAME/warehouse-app.git
git branch -M main
git push -u origin main

# Tugab bo'lganini tekshirish
git log --oneline
```

✅ **GitHub'da repo ko'rinadi**: https://github.com/YOUR_USERNAME/warehouse-app

### STEP 3: Render'da Backend Deploy Qiling (5 minut)

1. https://render.com'ga boring
2. **Dashboard** → **New +** → **Web Service** tanlang
3. **Connect a repository** bo'limida GitHub'dan `warehouse-app` tanlang

**Build Settings:**
```
Name: warehouse-backend
Runtime: Node
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

**Environment Variables (ADD qilish):**
```
PORT = 5000
NODE_ENV = production
SECRET_KEY = your-secret-key-2026-warehouse
```

4. **Create Web Service** tugmasini bosing
5. ⏳ **3-5 minut kutish** (deploy bo'lguniga dek)
6. Deploy tugangandan keyin, **URL ni ko'chirib oling**
   - Misol: `https://warehouse-backend-abc123.onrender.com`

### STEP 4: Frontend'ni Backend URL bilan Update Qiling (2 minut)

Terminal'da:
```powershell
cd c:\Users\user\Desktop\nothing\warehouse-app\frontend

# Backend URL'ni qo'shish (STEP 3'dan olingan URL)
@"
VITE_API_URL=https://warehouse-backend-abc123.onrender.com
"@ | Set-Content .env.production

# Build
npm run build

# Netlify'ga deploy
cd ..
netlify deploy --prod --dir=frontend/dist --message="Production Deploy"
```

✅ **Frontend deploy tugadi**: https://moshna.netlify.app

### STEP 5: Tekshirish

1. https://moshna.netlify.app'ga boring
2. Login: `admin` / `admin123` (yoki `ali` / `seller123`)
3. Dashboard'ni oching
4. **Ombor** → Mahsulotlarni ko'ring
5. **Sotuv** → Sotuv qilishga harakat qiling

---

## 🧪 LOCAL TEST (Hozir)

### Terminal 1: Backend (Already Running)
```
✅ http://localhost:5000
```

### Terminal 2: Frontend (Already Running)
```
✅ http://localhost:3000
```

### Login Test:
```
Username: ali
Password: seller123
```

### Test Qiladigan Narsa:
1. ✅ Login qilish
2. ✅ Dashboard ko'rish (Statistika)
3. ✅ **Ombor** → Mahsulotlar ro'yxati
4. ✅ **Sotuv** → Savat qilish
5. ✅ **Tarix** → Sotuvlar tarixi

---

## 📋 CHECKLIST

### Local Test
- [ ] Backend running (localhost:5000)
- [ ] Frontend running (localhost:3000)
- [ ] Login successful
- [ ] Dashboard loads
- [ ] Can view products
- [ ] Can add to cart

### Production Deploy
- [ ] GitHub repo created
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Netlify
- [ ] Backend URL added to .env.production
- [ ] Frontend redeployed
- [ ] Production login works
- [ ] Dashboard loads on production

---

## 🔗 FINAL LINKS

| Component | Local | Production |
|-----------|-------|------------|
| Frontend | http://localhost:3000 | https://moshna.netlify.app |
| Backend | http://localhost:5000 | https://warehouse-backend-xxx.onrender.com |
| GitHub | - | https://github.com/YOUR_USERNAME/warehouse-app |

---

## ⚠️ MUAMMOLAR?

### Local'da ishlamaydi
```powershell
# Backend restart
cd backend
npm install
npm start

# Frontend restart
cd frontend
npm install
npm run dev
```

### Deploy'da API bilan bog'lanmaydi
- ✅ Backend URL'ni to'g'ri kiritganligini tekshiring
- ✅ `.env.production` faylni tekshiring
- ✅ Backend Render'da ishga tushganini tekshiring

### Render deploy xatosi
- https://dashboard.render.com'da logs'ni tekshiring
- Environment variables'ni verify qiling
- GitHub integration'ni tekshiring

---

## ✨ READY!

**LOCAL TEST**: Hozir http://localhost:3000'da ishga tushgan! ✅

**PRODUCTION**: Yuqorida ko'rsatilgan bosqichlarni qil! 🚀

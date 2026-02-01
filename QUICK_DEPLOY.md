# 🚀 BIRDAN DEPLOY - ONE-LINER INSTRUCTIONS

## ⚡ SUPER TEZ (Copy-Paste)

### STEP 1: GitHub Setup (Bir-ikki minut)
```powershell
# GitHub'da new repo yaratish:
# https://github.com/new
# Repository name: warehouse-app
# Public tanlang
# Create repository

# Keyin terminal'da:
cd c:\Users\user\Desktop\nothing\warehouse-app

git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git remote add origin https://github.com/YOUR_USERNAME/warehouse-app.git
git branch -M main
git push -u origin main
```

### STEP 2: Render Backend Deploy (5 minut)
1. https://render.com'ga boring
2. **New +** → **Web Service**
3. GitHub repo tanlang
4. Quyidagilarni fill qiling:

```
Name: warehouse-backend
Runtime: Node
Root Directory: backend
Build Command: npm install
Start Command: npm start

Environment:
PORT=5000
NODE_ENV=production
SECRET_KEY=your-secret-key-2026
```

5. **Deploy** tugmasini bosing
6. ⏳ 3-5 minut kutish
7. Backend URL ni ko'chirib oling (URL bar'da)

### STEP 3: Frontend Update (1 minut)
```powershell
cd c:\Users\user\Desktop\nothing\warehouse-app

# STEP 2'dan backend URL'ni qo'shing:
echo "VITE_API_URL=https://warehouse-backend-xxx.onrender.com" | Set-Content frontend\.env.production

cd frontend
npm run build
cd ..
netlify deploy --prod --dir=frontend/dist
```

## ✅ TAYYORLANDI!

| Component | Status | Link |
|-----------|--------|------|
| Frontend | ✅ Live | https://moshna.netlify.app |
| Backend | ✅ Deploy | https://warehouse-backend-xxx.onrender.com |
| GitHub | ✅ Repo | https://github.com/YOUR_USERNAME/warehouse-app |

## 🧪 TEST
1. https://moshna.netlify.app'ga boring
2. Login: `admin` / `admin123`
3. Dashboard'ni tekshiring

---

## ⚠️ MUAMMOLAR?

**Backend deploy xatosi:**
- https://dashboard.render.com'da logs'ni tekshiring
- Environment variables'ni verify qiling
- `npm start` command to'g'ri ekanligini tekshiring

**Frontend API bilan bog'lanmaydi:**
- Backend URL'ni to'g'ri kiritganligini tekshiring
- Browser console'da errors'ni tekshiring
- Backend status'ni tekshiring: Backend URL'ni brauzerda oching

**Localhost'da ishga tushi:**
```powershell
cd c:\Users\user\Desktop\nothing\warehouse-app\backend
npm install
npm start

# Boshqa terminal'da:
cd c:\Users\user\Desktop\nothing\warehouse-app\frontend
npm run dev
```

---

**HAMMA TAYYORLANDI!** 🎉

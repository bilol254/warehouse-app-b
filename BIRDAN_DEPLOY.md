# 🚀 OMBOR APP - DEPLOY QI'L (BIRDAN!)

## ✅ TAYYORLANGAN

### Frontend (Netlify)
- **Status**: ✅ LIVE
- **Link**: https://moshna.netlify.app
- **Automatik deploy qilingan**

### Backend (Render)
- **Status**: ⏳ Manual deploy (2 minut)
- **Process**: Quyidagini qiling

---

## 📋 BACKEND DEPLOY (FAQAT 3 BOSQICH!)

### BOSQICH 1: GitHub'da Repo Yarating
1. https://github.com/new'ga boring
2. Repository name: `warehouse-app`
3. Private/Public tanlang
4. Create repository tugmasini bosing

### BOSQICH 2: Kodni GitHub'ga Push Qiling
```powershell
cd c:\Users\user\Desktop\nothing\warehouse-app

# Git config
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Remote qo'shish
git remote add origin https://github.com/YOUR_USERNAME/warehouse-app.git
git branch -M main
git push -u origin main
```

### BOSQICH 3: Render.com'ga Deploy Qiling
1. https://render.com'ga boring va login qiling
2. **New +** tugmasini bosing
3. **Web Service** tanlang
4. GitHub'da warehouse-app repo tanlang

**Sozlamalar:**
```
Name: warehouse-backend
Runtime: Node
Root Directory: backend
Build Command: npm install
Start Command: npm start

Environment Variables:
PORT=5000
SECRET_KEY=your-secret-key-change-in-production
NODE_ENV=production
```

5. **Create Web Service** tugmasini bosing
6. 2-3 minut kutib deploy tugangani tekshiring

---

## 🔗 BACKEND URL OLISH VA FRONTEND UPDATE QILISH

Render deploy tugangandan keyin:

1. **Backend URL ni ko'chirib oling** (misol: `https://warehouse-backend-abc123.onrender.com`)

2. **Frontend'ni update qiling:**
```powershell
cd c:\Users\user\Desktop\nothing\warehouse-app\frontend

# .env.production faylini yarating
@"
VITE_API_URL=https://your-backend-url-here.onrender.com
"@ | Set-Content .env.production

# Build qilish
npm run build

# Netlify'ga deploy qilish
netlify deploy --prod --dir=dist
```

---

## ✨ NATIJA

### Frontend
🌐 https://moshna.netlify.app

### Backend
🔧 https://warehouse-backend-xxx.onrender.com (Siz deploy qilganingizdan)

### Test Hisoblar
| Username | Password   | Rol      |
|----------|-----------|----------|
| admin    | admin123  | Manager  |
| ali      | seller123 | Seller   |

---

## 📝 MURAKKAB JOYLAR?

### `npm install` xatosi
```powershell
npm cache clean --force
npm install
```

### Render deploy muvaffaqiyatsiz
1. Build logs'ni tekshiring
2. Environment variables'ni verify qiling
3. Start command: `npm start` (yo'q `npm run dev`)

### Frontend API bilan bog'lanmaydi
1. Backend URL'ni to'g'ri kiritganligini tekshiring
2. Backend CORS enabled (code'da mavjud)
3. `.env.production` faylni tekshiring

---

## 🎉 TAMAMLASH

Endi:
1. Backend Render'da ishga tushgunini kutish
2. Frontend backend bilan test qilish
3. Admin hisobi bilan login qilish

**Barchasiga tayyor!** ✨


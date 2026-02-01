# Ombor - Warehouse Management System

## 🚀 LIVE LINKS

### Frontend (Netlify)
🌐 **Production**: https://moshna.netlify.app

### Backend Deployment (Manual - Deploy to Render.com)

**Render.com ga Backend Deploy Qilish:**

1. GitHub'dan push qiling:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/warehouse-app.git
   git branch -M main
   git push -u origin main
   ```

2. Render.com'da yangi Web Service yarating:
   - https://dashboard.render.com/new/web
   - GitHub repository tanlang
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment: Node
   - Port: 5000

3. Environment Variables:
   - `PORT=5000`
   - `SECRET_KEY=your-secret-key-change-in-production`

4. Backend URL ni frontend .env.production ga qo'shing:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

5. Frontend qayta build va deploy:
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod --dir=dist
   ```

---

## 📋 Test Hisoblar

| Username | Password   | Rol      |
|----------|-----------|----------|
| admin    | admin123  | Manager  |
| ali      | seller123 | Seller   |

## 📖 README

Batafsil dokumentatsiya uchun: [README.md](README.md)

## 🔗 Links

- **Frontend Demo**: https://moshna.netlify.app
- **Backend**: (Ko'rsatishlar yuqorida)
- **GitHub**: (GitHub'dan push qiling)

---

**Ishlatilingan Teknologiyalar:**
- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Node.js + Express + SQLite
- Deployment: Netlify (Frontend) + Render (Backend)


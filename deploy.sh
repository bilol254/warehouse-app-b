#!/bin/bash
# Warehouse App - One Click Deploy Script
# Bu script frontend'ni Netlify'ga va backend'ni Render'ga deploy qiladi

echo "🚀 Ombor App - Deploy Boshlandi..."
echo ""

# 1. Frontend Build
echo "📦 Frontend build qilinimoqda..."
cd frontend
npm install --silent
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build xatosi!"
    exit 1
fi
echo "✅ Frontend build tayyor!"
echo ""

# 2. Netlify Deploy
echo "🌐 Netlify'ga deploy qilinimoqda..."
cd ..
if ! command -v netlify &> /dev/null; then
    echo "📥 Netlify CLI o'rnatilmoqda..."
    npm install -g netlify-cli --silent
fi

netlify deploy --prod --dir=frontend/dist --message="Warehouse App Deploy - $(date)"
if [ $? -ne 0 ]; then
    echo "⚠️  Netlify deploy kutilmagan natija berdi. Manual tekshiring."
fi
echo "✅ Frontend Netlify'da deploy qilindi!"
echo ""

# 3. Backend Render Deploy
echo "🔧 Backend Render.com'ga deploy qilish uchun:"
echo ""
echo "1. https://dashboard.render.com/new/web'ga boring"
echo "2. GitHub repository linkini qo'shing"
echo "3. Quyidagi sozlamalarni qo'llang:"
echo ""
echo "   • Build Command: npm install"
echo "   • Start Command: npm start"
echo "   • Root Directory: backend"
echo "   • Environment Variables:"
echo "     - PORT=5000"
echo "     - SECRET_KEY=your-secret-key-change"
echo "     - NODE_ENV=production"
echo ""
echo "4. Deploy tugmasini bosing"
echo ""
echo "5. Backend URL ni olganingizdan keyin, quyidagi buyruqni ishlating:"
echo ""
echo "   cd frontend"
echo "   echo 'VITE_API_URL=https://your-backend-url.onrender.com' > .env.production"
echo "   npm run build"
echo "   netlify deploy --prod --dir=dist"
echo ""

# 4. Git Commit
echo "📝 Git commit qilinimoqda..."
git add .
git commit -m "Deploy: Frontend to Netlify - $(date)" -q
echo "✅ Git commit tayyor!"
echo ""

echo "✨ Deploy jarayoni yakunlandi!"
echo ""
echo "📋 Qolganlari:"
echo "1. GitHub'da repo yarating"
echo "2. Backend'ni Render'ga deploy qiling (yuqorida ko'rsatilgan)"
echo "3. Frontend'ni qayta build qiling"
echo ""

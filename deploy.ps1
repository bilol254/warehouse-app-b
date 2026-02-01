#!/usr/bin/env pwsh
# Warehouse App - One Click Deploy Script (Windows)

Write-Host "🚀 Ombor App - Deploy Boshlandi..." -ForegroundColor Green
Write-Host ""

# 1. Frontend Build
Write-Host "📦 Frontend build qilinimoqda..." -ForegroundColor Cyan
Set-Location frontend
npm install --silent
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build xatosi!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend build tayyor!" -ForegroundColor Green
Write-Host ""

# 2. Netlify Deploy
Write-Host "🌐 Netlify'ga deploy qilinimoqda..." -ForegroundColor Cyan
Set-Location ..
try {
    netlify deploy --prod --dir=frontend/dist --message="Warehouse App Deploy"
    Write-Host "✅ Frontend Netlify'da deploy qilindi!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Netlify deploy kutilmagan natija berdi. Manual tekshiring." -ForegroundColor Yellow
}
Write-Host ""

# 3. Backend Render Deploy
Write-Host "🔧 Backend Render.com'ga deploy qilish uchun:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. https://dashboard.render.com/new/web'ga boring" -ForegroundColor White
Write-Host "2. GitHub repository linkini qo'shing" -ForegroundColor White
Write-Host "3. Quyidagi sozlamalarni qo'llang:" -ForegroundColor White
Write-Host ""
Write-Host "   • Build Command: npm install" -ForegroundColor Gray
Write-Host "   • Start Command: npm start" -ForegroundColor Gray
Write-Host "   • Root Directory: backend" -ForegroundColor Gray
Write-Host "   • Environment Variables:" -ForegroundColor Gray
Write-Host "     - PORT=5000" -ForegroundColor Gray
Write-Host "     - SECRET_KEY=your-secret-key-change" -ForegroundColor Gray
Write-Host "     - NODE_ENV=production" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Deploy tugmasini bosing" -ForegroundColor White
Write-Host ""
Write-Host "5. Backend URL ni olganingizdan keyin, quyidagi buyruqni ishlating:" -ForegroundColor White
Write-Host ""
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   `"VITE_API_URL=https://your-backend-url.onrender.com`" | Set-Content .env.production" -ForegroundColor Gray
Write-Host "   npm run build" -ForegroundColor Gray
Write-Host "   netlify deploy --prod --dir=dist" -ForegroundColor Gray
Write-Host ""

# 4. Git Commit
Write-Host "📝 Git commit qilinimoqda..." -ForegroundColor Cyan
git add .
git commit -m "Deploy: Frontend to Netlify" -q
Write-Host "✅ Git commit tayyor!" -ForegroundColor Green
Write-Host ""

Write-Host "✨ Deploy jarayoni yakunlandi!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Qolganlari:" -ForegroundColor Yellow
Write-Host "1. GitHub'da repo yarating (opsional)" -ForegroundColor White
Write-Host "2. Backend'ni Render'ga deploy qiling (yuqorida ko'rsatilgan)" -ForegroundColor White
Write-Host "3. Frontend'ni qayta build qiling" -ForegroundColor White
Write-Host ""

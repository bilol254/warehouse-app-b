#!/usr/bin/env pwsh
# FINAL - Frontend Qayta Deploy (Backend URL bilan)

Write-Host "
╔═══════════════════════════════════════════╗
║  🔄 FRONTEND QAYTA DEPLOY (Backend URL)   ║
╚═══════════════════════════════════════════╝
" -ForegroundColor Cyan

$projectPath = "c:\Users\user\Desktop\nothing\warehouse-app"
$backendUrl = Read-Host "Backend URL'ni kiriting (masalan: https://warehouse-backend-xxx.onrender.com)"

if (-not $backendUrl) {
    Write-Host "❌ Backend URL talab qilinadi!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 STEP 1: .env.production Update" -ForegroundColor Cyan

# Update environment variable
$envContent = "VITE_API_URL=$backendUrl"
Set-Content "$projectPath\frontend\.env.production" $envContent
Write-Host "✅ .env.production sozlandi: VITE_API_URL=$backendUrl" -ForegroundColor Green

Write-Host ""
Write-Host "📦 STEP 2: Frontend Build" -ForegroundColor Cyan

Set-Location "$projectPath\frontend"
npm install --silent
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build xatosi!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build tayyor!" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 STEP 3: Netlify'ga Deploy" -ForegroundColor Cyan

Set-Location $projectPath
netlify deploy --prod --dir=frontend/dist --message="Backend URL Update: $backendUrl"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "═════════════════════════════════" -ForegroundColor Green
    Write-Host "✨ FRONTEND DEPLOY TUGADI!" -ForegroundColor Green
    Write-Host "═════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 Frontend: https://moshna.netlify.app" -ForegroundColor Cyan
    Write-Host "🔧 Backend: $backendUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🧪 Test Qilib Ko'ring:" -ForegroundColor Yellow
    Write-Host "  • Saytga boring: https://moshna.netlify.app" -ForegroundColor White
    Write-Host "  • Login: admin / admin123" -ForegroundColor White
    Write-Host "  • Dashboard'ni tekshiring" -ForegroundColor White
} else {
    Write-Host "⚠️  Deploy kutilmagan natija berdi. Logs'ni tekshiring." -ForegroundColor Yellow
}

#!/usr/bin/env pwsh
# OMBOR APP - BIRDAN BARCHA DEPLOY (GitHub + Render + Netlify)
# Bu script hamma narsani avtomatik qiladi!

Write-Host "
╔════════════════════════════════════════════╗
║   🚀 OMBOR APP - BIRDAN DEPLOY BOSHLANDI   ║
╚════════════════════════════════════════════╝
" -ForegroundColor Green

# Configuration
$githubUsername = Read-Host "GitHub username'ni kiriting (masalan: your-username)"
$githubEmail = Read-Host "GitHub email'ni kiriting (masalan: your@email.com)"
$repoName = "warehouse-app"
$projectPath = "c:\Users\user\Desktop\nothing\warehouse-app"

Write-Host ""
Write-Host "📝 STEP 1: GitHub Konfiguratsiyasi" -ForegroundColor Cyan
Write-Host "=================================="

# Git global config
git config --global user.name "$githubUsername"
git config --global user.email "$githubEmail"
Write-Host "✅ Git config sozlandi" -ForegroundColor Green

# GitHub personal access token oling
Write-Host ""
Write-Host "⚠️  GitHub Personal Access Token kerak!" -ForegroundColor Yellow
Write-Host "1. https://github.com/settings/tokens'ga boring" -ForegroundColor White
Write-Host "2. New token (classic) tugmasini bosing" -ForegroundColor White
Write-Host "3. Token name: warehouse-deploy" -ForegroundColor White
Write-Host "4. Scopelar: repo, workflow" -ForegroundColor White
Write-Host "5. Token'ni ko'chirib oling" -ForegroundColor White

$githubToken = Read-Host "GitHub token'ni kiriting (yoki ENTER teng qilib skip qiling)"

if ($githubToken) {
    Write-Host ""
    Write-Host "📦 STEP 2: Kodni GitHub'ga Push Qilish" -ForegroundColor Cyan
    Write-Host "======================================"
    
    # GitHub CLI o'rnatish
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        Write-Host "📥 GitHub CLI o'rnatilmoqda..."
        choco install gh -y --silent
    }
    
    # GitHub CLI login
    Write-Host "🔐 GitHub'ga login qilinimoqda..."
    echo "$githubToken" | gh auth login --with-token
    
    # Repo yaratish
    Write-Host "📂 GitHub'da repository yaratilmoqda: $repoName"
    gh repo create $repoName --public --source=$projectPath --remote=origin --push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Repository yaratildi va code push qilindi!" -ForegroundColor Green
        $githubRepoUrl = "https://github.com/$githubUsername/$repoName"
        Write-Host "📍 Repository: $githubRepoUrl" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  Repository auto-create failed. Manual yaratish kerak:" -ForegroundColor Yellow
        Write-Host "1. https://github.com/new'ga boring" -ForegroundColor White
        Write-Host "2. Repository name: $repoName" -ForegroundColor White
        Write-Host "3. Create repository, keyin:" -ForegroundColor White
        Write-Host ""
        Write-Host "cd $projectPath" -ForegroundColor Gray
        Write-Host "git remote add origin https://github.com/$githubUsername/$repoName.git" -ForegroundColor Gray
        Write-Host "git branch -M main" -ForegroundColor Gray
        Write-Host "git push -u origin main" -ForegroundColor Gray
        Write-Host ""
        $githubRepoUrl = "https://github.com/$githubUsername/$repoName"
    }
} else {
    Write-Host "⏭️  GitHub token skip qilindi. Manual repo setup qilishingiz kerak:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. https://github.com/new'ga boring" -ForegroundColor White
    Write-Host "2. Repository name: $repoName" -ForegroundColor White
    Write-Host "3. Create repository tugmasini bosing" -ForegroundColor White
    Write-Host "4. Keyin quyidagi buyruqlarni ishlating:" -ForegroundColor White
    Write-Host ""
    Write-Host "cd $projectPath" -ForegroundColor Gray
    Write-Host "git remote add origin https://github.com/$githubUsername/$repoName.git" -ForegroundColor Gray
    Write-Host "git branch -M main" -ForegroundColor Gray
    Write-Host "git push -u origin main" -ForegroundColor Gray
    Write-Host ""
    $githubRepoUrl = "https://github.com/$githubUsername/$repoName"
}

# Frontend build va Netlify deploy
Write-Host ""
Write-Host "🌐 STEP 3: Frontend Netlify'ga Deploy" -ForegroundColor Cyan
Write-Host "===================================="

Push-Location $projectPath\frontend
Write-Host "📦 Frontend build qilinimoqda..."
npm install --silent
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build tayyor!" -ForegroundColor Green
    Write-Host "🚀 Netlify'ga deploy qilinimoqda..."
    
    # Netlify deploy
    Set-Location $projectPath
    netlify deploy --prod --dir=frontend/dist --message="Auto Deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    
    Write-Host "✅ Frontend Netlify'da deploy qilindi!" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build xatosi!" -ForegroundColor Red
}

Pop-Location

# Render deploy instructions
Write-Host ""
Write-Host "🔧 STEP 4: Backend Render'ga Deploy" -ForegroundColor Cyan
Write-Host "===================================="
Write-Host ""
Write-Host "Render'da backend auto-deploy qilish uchun:" -ForegroundColor White
Write-Host ""
Write-Host "1. https://render.com'ga boring va login qiling" -ForegroundColor Gray
Write-Host "2. Dashboard'dan 'New +' tugmasini bosing" -ForegroundColor Gray
Write-Host "3. 'Web Service' tanlang" -ForegroundColor Gray
Write-Host "4. GitHub'dan warehouse-app repository tanlang" -ForegroundColor Gray
Write-Host "   (Repository: $githubRepoUrl)" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Quyidagi sozlamalarni qo'llang:" -ForegroundColor Gray
Write-Host ""
Write-Host "   ┌─ Service Details" -ForegroundColor Gray
Write-Host "   │ Name: warehouse-backend" -ForegroundColor Gray
Write-Host "   │ Runtime: Node" -ForegroundColor Gray
Write-Host "   │ Build Command: npm install" -ForegroundColor Gray
Write-Host "   │ Start Command: npm start" -ForegroundColor Gray
Write-Host "   │ Root Directory: backend" -ForegroundColor Gray
Write-Host "   └─" -ForegroundColor Gray
Write-Host ""
Write-Host "   ┌─ Environment Variables" -ForegroundColor Gray
Write-Host "   │ PORT = 5000" -ForegroundColor Gray
Write-Host "   │ NODE_ENV = production" -ForegroundColor Gray
Write-Host "   │ SECRET_KEY = your-secret-key-2026" -ForegroundColor Gray
Write-Host "   └─" -ForegroundColor Gray
Write-Host ""
Write-Host "6. 'Create Web Service' tugmasini bosing" -ForegroundColor Gray
Write-Host "7. Deploy tuganguni kutish (3-5 minut)" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  Deploy tugangandan keyin:" -ForegroundColor Yellow
Write-Host "   Backend URL ni ko'chirib oling (masalan: https://warehouse-backend-xxx.onrender.com)" -ForegroundColor Gray
Write-Host "   Frontend'ni qayta deploy qilish uchun FINAL_DEPLOY_FRONTEND.ps1 scriptni ishlatish" -ForegroundColor Gray
Write-Host ""

# Final instructions
Write-Host ""
Write-Host "═════════════════════════════════════════" -ForegroundColor Green
Write-Host "✨ DEPLOY PROCESS TAYYORLANDI!" -ForegroundColor Green
Write-Host "═════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📋 QOLGANLARI:" -ForegroundColor Yellow
Write-Host "  1. Backend'ni Render'da deploy qiling (yuqorida ko'rsatilgan)" -ForegroundColor White
Write-Host "  2. Backend URL ni oling" -ForegroundColor White
Write-Host "  3. FINAL_DEPLOY_FRONTEND.ps1 scriptni ishlatib frontend'ni qayta deploy qiling" -ForegroundColor White
Write-Host ""
Write-Host "🔗 LINKS:" -ForegroundColor Cyan
Write-Host "  • Frontend: https://moshna.netlify.app" -ForegroundColor Cyan
Write-Host "  • GitHub: $githubRepoUrl" -ForegroundColor Cyan
Write-Host "  • Backend: (Render'dan deploy qilingandan keyin)" -ForegroundColor Cyan
Write-Host ""

# Save config
$config = @"
# Ombor App - Deployment Config
githubUsername=$githubUsername
githubEmail=$githubEmail
repoName=$repoName
repoUrl=$githubRepoUrl
projectPath=$projectPath
deployDate=$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
"@

$config | Set-Content "$projectPath\.deploy-config"
Write-Host "💾 Config saqlandi: .deploy-config" -ForegroundColor Gray

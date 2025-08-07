# Google Vision API Setup Script
Write-Host "🔧 Setting up Google Vision API for MastroHub..." -ForegroundColor Green

# Step 1: Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local exists" -ForegroundColor Green
} else {
    Write-Host "❌ .env.local not found - creating..." -ForegroundColor Red
    New-Item -Path ".env.local" -ItemType File
}

# Step 2: Check for Google credentials
$envContent = Get-Content ".env.local" -Raw
if ($envContent -match "your_base64_encoded_service_account_key_here") {
    Write-Host "⚠️ Google credentials not configured" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 To set up Google Vision API:" -ForegroundColor Cyan
    Write-Host "1. Go to https://console.cloud.google.com/" -ForegroundColor White
    Write-Host "2. Create a project and enable Cloud Vision API" -ForegroundColor White
    Write-Host "3. Create a service account with Vision API User role" -ForegroundColor White
    Write-Host "4. Download JSON key file" -ForegroundColor White
    Write-Host "5. Convert to base64:" -ForegroundColor White
    Write-Host "   `$jsonContent = Get-Content 'path\to\your\service-account.json' -Raw" -ForegroundColor Gray
    Write-Host "   `$base64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(`$jsonContent))" -ForegroundColor Gray
    Write-Host "6. Update .env.local with the base64 string" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✅ Google credentials configured" -ForegroundColor Green
}

# Step 3: Check if servers are running
Write-Host ""
Write-Host "🔍 Checking servers..." -ForegroundColor Cyan

$fastApiRunning = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
$nextJsRunning = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if ($fastApiRunning) {
    Write-Host "✅ FastAPI server running on port 8000" -ForegroundColor Green
} else {
    Write-Host "❌ FastAPI server not running" -ForegroundColor Red
    Write-Host "   Start with: cd apps/api; python main.py" -ForegroundColor Gray
}

if ($nextJsRunning) {
    Write-Host "✅ Next.js server running on port 3000" -ForegroundColor Green
} else {
    Write-Host "❌ Next.js server not running" -ForegroundColor Red
    Write-Host "   Start with: npm run dev" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎯 Test URL: http://localhost:3000/menu-maker" -ForegroundColor Green
Write-Host "📚 Setup guide: GOOGLE_SETUP_GUIDE.md" -ForegroundColor Cyan 
# AI Integration Edit - 29.04.2026
# Sadeleþtirilmiþ klasör yapýsýna uygun olarak servislerin baþlatma yollarý güncellendi
# Sistem: Root / Scripts

Write-Host "🚀 Proje baþlatýlýyor (Profesyonel Yapý)..." -ForegroundColor Cyan

# 1. AI Servisini Baþlat
Write-Host "🤖 AI Servisi baþlatýlýyor..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ai; python main.py"

# 2. Backend Baþlat
Write-Host "🖥️ Backend API baþlatýlýyor..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; dotnet run"

# 3. Frontend Baþlat
Write-Host "🎨 Frontend baþlatýlýyor..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "✅ Tüm servisler baþlatýldý!" -ForegroundColor Green

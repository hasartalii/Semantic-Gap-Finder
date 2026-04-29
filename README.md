## ✨ Yapılan Değişiklikler

### 🏗️ Proje Yapısı
- Monorepo yapısına geçildi: backend/, frontend/, ai/ klasörleri düzleştirildi
- Root package.json eklendi → tek komutla çalışma: `npm run dev`
- docker-compose.yml + her servis için Dockerfile eklendi

### 🖥️ Backend (ASP.NET Core)
- CORS politikası eklendi (Frontend: localhost:5173)
- AIService.cs eklendi → Python AI API'sine HTTP köprüsü
- AnalysisController.cs eklendi → /api/Analysis/analyze endpoint'i
- DbContext DI kaydı düzeltildi (factory pattern)
- SemanticResponse duplicate class hatası giderildi

### 🤖 AI Servisi (Python / FastAPI)
- veri_okuyucu.py → FastAPI servisine (main.py) dönüştürüldü
- SPECTER 2 + FAISS analiz mantığı tamamen korundu
- /analyze ve /ping endpoint'leri eklendi
- Lifespan context manager ile modernize edildi
- DataBase_Y.sql yolu düzeltildi

### 🎨 Frontend (React / Vite)
- api.js oluşturuldu → Backend ile tüm HTTP iletişimi burada
- analyzeIdea() import hatası giderildi
- PDF yükleme kutusu gerçek <input type="file"> ile aktif edildi
- Sürükle-bırak (drag & drop) desteği eklendi
- Analiz sonuçları (novelty skoru, AI yorumu, benzer makale) canlı gösteriliyor
- Genellikle orijinal UI tasarımı korundu

### 🔧 Genel
- Her değişikliğe "AI Integration Edit - 29.04.2026" yorum satırı eklendi
- Mevcut hiçbir kod silinmedi / bozulmadı

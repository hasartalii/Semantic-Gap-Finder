# AI Integration Edit - 29.04.2026
# on_event deprecated uyarisi giderildi — modern lifespan pattern kullanildi
# SQL_FILE yolu duzeltildi — DataBase_Y.sql ai/ klasorune kopyalandi
# Orijinal veri_okuyucu.py analiz mantigi tamamen korundu
# Sistem: AI / Yapay Zeka

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
import os
import re
import faiss
import io
import PyPDF2
import numpy as np
from sentence_transformers import SentenceTransformer
from fastapi.middleware.cors import CORSMiddleware

# AI Integration Edit - 29.04.2026
# Dosya yollari __file__ ile mutlak hale getirildi — calisma dizininden bagimsiz
# Sistem: AI / Yapay Zeka
MODEL_NAME = 'allenai/specter2_base'
SQL_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "DataBase_Y.sql")
INDEX_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "faiss_veritabani.index")


class AnalysisRequest(BaseModel):
    title: str
    summary: str


class AnalysisResult(BaseModel):
    novelty_score: float
    most_similar_article: str
    semantic_similarity: float
    comment: str


class NoveltyAnalyzer:
    def __init__(self):
        print("AI Modeli yukleniyor...")
        self.model = SentenceTransformer(MODEL_NAME)
        self.articles = []
        self.index = None
        self.load_data()

    def load_data(self):
        # SQL dosyasini oku — orijinal veri_okuyucu.py mantigi korundu
        if not os.path.exists(SQL_FILE):
            print(f"Uyari: {SQL_FILE} bulunamadi!")
            return

        regex_rule = r"N'((?:[^']|'')*)'"
        with open(SQL_FILE, "r", encoding="utf-16") as f:
            for line in f:
                if line.strip().startswith("INSERT"):
                    matches = re.findall(regex_rule, line)
                    if len(matches) >= 3:
                        self.articles.append({"title": matches[1], "summary": matches[2]})

        print(f"{len(self.articles)} makale yuklendi.")

        # FAISS Index yukle veya olustur
        if os.path.exists(INDEX_FILE):
            self.index = faiss.read_index(INDEX_FILE)
            print("FAISS indeksi dosyadan yuklendi.")
        else:
            print("FAISS indeksi olusturuluyor (Bu islem zaman alabilir)...")
            texts = [m['title'] + self.model.tokenizer.sep_token + m['summary'] for m in self.articles]
            vectors = self.model.encode(texts, normalize_embeddings=True, show_progress_bar=True)
            self.index = faiss.IndexFlatIP(768)
            self.index.add(vectors)
            faiss.write_index(self.index, INDEX_FILE)
            print("FAISS indeksi olusturuldu ve kaydedildi.")

    def analyze(self, title, summary):
        # Orijinal veri_okuyucu.py kalibrasyon mantigi — hic degistirilmedi
        text = title + self.model.tokenizer.sep_token + summary
        vector = self.model.encode([text], normalize_embeddings=True)

        distances, indices = self.index.search(vector, k=1)
        raw_score = float(distances[0][0])
        best_match = self.articles[indices[0][0]]

        # Kalibrasyon: SPECTER 2 icin taban esigi 0.85 (orijinal veri_okuyucu.py)
        threshold = 0.85
        calibrated = (raw_score - threshold) / (1.0 - threshold)
        calibrated = max(0.0, min(1.0, calibrated))
        novelty_score = (1.0 - calibrated) * 100

        comment = ""
        if novelty_score > 80:
            comment = "Bu fikir literatürde büyük bir boslugu kapatabilir! Cok özgün."
        elif novelty_score > 50:
            comment = "Orta derece yenilik. Mevcut fikirlerle bazi benzerlikler var."
        else:
            comment = "Bu konu literatürde yogun sekilde islenmis. Farkli bir aci bulmalisin."

        return {
            "novelty_score": round(novelty_score, 2),
            "most_similar_article": best_match['title'],
            "semantic_similarity": round(raw_score * 100, 2),
            "comment": comment
        }


# AI Integration Edit - 29.04.2026
# on_event deprecated — lifespan context manager ile degistirildi (FastAPI modern pattern)
# Sistem: AI / Yapay Zeka
analyzer = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global analyzer
    analyzer = NoveltyAnalyzer()
    yield


app = FastAPI(title="Academic Novelty Analysis API", lifespan=lifespan)

# AI Integration Edit - 29.04.2026
# CORS — gelistirme ortami icin tum originlere izin verildi
# Sistem: AI / Yapay Zeka
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ping")
async def ping():
    # Baglanti sagligi kontrolu — Backend ve Frontend tarafindan kullanilir
    return {"status": "ok", "message": "AI Service is running"}


@app.post("/analyze", response_model=AnalysisResult)
async def analyze_idea(request: AnalysisRequest):
    # AI Integration Edit - 29.04.2026
    # Frontend -> Backend -> AI zincirinin son halkasi
    # Sistem: AI / Yapay Zeka
    if not analyzer:
        raise HTTPException(status_code=503, detail="AI Model is not initialized yet")
    if not analyzer.index:
        raise HTTPException(status_code=503, detail="Veri tabani yuklenemedi. DataBase_Y.sql kontrol edin.")
    try:
        result = analyzer.analyze(request.title, request.summary)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/extract-pdf")
async def extract_pdf(file: UploadFile = File(...)):
    try:
        content = await file.read()
        print(f"DEBUG: PDF alindi, boyut: {len(content)} bytes")
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        full_text = ""
        # Ilk 3 sayfayi tara (genelde abstract buradadir)
        for i in range(min(3, len(pdf_reader.pages))):
            page_text = pdf_reader.pages[i].extract_text()
            if page_text:
                full_text += page_text + "\n"
        
        print(f"DEBUG: Ayiklanan toplam metin uzunlugu: {len(full_text)}")
        
        # Basit Abstract yakalama mantigi
        abstract = ""
        # Daha gelismis Abstract yakalama (farkli yazim tarzlari icin)
        abstract = ""
        # 1. Klasik Abstract basligi
        match = re.search(r'(?i)abstract[:\-\s\n]+(.*?)(?=\n\s*(?:introduction|keywords|index terms|1\.)|$)|\n\d+\.\s+Introduction', full_text, re.DOTALL)
        
        if not match:
            # 2. Alternatif: "A B S T R A C T" gibi bosluklu yazimlar
            match = re.search(r'(?i)a\s*b\s*s\s*t\s*r\s*a\s*c\s*t[:\-\s\n]+(.*?)(?=\n\s*i\s*n\s*t\s*r\s*o|$)', full_text, re.DOTALL)

        if match:
            abstract = match.group(1).strip()
            print("DEBUG: Abstract bulundu (regex)")
        else:
            # 3. Hicbir sey bulunamazsa ilk 1500 karakteri temizleyip al (Sayfa basi basliklari vs. temizle)
            lines = full_text.split('\n')
            # Ilk 5 satiri (baslik, yazar vs olabilir) atla, sonraki 10 satiri al
            abstract = "\n".join(lines[5:15]).strip()
            print("DEBUG: Abstract anahtar kelimesi bulunamadi, metin blogu alindi")

        if len(abstract) < 50 and len(full_text) > 100:
            # Eger ayiklanan abstract cok kisaysa direkt ilk blogu al
            abstract = full_text[:1500].strip()

        # Baslik tahmini: Ilk 200 karakterdeki ilk anlamli satir
        lines = [l.strip() for l in full_text.split('\n') if len(l.strip()) > 10]
        title = lines[0] if lines else "Bilinmeyen Baslik"

        return {"title": title, "abstract": abstract}
    except Exception as e:
        print(f"DEBUG: PDF Hatasi: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF okuma hatasi: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

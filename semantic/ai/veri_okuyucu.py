import os
import re
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# Ayarlar
dosya_yolu = "Semantic-Gap-Finder/DataBase_Y.sql"
index_dosyasi = "faiss_veritabani.index"
regex_kurali = r"N'((?:[^']|'')*)'"
makaleler = []

print("1. AŞAMA: Veritabanı okunuyor...")
with open(dosya_yolu, "r", encoding="utf-16") as dosya:
    for satir in dosya:
        if satir.strip().startswith("INSERT"):
            bulunanlar = re.findall(regex_kurali, satir)
            if len(bulunanlar) >= 3:
                makaleler.append({"baslik": bulunanlar[1], "ozet": bulunanlar[2]})

toplam_makale = len(makaleler)
print(f"Başarıyla {toplam_makale} makale çıkarıldı.\n")

print("2. AŞAMA: SPECTER 2 (Base) Modeli Yükleniyor...")
model = SentenceTransformer('allenai/specter2_base')

# --- AKILLI SENKRONİZASYON VE HAFIZA MANTIĞI ---
guncelleme_gerekli = True

if os.path.exists(index_dosyasi):
    gecici_indeks = faiss.read_index(index_dosyasi)
    if gecici_indeks.ntotal == toplam_makale:
        print(f"3. AŞAMA: Hafıza güncel ({toplam_makale} makale). Işık hızında yükleniyor...")
        indeks = gecici_indeks
        guncelleme_gerekli = False
    else:
        print(f"3. AŞAMA: YENİ VERİ TESPİT EDİLDİ! (Eski: {gecici_indeks.ntotal}, Yeni: {toplam_makale})")
        print("Vektör veritabanı güncelleniyor, lütfen bekleyin...")

if guncelleme_gerekli:
    specter_metinleri = [m['baslik'] + model.tokenizer.sep_token + m['ozet'] for m in makaleler]
    vektorler = model.encode(specter_metinleri, normalize_embeddings=True, show_progress_bar=True, batch_size=8)
    
    indeks = faiss.IndexFlatIP(768)
    indeks.add(vektorler)
    faiss.write_index(indeks, index_dosyasi)
    print("FAISS Veritabanı başarıyla güncellendi ve kaydedildi!\n")

# --- ETKİLEŞİMLİ ANALİZ DÖNGÜSÜ ---
print("\n" + "="*55)
print("🤖 AKADEMİK YENİLİK (NOVELTY) ANALİZ SİSTEMİ v3.0")
print("Sistemden çıkmak için başlık kısmına 'q' yazın.")
print("="*55)

while True:
    print("\n" + "-"*55)
    yeni_baslik = input("💡 Fikir Başlığı: ")
    if yeni_baslik.strip().lower() == 'q': break
    yeni_ozet = input("📝 Fikir Özeti: ")

    print("\n🔍 Analiz ediliyor...")
    fikir_metni = yeni_baslik + model.tokenizer.sep_token + yeni_ozet
    fikir_vektoru = model.encode([fikir_metni], normalize_embeddings=True)

    mesafeler, indexler = indeks.search(fikir_vektoru, k=1)
    ham_skor = mesafeler[0][0]
    en_benzer_makale = makaleler[indexler[0][0]]

    # --- MATEMATİKSEL KALİBRASYON (NOVELTY FIX) ---
    # SPECTER 2 için taban benzerlik eşiği 0.85 olarak belirlenmiştir.
    taban_esigi = 0.85
    kalibre_benzerlik = (ham_skor - taban_esigi) / (1.0 - taban_esigi)
    kalibre_benzerlik = max(0.0, min(1.0, kalibre_benzerlik)) # 0-1 arasına hapset
    
    novelty_skoru = (1.0 - kalibre_benzerlik) * 100

    print(f"\n--- ANALİZ SONUCU ---")
    print(f"En Yakın Makale: {en_benzer_makale['baslik']}")
    print(f"Anlamsal Benzerlik: %{ham_skor*100:.1f} (Ham)")
    print(f"\n💡 GERÇEK YENİLİK (NOVELTY) SKORU: %{novelty_skoru:.1f}")
    
    if novelty_skoru > 80:
        print("YORUM: Bu fikir literatürde büyük bir boşluğu kapatabilir! Çok özgün.")
    elif novelty_skoru > 50:
        print("YORUM: Orta derece yenilik. Mevcut fikirlerle bazı benzerlikler var.")
    else:
        print("YORUM: Bu konu literatürde yoğun şekilde işlenmiş. Farklı bir açı bulmalısın.")
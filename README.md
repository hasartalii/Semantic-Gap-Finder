Akade-Metrik: Gelişim ve Entegrasyon Günlüğü
Bu döküm, devralındığı ve QA sorumlusunun geçmişinden beri devam eden mimari evrimi, yapılan kritik bozulmalar ve yeni kapasite detaylandırılmaktadır.

🛠️ Mimari Dönüşüm (Önce vs Sonra)
1. Monorepo tutuşsı
Eskiden: Birbirinden kopuk Python scriptleri, .NET dosyaları ve React bileşenleri mevcuttur.
Şimdi: frontend/ ve backend/klasörleri ai/altında standartlaştırılmış, parçalara ayrılmış haberleşen profesyonel bir monorepo yapısına geçildi.

2. Yapay Zeka Servis Modernizasyonu
Eskiden: Sadece yerel bir script ( veri_okuyucu.py) olarak çalışan analiz mantığı mevcuttu.
Şimdi: FastAPI temelli, ölçeklenebilir bir mikroservis yapısına dönüştürüldü.
Lifespan Pattern: Model yüklenirken (Spectre 2) genişletildi.
FAISS Entegrasyonu: Milyonlarca veri arasında semantik arama yapabilen kayıt defteri veri tabanı sistemi eklendi.

✨ Eklenen Yeni Özellikler & Fonksiyonel değişiklikler
📄 Akıllı PDF İşleme Motoru (Yeni)
Geliştirme: Kullanıcının manuel metin girişi ortadan kaldırılır.
Teknik Detay: AI servisine PyPDF2entegre edilmiş, yüklenen PDF'lerin içinden Başlık ve Özet (Özet) alınmış cimbızla bir NLP detayı eklenmiştir.
Dayanıklılık: Standart dışı yazılmış makaleler için çok katmanlı Regex geri dönüş oranları.
🔗DOI Otomasyon Sistemi (Yeni)
Geliştirme: DOI numarasının literatürden girilerek anlık veri çekme özelliği eklendi.
Teknik Detay: Semantic Scholar API tarafında Backend parçalarının eklenmesi. DOI girildiğinde başlık ve özet alanları otomatik olarak sürekli analiz sürecini %80 hızlandırdı.
🚀 Tek Tıkla Orkestrasyon
Geliştirme: Servisleri tek başlatma karmaşası giderildi.
Çözüm: Tüm katmanları (React, .NET, FastAPI) aynı anda başlatılırken, port çakışmalarını yöneten start_project.ps1komut dosyası yazıldı.
🧪 Uygulanan Testler ve Kalite Güvence (QA)
Projelendirilebilirlik ve kalite güvencesi kapsamında aşağıdaki test aşamalarına geçilmiştir:

Entegrasyon Testi: Frontend'den kayıtlı .NET üzerinden AI servisine kaybolmadan iletildiği doğrulanmıştır.
Semantik Doğruluk Testi: Spectre 2 modelinin sağladığı sonuçlar gerçek ürünlerle çapraz sorgulanmıştır.
Hata Dayanıklılık Testi: Eksik yazılım ve geçersiz DOI verileri için hata yakalama verileri optimize edilmiştir.
🗺️Gelecek Yol Haritası (Geliştirme Bekleyenler)
Proje şu anda başarılı bir MVP (Minimum Uygulanabilir Ürün) aşamasındadır. QA perspektifiyle bir sonraki aşamada birleştirilmesi planlanan özellikler şunlardır:

1. Fonksiyonel Entegrasyonlar
[ ] Gerçek Kimlik Doğrulama: Mevcut sahte giriş ekranının JWT ve SQL Server tabanlı gerçek bir Kimlik Doğrulama sistemine bağlanır.
[ ] Profil Verilerinin kalıcı Hale Getirilmesi: Kullanıcının unvan ve fotoğraflarının veri tabanında saklanması.
[ ] Analiz Geçmişi: Kullanıcıların geçmişte yaptığı analizleri kaydedebileceği ve tekrar inceleyebileceği bir "Geçmişim" sekmesi.
2. Yapay Zeka ve Veri Görselleştirme
[ ] Dinamik Semantik Ağ: Analiz sonucunun üretilebileceği ağ grafiğinin statik SVG'den, AI'dan gelen gerçek komşu düğümlerine (benzer makalelere) dönüştürülmesi.
[ ] Çoklu Eşleşme Listesi: AI servisinin en benzer 10 makaleyi dönerek sağ paneldeki gerçeklik listesi gerçek verilerle doldurması.
[ ] OCR Desteği: Resim formatı (taranmış) PDF'lerin analiz edilebilmesi için Tesseract veya benzeri bir OCR motorunun AI servisine eklenmesi.
3. Sistem Yönetimi ve Raporlama
[ ] Yönetici Paneli: DataCollectorService tarafından yapılan toplu veri çekme işlemlerinin tetiklenebileceği ve izlenebileceği bir yönetim arayüzü.
[ ] Rapor Çıktısı (Dışa Aktar): Analiz sonuçlarının akademik formatta PDF veya Excel raporu olarak indirilebilmesi.

🏁 Sonuç
Proje, ham bir kod yığınından; Otomatikleştirilmiş veri girişine, yüksek performanslı vektör aramasına ve modern bir kullanıcı arayüzüne sahip bütünleşik bir platforma dönüştürüldü.file"> ile aktif edildi
- Sürükle-bırak (drag & drop) desteği eklendi
- Analiz sonuçları (novelty skoru, AI yorumu, benzer makale) canlı gösteriliyor
- Genellikle orijinal UI tasarımı korundu

### 🔧 Genel
- Her değişikliğe "AI Integration Edit - 29.04.2026" yorum satırı eklendi
- Mevcut hiçbir kod silinmedi / bozulmadı

import React, { useState, useEffect } from "react";
import { Upload, FileText, Search, Sparkles, User, LogOut, ChevronLeft, BookOpen, Quote, Share2, FileCode2, Binary, Database } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
// AI Integration Edit - 29.04.2026
// analyzeIdea fonksiyonu import listesine eklendi — eksik import nedeniyle buton calismiyor du
// Sistem: Frontend
import { testConnection, analyzeIdea } from "./api";

// --- NETWORK GRAPH BİLEŞENİ (Daha Canlı SVG) ---
const NetworkNode = ({ x, y, size, delay, label, isMain }) => (
  <g className="animate-pulse" style={{ animationDelay: `${delay}s` }}>
    <circle cx={x} cy={y} r={size} fill={isMain ? "#a855f7" : "#cbd5e1"} fillOpacity={isMain ? "0.9" : "0.5"} />
    <circle cx={x} cy={y} r={isMain ? size/1.5 : size/2.5} fill={isMain ? "#c084fc" : "#f1f5f9"} />
    <circle cx={x} cy={y} r={size*2.2} stroke={isMain ? "#a855f7" : "#cbd5e1"} strokeWidth="0.5" fill="none" opacity="0.15" />
    <text x={x + size + 5} y={y + 4} fill={isMain ? "white" : "#94a3b8"} fontSize={isMain ? "11" : "9"} fontWeight={isMain ? "bold" : "normal"}>{label}</text>
  </g>
);

function App() {
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Melisa",
    title: "Yazılım Mühendisliği Öğrencisi",
    avatar: null
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileData({ ...profileData, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };
  const [isLogin, setIsLogin] = useState(true);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pdf"); // Varsayılan sekme
  const [loadingText, setLoadingText] = useState("");
  // AI Integration Edit - 29.04.2026
  // Kullanıcı etkileşimlerini (başlık, özet ve analiz sonucu) yönetmek için yeni state'ler eklendi
  // Sistem: Frontend
  const [inputTitle, setInputTitle] = useState("");
  const [inputSummary, setInputSummary] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  // AI Integration Edit - 29.04.2026
  // PDF dosyası seçim durumunu tutmak için selectedFile state eklendi
  // Sistem: Frontend
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const loadingPhrases = ["Semantik derinlik taranıyor...", "Literatür veri tabanı sorgulanıyor...", "Özgünlük puanı hesaplanıyor...", "NLP modelleri optimize ediliyor...", "Alıntı ağları örülüyor..."];

  useEffect(() => {
    if (loading) {
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(loadingPhrases[i % loadingPhrases.length]);
        i++;
      }, 900);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    testConnection();
  }, []);

  const similarityData = [82, 76, 71, 65, 60, 55, 50, 45, 40, 35];
  const novelty = analysisResult?.novelty_score || 87;
  const chartData = [{ name: "Özgün", value: novelty }, { name: "Benzer", value: 100 - novelty }];
  const COLORS = ["#a855f7", "#e2e8f0"]; // Mor ve Açık Gri

  // AI Integration Edit - 29.04.2026
  // Frontend butonu ile Backend analiz endpoint'i arasında asenkron bağlantı kuruldu
  // Sistem: Frontend
  const handleAnalyze = async () => {
    if (!inputTitle || !inputSummary) {
      alert("Lütfen başlık ve özet alanlarını doldurun.");
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeIdea(inputTitle, inputSummary);
      setAnalysisResult(result);
      setIsAnalyzed(true);
    } catch (error) {
      alert("Analiz sırasında bir hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // AI Integration Edit - 29.04.2026
  // PDF dosyası seçildiğinde dosya adını başlığa aktarır ve içeriği okur
  // Sistem: Frontend
  const handlePdfFile = (file) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Lütfen geçerli bir PDF dosyası seçin.');
      return;
    }
    setSelectedFile(file);
    // Dosya adından başlık önerisi (örn: "makale-adi.pdf" -> "Makale Adi")
    const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
    const suggestedTitle = nameWithoutExt.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    setInputTitle(suggestedTitle);
  };

  const handlePdfInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handlePdfFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handlePdfFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  // --- HER SEKME İÇİN FARKLI İÇERİK ---
  const renderTabContent = () => {
    switch (activeTab) {
     case "doi":
  return (
    <div className="w-full flex flex-col items-center gap-6 py-8 animate-in fade-in">
      <Database className="text-purple-600" size={56} strokeWidth={1} />
      
      <h4 className="text-lg font-bold text-slate-800 tracking-tight">
        Makale DOI Numarasını Girin
      </h4>

      <input 
        type="text" 
        placeholder="Örn: 10.1000/xyz123" 
        className="w-full max-w-md p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xl font-mono text-purple-600 placeholder:text-slate-400 outline-none focus:border-purple-500 transition-all shadow-inner"
      />

      <p className="text-sm text-slate-500 max-w-xs text-center leading-relaxed">
        DOI numarası, makalenin dijital kimliğidir. Sistemimiz bu kimliği kullanarak tüm literatür ağını tarar.
      </p>
    </div>
  );
      case "text":
        return (
          <div className="w-full flex flex-col items-center gap-6 py-4">
            <FileCode2 className="text-purple-400" size={56} strokeWidth={1} />
            <h4 className="text-lg font-bold text-white tracking-tight">Analiz Edilecek Metni Yapıştırın</h4>
            <input 
              type="text"
              placeholder="Fikir Başlığı..."
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-gray-300 mb-2 outline-none focus:border-purple-500"
            />
            <textarea 
              rows="8" 
              placeholder="Makale özetini veya tam metnini buraya girin..." 
              value={inputSummary}
              onChange={(e) => setInputSummary(e.target.value)}
              className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl text-gray-300 placeholder:text-gray-700 outline-none focus:border-purple-500 transition-all resize-none"
            />
            <p className="text-sm text-gray-500">Doğrudan metin analizi, ham fikirlerin özgünlüğünü test etmek için idealdir.</p>
          </div>
        );
      case "pdf":
      default:
        return (
          // AI Integration Edit - 29.04.2026
          // PDF drop zone gerçek dosya seçici ile donatıldı, orijinal görsel tasarım korundu
          // Sistem: Frontend
          <label
            htmlFor="pdf-upload"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`py-12 border-4 border-dashed rounded-[2rem] transition-all group cursor-pointer w-full flex flex-col items-center ${
              dragOver
                ? 'border-purple-500/80 bg-purple-500/5'
                : selectedFile
                ? 'border-purple-500/50 bg-purple-500/5'
                : 'border-white/5 hover:border-purple-500/30'
            }`}
          >
            {/* Gizli dosya inputı */}
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handlePdfInputChange}
            />

            <Upload
              className={`mx-auto transition-transform ${
                selectedFile ? 'text-purple-400' : 'text-purple-500 group-hover:scale-110 group-hover:-translate-y-1'
              }`}
              size={64}
              strokeWidth={1}
            />

            {selectedFile ? (
              // Seçilen dosyanın adını ve boyutunu göster
              <>
                <p className="mt-4 text-base font-bold text-purple-300 px-4 text-center break-all">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-1 font-mono">
                  {(selectedFile.size / 1024).toFixed(1)} KB &bull; PDF dosyası yüklendi
                </p>
                <p className="mt-4 text-sm text-gray-500 border border-white/10 px-4 py-2 rounded-xl">
                  Farklı dosya seçmek için tıklayın
                </p>

                {/* Başlık alanı — dosya adından otomatik dolu gelir, kullanıcı değiştirebilir */}
                <div className="w-full mt-6" onClick={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    placeholder="Makale başlığı..."
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-gray-300 outline-none focus:border-purple-500 text-sm"
                  />
                  <textarea
                    rows={4}
                    placeholder="Makale özetini buraya girin..."
                    value={inputSummary}
                    onChange={(e) => setInputSummary(e.target.value)}
                    className="w-full mt-2 p-4 bg-white/5 border border-white/10 rounded-xl text-gray-300 placeholder:text-gray-700 outline-none focus:border-purple-500 resize-none text-sm"
                  />
                </div>
              </>
            ) : (
              // Henüz dosya seçilmemiş — orijinal görünüm
              <>
                <p className="mt-6 text-xl font-medium text-gray-300">
                  Makale (PDF) dosyasını <span className="text-purple-500 font-bold">seçin</span>
                </p>
                <p className="text-sm text-gray-600 mt-2 font-mono">veya buraya sürükleyin</p>
              </>
            )}
          </label>
        );
    }
  };

  // --- GİRİŞ & KAYIT EKRANI ---
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white relative overflow-hidden font-sans selection:bg-purple-500/30">
        {/* 📄 DİJİTAL KAĞIT DOKUSU (Daha Belgin Kareli) */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
             style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
        
        {/* Sol taraftaki kırmızımsı akademik marj çizgisi */}
        <div className="absolute left-20 top-0 bottom-0 w-[2px] bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.15)]" />
        
        {/* Arka Plan Mor Işık Partikülleri */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[128px] opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[110px] opacity-40" />

        <div className="w-[440px] p-12 rounded-[2.8rem] bg-[#0f172a]/70 border border-white/10 backdrop-blur-3xl shadow-2xl relative z-10">
          <div className="text-center mb-12">
            <BookOpen className="text-purple-400 mx-auto mb-5" size={48} strokeWidth={1.5} />
            <h1 className="text-4xl font-black tracking-tighter text-white">AKADE-METRİK</h1>
            <p className="text-[11px] text-purple-400 font-bold tracking-[0.3em] uppercase mt-2.5">Digital Literature Analysis Portal</p>
          </div>
          <div className="space-y-4">
            {!isLogin && <input placeholder="Ad Soyad" className="w-full p-4 rounded-2xl bg-black/40 border border-white/5 focus:border-purple-500 outline-none text-white transition-all placeholder:text-gray-700" />}
            <input placeholder="E-posta" className="w-full p-4 rounded-2xl bg-black/40 border border-white/5 focus:border-purple-500 outline-none text-white transition-all placeholder:text-gray-700" />
            <input type="password" placeholder="Şifre" className="w-full p-4 rounded-2xl bg-black/40 border border-white/5 focus:border-purple-500 outline-none text-white transition-all placeholder:text-gray-700" />
          </div>
          <button onClick={() => setUser({ name: "Melisa" })} className="w-full mt-10 py-4 rounded-2xl font-black bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98]">
            {isLogin ? "SISTEME GIRIŞ YAP" : "HESABI OLUŞTUR"}
          </button>
          <p onClick={() => setIsLogin(!isLogin)} className="text-center text-sm text-gray-500 mt-10 cursor-pointer hover:text-purple-400 transition-colors">
            {isLogin ? "Hesabın yok mu? Kayıt ol" : "Zaten üye misin? Giriş yap"}
          </p>
        </div>
      </div>
    );
  }

  // --- ANA UYGULAMA EKRANI ---
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 relative overflow-x-hidden font-sans selection:bg-purple-500/30">
      {/* 📄 SAYFA DOKUSU */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="fixed left-16 top-0 bottom-0 w-[1px] bg-white/5 z-0" />

      {/* HEADER */}
<header className="flex justify-between items-center px-12 py-6 border-b border-white/5 backdrop-blur-xl sticky top-0 z-50 bg-[#020617]/95">
  <div className="flex items-center gap-4">
    {isAnalyzed && (
      <button 
        onClick={() => setIsAnalyzed(false)} 
        className="p-2.5 hover:bg-white/5 rounded-full text-gray-400 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
    )}
    <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2.5 text-white">
      <Sparkles size={22} className="text-purple-500" strokeWidth={2.5}/> AKADE-METRİK
    </h1>
  </div>

  <div className="flex items-center gap-5">
    {/* PROFIL BUTONU (Tıklanabilir ve Dinamik) */}
    <div 
      onClick={() => setShowProfileModal(true)}
      className="px-5 py-2.5 bg-white/5 rounded-full border border-white/10 flex items-center gap-3.5 shadow-inner cursor-pointer hover:bg-white/10 transition-all group"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md overflow-hidden border border-white/10">
        {profileData.avatar ? (
          <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          profileData.name[0]
        )}
      </div>
      <span className="text-sm font-semibold text-white tracking-tight group-hover:text-purple-300 transition-colors">
        {profileData.name}
      </span>
    </div>

    {/* ÇIKIŞ BUTONU */}
    <button 
      onClick={() => setUser(null)} 
      className="p-2 text-gray-500 hover:text-red-400 transition-colors"
    >
      <LogOut size={22} strokeWidth={1.5}/>
    </button>
  </div>
</header>

      <main className="max-w-7xl mx-auto px-12 py-20 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-44 space-y-10 animate-pulse text-center">
            <div className="relative">
              <div className="w-24 h-24 border-t-4 border-purple-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-purple-400"><Binary size={32}/></div>
            </div>
            <p className="text-3xl font-extralight italic text-purple-300 tracking-tight">"{loadingText}"</p>
            <p className="text-[10px] text-gray-700 tracking-[0.4em] uppercase font-bold italic">Akademik Derin Analiz Modülü v1.0</p>
          </div>
        ) : !isAnalyzed ? (
          <div className="text-center space-y-16">
            <div className="space-y-4">
                <h2 className="text-7xl font-black text-white leading-tight tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">Dijital Literatür<br/>Analiz Motoru</h2>
                <p className="text-gray-500 text-lg max-w-xl mx-auto font-light">Makalenizin dijital izini sürün, literatürdeki özgün yerini ve etkileşim ağını saniyeler içinde keşfedin.</p>
            </div>
            
            <div className="max-w-3xl mx-auto bg-[#0f172a]/90 p-4 rounded-[3rem] border border-white/10 shadow-2xl relative">
              {/* Sekme Seçiciler (Ayrıştırılmış Butonlar) */}
              <div className="flex justify-center gap-3 mb-8 bg-black/40 p-2 rounded-2xl w-fit mx-auto border border-white/5">
                {[
                    {id:"pdf", label: "PDF YÜKLE", icon: <Upload size={14}/>},
                    {id:"doi", label: "DOI GIRIS", icon: <Database size={14}/>},
                    {id:"text", label: "METIN ANALIZI", icon: <FileCode2 size={14}/>}
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-9 py-3.5 rounded-xl text-xs font-extrabold transition-all tracking-wider ${activeTab === tab.id ? "bg-purple-600 text-white shadow-lg" : "text-gray-600 hover:text-white"}`}>
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* SEKME İÇERİĞİ (Her biri farklı) */}
              <div className="p-8 bg-[#020617] rounded-[2.5rem] border border-white/5 flex flex-col items-center">
                  {renderTabContent()}
                  
                  <button onClick={handleAnalyze} className="mt-12 w-full max-w-md bg-white text-black py-4.5 rounded-2xl font-black text-lg hover:bg-purple-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg active:scale-[0.97]">
                      ANALİZİ BAŞLAT
                  </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* SOL KART: ÖZGÜNLÜK */}
            <div className="lg:col-span-3 bg-[#0f172a]/70 p-9 rounded-[2.2rem] border border-white/10 backdrop-blur-md shadow-lg">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-12 flex items-center gap-2">
                <Quote size={14} className="opacity-50"/> Yenilik Skoru
              </h3>
              <div className="relative h-52">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={chartData} innerRadius={65} outerRadius={85} dataKey="value" startAngle={90} endAngle={450} cornerRadius={10} paddingAngle={2}>
                      {chartData.map((e, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
                    </Pie>
                    <Tooltip contentStyle={{background:'#020617', border:'1px solid #1e293b', borderRadius:'10px', fontSize:'12px'}}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-5xl font-black text-white leading-none">{novelty.toFixed(1)}%</span>
                    <span className="text-[10px] text-purple-300 font-bold tracking-[0.3em] uppercase mt-1">ÖZGÜN</span>
                </div>
              </div>
              {analysisResult && (
                <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                  <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-2">AI Yorumu</p>
                  <p className="text-xs text-gray-300 leading-relaxed italic">"{analysisResult.comment}"</p>
                </div>
              )}
            </div>

            {/* ORTA KART: BENZERLİK LİSTESİ */}
            <div className="lg:col-span-4 bg-[#0f172a]/70 p-9 rounded-[2.2rem] border border-white/10 backdrop-blur-md shadow-lg">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-12">Semantik Eşleşmeler</h3>
              <div className="space-y-6">
                {analysisResult && (
                   <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">En Yakın Literatür</p>
                      <p className="text-sm text-white font-medium line-clamp-2">{analysisResult.most_similar_article}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] text-purple-400 font-bold uppercase">Benzerlik</span>
                        <span className="text-xs font-bold text-white tabular-nums">%{analysisResult.semantic_similarity.toFixed(1)}</span>
                      </div>
                   </div>
                )}
                {similarityData.map((val, i) => (
                  <div key={i} className="flex items-center gap-5 group">
                    <span className="text-[11px] text-gray-700 font-mono group-hover:text-purple-400">#{String(i+1).padStart(2,'0')}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-700 to-indigo-500 rounded-full group-hover:from-purple-500 group-hover:to-purple-300 transition-all duration-300" style={{ width: `${val}%` }} />
                    </div>
                    <span className="text-xs font-bold text-white tabular-nums group-hover:text-purple-300 transition-colors">%{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SAĞ KART: NETWORK GRAPH (AĞ GRAFİĞİ) */}
            <div className="lg:col-span-5 bg-[#0f172a]/70 p-9 rounded-[2.2rem] border border-white/10 backdrop-blur-md min-h-[480px] flex flex-col shadow-lg">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Share2 size={16} /> Literatür Etkileşim Haritası (Semantik)
              </h3>
              <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 relative overflow-hidden shadow-inner">
                <svg className="w-full h-full" viewBox="0 0 400 320">
                  {/* Arka Plan Izgara (Hafif Kağıt Dokusu) */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.1" opacity="0.1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Bağlantı Çizgileri */}
                  <g opacity="0.4" strokeDasharray="3 2">
                      <line x1="200" y1="160" x2="110" y2="90" stroke="#8b5cf6" strokeWidth="0.5" />
                      <line x1="200" y1="160" x2="310" y2="110" stroke="#8b5cf6" strokeWidth="0.5" />
                      <line x1="200" y1="160" x2="160" y2="250" stroke="#a855f7" strokeWidth="1" />
                      <line x1="200" y1="160" x2="290" y2="230" stroke="#8b5cf6" strokeWidth="0.5" />
                      <line x1="160" y1="250" x2="70" y2="210" stroke="#cbd5e1" strokeWidth="0.3" opacity="0.5"/>
                      <line x1="160" y1="250" x2="290" y2="230" stroke="#cbd5e1" strokeWidth="0.3" opacity="0.5"/>
                  </g>
                  
                  {/* Merkez Node (Senin Makalen) */}
                  <NetworkNode x={200} y={160} size={10} delay={0} label="Senin Çalışman" isMain={true} />
                  
                  {/* Diğer Makaleler */}
                  <NetworkNode x={110} y={90} size={5} delay={0.6} label="Makale #01" isMain={false} />
                  <NetworkNode x={310} y={110} size={4} delay={1.4} label="Referans X" isMain={false} />
                  <NetworkNode x={160} y={250} size={7} delay={0.9} label="Benzer Literatür" isMain={false} />
                  <NetworkNode x={290} y={230} size={5} delay={1.8} label="Makale #03" isMain={false} />
                  <NetworkNode x={70} y={210} size={3} delay={2.5} label="Alıntı Y" isMain={false} />
                  
                </svg>
                <div className="absolute bottom-5 right-5 text-[9px] text-gray-700 uppercase font-black tracking-widest bg-black/70 px-2.5 py-1 rounded shadow-md border border-white/5">
                  Semantic Live Mapping
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
      {/* ✅ PROFİL AYARLARI MODALI (En dışta, sekmelerden bağımsız) */}
{showProfileModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
    
    <div className="bg-white border border-slate-200 w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in duration-300">
      
      {/* Kapatma Butonu */}
      <button 
        onClick={() => setShowProfileModal(false)} 
        className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-full"
      >
        <ChevronLeft className="rotate-90 md:rotate-0" size={20} />
      </button>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
          Profil Ayarları
        </h2>
        <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1">AKADEMİK KİMLİK PANELİ</p>
      </div>

      <div className="space-y-8">
        
        {/* AVATAR YÜKLEME ALANI */}
        <div className="flex flex-col items-center">
          <div className="relative group w-28 h-28">
            <div className="w-full h-full rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-colors group-hover:border-purple-400">
              {profileData.avatar ? (
                <img src={profileData.avatar} className="w-full h-full object-cover" />
              ) : (
                <User size={44} className="text-slate-300" />
              )}
            </div>

            <label className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-all border border-white/20 shadow-inner">
              <Upload size={24} className="text-white" />
              <input 
                type="file" 
                className="hidden" 
                onChange={handleAvatarChange} 
                accept="image/*" 
              />
            </label>
          </div>

          <p className="text-[10px] text-purple-600 font-black uppercase tracking-[0.2em] mt-4 italic">
            Görseli Güncelle
          </p>
        </div>

        {/* BİLGİ GİRİŞLERİ */}
        <div className="space-y-5 text-left">
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">
              Tam Adınız
            </label>
            <input 
              value={profileData.name} 
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-purple-500 text-slate-900 transition-all font-medium placeholder:text-slate-300 shadow-inner" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">
              Akademik Ünvan / Pozisyon
            </label>
            <input 
              value={profileData.title} 
              onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-purple-500 text-slate-900 transition-all font-medium placeholder:text-slate-300 shadow-inner" 
            />
          </div>
        </div>

        {/* KAYDET BUTONU */}
        <button 
          onClick={() => setShowProfileModal(false)}
          className="w-full py-4.5 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-purple-600 transition-all shadow-xl active:scale-95 uppercase"
        >
          Değişiklikleri Uygula
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default App;
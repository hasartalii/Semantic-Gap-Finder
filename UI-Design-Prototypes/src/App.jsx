import React, { useState } from "react";
import { Upload, FileText, Search, Sparkles, Info, LayoutDashboard } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function App() {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [activeTab, setActiveTab] = useState("pdf");

  const data = [
    { name: "Yenilik", value: 87 },
    { name: "Benzerlik", value: 13 },
  ];

  const COLORS = ["#818cf8", "#1e293b"];
  const textWhite = { color: '#ffffff' };
  const textGray = { color: '#94a3b8' };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#020617", color: "#ffffff", fontFamily: 'Inter, sans-serif' }}>

      {/* 🌌 Arka Plan Işımaları */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 blur-[140px] top-[-100px] left-[20%]" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-[140px] bottom-[-100px] right-[20%]" />
      </div>

      {/* 🔷 ÜST MENÜ */}
      <nav className="flex justify-center items-center px-10 py-8 border-b border-white/5 backdrop-blur-xl bg-black/20">
        <h1 className="text-2xl font-black flex items-center gap-3 tracking-tighter" style={textWhite}>
          <Sparkles style={{ color: "#818cf8" }} size={28} />
          AKADE-METRİK
        </h1>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {!isAnalyzed ? (
          <div className="animate-in fade-in duration-1000 slide-in-from-bottom-4">
            {/* 🔥 Başlık Alanı */}
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-6xl font-black tracking-tight" style={textWhite}>
                Akademik <span style={{ color: "#818cf8" }}>Yenilik</span> Analizi
              </h1>
              <p className="text-lg max-w-2xl mx-auto" style={textGray}>
                Yapay zeka kullanarak makalelerin özgünlük ve yenilik seviyesini saniyeler içinde analiz edin.
              </p>
            </div>

            {/* 🔷 Giriş Sekmeleri */}
            <div className="flex justify-center gap-3 mb-10">
              {["pdf", "doi", "text"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    backgroundColor: activeTab === tab ? "#6366f1" : "rgba(255,255,255,0.03)",
                    color: "white",
                    border: activeTab === tab ? "none" : "1px solid rgba(255,255,255,0.1)",
                    padding: "14px 28px",
                    borderRadius: "16px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                  className="hover:scale-105"
                >
                  {tab === "pdf" && "PDF YÜKLE"}
                  {tab === "doi" && "DOI SORGULA"}
                  {tab === "text" && "DÜZ METİN"}
                </button>
              ))}
            </div>

            {/* 📦 Giriş Kartı */}
            <div style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "32px", padding: "80px 40px", textAlign: "center" }} className="backdrop-blur-3xl shadow-2xl">
              {activeTab === "pdf" && (
                <div className="space-y-8">
                  <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20">
                    <Upload style={{ color: "#818cf8" }} size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold" style={textWhite}>Dosyanızı Sürükleyin</h3>
                    <p style={textGray}>Veya bilgisayarınızdan bir PDF seçin</p>
                  </div>
                  <button
                    onClick={() => setIsAnalyzed(true)}
                    style={{ backgroundColor: "#6366f1", color: "white", padding: "16px 48px", borderRadius: "full", fontWeight: "900", border: "none", cursor: "pointer", boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
                    className="hover:scale-105 active:scale-95 transition-all rounded-full"
                  >
                    ANALİZİ BAŞLAT
                  </button>
                </div>
              )}

              {activeTab === "doi" && (
                <div className="space-y-8 max-w-md mx-auto">
                  <Search style={{ color: "#818cf8", margin: "0 auto" }} size={48} />
                  <input
                    placeholder="DOI numarasını girin..."
                    style={{ width: "100%", padding: "20px", borderRadius: "16px", backgroundColor: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none", textAlign: "center" }}
                    className="focus:border-indigo-500 transition-all"
                  />
                  <button
                    onClick={() => setIsAnalyzed(true)}
                    style={{ width: "100%", backgroundColor: "#6366f1", color: "white", padding: "16px", borderRadius: "16px", fontWeight: "bold", border: "none", cursor: "pointer" }}
                    className="hover:bg-indigo-400 transition-all"
                  >
                    KAYNAĞI SORGULA
                  </button>
                </div>
              )}

              {activeTab === "text" && (
                <div className="space-y-8 max-w-2xl mx-auto">
                  <FileText style={{ color: "#818cf8", margin: "0 auto" }} size={48} />
                  <textarea
                    rows="6"
                    placeholder="Makale özetini veya tam metni buraya yapıştırın..."
                    style={{ width: "100%", padding: "20px", borderRadius: "16px", backgroundColor: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none", resize: "none" }}
                    className="focus:border-indigo-500 transition-all"
                  />
                  <button
                    onClick={() => setIsAnalyzed(true)}
                    style={{ width: "100%", backgroundColor: "#6366f1", color: "white", padding: "16px", borderRadius: "16px", fontWeight: "bold", border: "none", cursor: "pointer" }}
                    className="hover:bg-indigo-400 transition-all"
                  >
                    METNİ ANALİZ ET
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 📊 Dashboard */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in zoom-in-95 duration-700">
            <div style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "32px", padding: "40px", textAlign: "center" }} className="backdrop-blur-xl">
              <h3 className="mb-8 font-bold text-xl" style={textWhite}>Yenilik Skoru</h3>
              <div className="h-56 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data} innerRadius={75} outerRadius={95} dataKey="value" stroke="none">
                      {data.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black" style={textWhite}>87%</span>
                  <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 'bold', marginTop: '4px' }}>SKOR: YÜKSEK</span>
                </div>
              </div>
              <p style={{ color: "#94a3b8", marginTop: "32px", fontSize: "14px" }}>
                Çalışmanız literatürdeki benzerlerinden anlamsal olarak yüksek oranda farklılaşmaktadır.
              </p>
            </div>

<div style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "32px", padding: "40px", textAlign: "center" }} className="backdrop-blur-xl shadow-2xl">
              <h3 className="mb-8 font-bold text-xl flex items-center gap-3" style={textWhite}>
                <LayoutDashboard size={24} style={{ color: "#818cf8" }} />
                En Yakın 10 Çalışma
              </h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} style={{ backgroundColor: "rgba(0,0,0,0.2)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }} className="hover:border-indigo-500/30 transition-all group">
                    <div className="flex justify-between mb-3">
                      <span className="font-medium" style={textWhite}>Analiz Edilen Benzer Yayın #{i}</span>
                      <span style={{ color: "#818cf8", fontWeight: "bold" }}>%{80 - i * 10} Benzerlik</span>
                    </div>
                    <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "10px" }}>
                      <div style={{ width: `${80 - i * 10}%`, height: "100%", backgroundColor: "#6366f1", borderRadius: "10px" }} className="shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setIsAnalyzed(false)} style={{ marginTop: "32px", color: "#64748b", background: "none", border: "none", cursor: "pointer" }} className="hover:text-white transition-colors text-sm font-medium">
                ← BAŞKA BİR MAKALE ANALİZ ET
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 📝 MODERN FOOTER */}
      <footer className="border-t border-white/5 mt-20 bg-black/10">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-10 font-medium">
            Semantic Scholar API & Sentence-BERT Tabanlı Analiz Sistemi
          </p>
          
          <div className="flex justify-center items-center flex-wrap gap-x-12 gap-y-6 text-sm font-semibold tracking-tight">
            <span style={{ color: "rgba(255,255,255,0.7)" }} className="hover:text-indigo-400 transition-colors">Ali Talip Hasar</span>
            <span style={{ color: "rgba(255,255,255,0.7)" }} className="hover:text-indigo-400 transition-colors">Fatma Zehra Osmanoğlu</span>
            <span style={{ color: "rgba(255,255,255,0.7)" }} className="hover:text-indigo-400 transition-colors">Melisa Kahraman</span>
            <span style={{ color: "rgba(255,255,255,0.7)" }} className="hover:text-indigo-400 transition-colors">Eyyüp Meşe</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
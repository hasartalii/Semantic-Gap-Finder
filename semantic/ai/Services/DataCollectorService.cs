using Dapper;
using Newtonsoft.Json;
using AcademicNoveltyAnalysis.Data;
using AcademicNoveltyAnalysis.Models;
using System.Net.Http;
using System.Data;

namespace AcademicNoveltyAnalysis.Services
{
    public class DataCollectorService
    {
        private readonly HttpClient _httpClient;
        private readonly AcademicNoveltyAnalysis.Data.DbContext _context;

        public DataCollectorService(AcademicNoveltyAnalysis.Data.DbContext context)
        {
            _httpClient = new HttpClient();
            // API güvenliği ve tanınabilirlik için User-Agent şart
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "AcademicAnalysisProject/1.0");
            _context = context;
        }

        public async Task<int> CollectBulkDataAsync()
        {
            // 1. STRATEJİ: Farklı disiplinlerden homojen veri çekimi
            string[] categories = {
                "Computer Science", "Artificial Intelligence", "Machine Learning",
                "Cyber Security", "Medicine", "Biotechnology", "Nanotechnology",
                "Economics", "Psychology", "Environmental Science", "Sociology",
                "Political Science", "Law", "History", "Education"
            };

            int totalSavedInThisSession = 0;
            int batchSize = 100; // API limiti
            int stepsPerCategory = 10; // Kategori başına sayfa ilerlemesi
            const int targetLimit = 5000; // Scrum Master Kararı: Maksimum veri sınırı

            using (var connection = _context.CreateConnection())
            {
                foreach (var cat in categories)
                {
                    // Her kategori başında veritabanındaki toplam sayıyı kontrol et
                    int currentTotal = await GetCurrentCount(connection);
                    if (currentTotal >= targetLimit) break;

                    for (int i = 0; i < stepsPerCategory; i++)
                    {
                        // Sayfa içinde de kontrol et (5000'i geçer geçmez durması için)
                        currentTotal = await GetCurrentCount(connection);
                        if (currentTotal >= targetLimit)
                        {
                            Console.WriteLine($"--- Hedeflenen {targetLimit} veriye ulaşıldı. İşlem durduruluyor. ---");
                            goto EndOfProcess; // İç içe döngülerden hızlıca çıkış
                        }

                        int offset = i * batchSize;
                        string url = $"https://api.semanticscholar.org/graph/v1/paper/search?query={cat}&limit={batchSize}&offset={offset}&fields=paperId,title,abstract,year&year=2020-2026";

                        try
                        {
                            var response = await _httpClient.GetAsync(url);

                            // API Hız Sınırı (Rate Limit) Yönetimi
                            if ((int)response.StatusCode == 429)
                            {
                                await Task.Delay(5000); // 5 saniye bekle ve devam et
                                continue;
                            }

                            if (!response.IsSuccessStatusCode) continue;

                            var content = await response.Content.ReadAsStringAsync();
                            var result = JsonConvert.DeserializeObject<SemanticResponse>(content);

                            if (result?.Data == null || result.Data.Count == 0) break;

                            foreach (var paper in result.Data)
                            {
                                // KALİTE KRİTERİ: Abstract dolu ve yeterli uzunlukta olmalı
                                if (string.IsNullOrWhiteSpace(paper.Abstract) || paper.Abstract.Length < 150)
                                    continue;

                                paper.Category = cat;

                                // MÜKERRER KONTROLÜ VE KAYIT (Dapper SQL)
                                string sql = @"
                                    IF NOT EXISTS (SELECT 1 FROM Papers WHERE PaperId = @PaperId)
                                    BEGIN
                                        INSERT INTO Papers (PaperId, Title, Abstract, PublicationYear, Category) 
                                        VALUES (@PaperId, @Title, @Abstract, @Year, @Category)
                                    END";

                                var affectedRows = await connection.ExecuteAsync(sql, paper);
                                totalSavedInThisSession += affectedRows;
                            }

                            // API'yi yormamak için her sayfa sonrası kısa bekleme
                            await Task.Delay(1500);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Hata ({cat} - Sayfa {i}): {ex.Message}");
                        }
                    }
                }
            }

        EndOfProcess:
            return totalSavedInThisSession;
        }

        // Yardımcı metod: SQL'den o anki toplam satır sayısını çeker
        private async Task<int> GetCurrentCount(IDbConnection connection)
        {
            return await connection.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Papers");
        }
    }

    public class SemanticResponse
    {
        [JsonProperty("data")]
        public List<Paper> Data { get; set; }
    }
}
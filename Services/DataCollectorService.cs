using Dapper;
using Newtonsoft.Json;
using AcademicNoveltyAnalysis.Data;
using AcademicNoveltyAnalysis.Models;
using System.Net.Http;

namespace AcademicNoveltyAnalysis.Services
{
    public class DataCollectorService
    {
        private readonly HttpClient _httpClient;
        private readonly AcademicNoveltyAnalysis.Data.DbContext _context;

        public DataCollectorService(AcademicNoveltyAnalysis.Data.DbContext context)
        {
            _httpClient = new HttpClient();
            // API'ye kendimizi tanıtmak için bir User-Agent eklemek iyidir
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "AcademicAnalysisProject/1.0");
            _context = context;
        }

        public async Task<int> CollectBulkDataAsync()
        {
            // 1. KRİTER: Homojen dağılım için 10 farklı disiplin
            string[] categories = { 
    "Computer Science", "Artificial Intelligence", "Machine Learning",
    "Cyber Security", "Medicine", "Biotechnology", "Nanotechnology",
    "Economics", "Psychology", "Environmental Science", "Sociology",
    "Political Science", "Law", "History", "Education" 
};

            int totalSaved = 0;
            int batchSize = 100; // Her istekte çekilecek miktar (Maksimum 100)
            int stepsPerCategory = 10; // Her kategori için 3 sayfa ilerle (3 x 100 = 300 potansiyel veri/kategori)

            using (var connection = _context.CreateConnection())
            {
                foreach (var cat in categories)
                {
                    for (int i = 0; i < stepsPerCategory; i++)
                    {
                        int offset = i * batchSize;

                        // 2. KRİTER: 2020 Sonrası Güncel Veri & Offset ile Sayfalama
                        string url = $"https://api.semanticscholar.org/graph/v1/paper/search?query={cat}&limit={batchSize}&offset={offset}&fields=paperId,title,abstract,year&year=2020-2026";

                        try
                        {
                            var response = await _httpClient.GetAsync(url);

                            // Hız sınırına takılırsak (429 Hatası) biraz daha fazla bekle
                            if ((int)response.StatusCode == 429)
                            {
                                await Task.Delay(5000);
                                continue;
                            }

                            if (!response.IsSuccessStatusCode) continue;

                            var content = await response.Content.ReadAsStringAsync();
                            var result = JsonConvert.DeserializeObject<SemanticResponse>(content);

                            if (result?.Data == null || result.Data.Count == 0) break;

                            foreach (var paper in result.Data)
                            {
                                // 3. KRİTER: Kalite Kontrol (Gerçek ve doyurucu veri)
                                // Abstract boşsa veya çok kısaysa (150 karakter altı) anlamsal analiz için yetersizdir.
                                if (string.IsNullOrWhiteSpace(paper.Abstract) || paper.Abstract.Length < 150)
                                    continue;

                                paper.Category = cat;

                                string sql = @"
                                    IF NOT EXISTS (SELECT 1 FROM Papers WHERE PaperId = @PaperId)
                                    BEGIN
                                        INSERT INTO Papers (PaperId, Title, Abstract, PublicationYear, Category) 
                                        VALUES (@PaperId, @Title, @Abstract, @Year, @Category)
                                    END";

                                var affectedRows = await connection.ExecuteAsync(sql, paper);
                                totalSaved += affectedRows;
                            }

                            // API güvenliği için her sayfa arasında bekleme
                            await Task.Delay(1500);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Hata ({cat} - Sayfa {i}): {ex.Message}");
                        }
                    }
                }
            }
            return totalSaved;
        }
    }

    // JSON verisini C# nesnesine eşlemek için yardımcı sınıf
    public class SemanticResponse
    {
        [JsonProperty("data")]
        public List<Paper> Data { get; set; }
    }
}
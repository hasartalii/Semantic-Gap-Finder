using System.Text;
using System.Text.Json;

namespace AcademicNoveltyAnalysis.Services
{
    // AI Integration Edit - 29.04.2026
    // Python tabanlı AI API'si ile HTTP üzerinden iletişim kuran servis sınıfı
    // Sistem: Backend
    public class AIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _aiServiceUrl = "http://localhost:8000";

        public AIService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<AnalysisResult> AnalyzeIdeaAsync(string title, string summary)
        {
            var requestBody = new
            {
                title = title,
                summary = summary
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync($"{_aiServiceUrl}/analyze", content);
                response.EnsureSuccessStatusCode();

                var responseJson = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<AnalysisResult>(responseJson, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                // Hata durumunda loglama yapılabilir
                throw new Exception($"AI servisine bağlanılamadı: {ex.Message}");
            }
        }
    }

    public class AnalysisResult
    {
        public float Novelty_score { get; set; }
        public string Most_similar_article { get; set; }
        public float Semantic_similarity { get; set; }
        public string Comment { get; set; }
    }
}

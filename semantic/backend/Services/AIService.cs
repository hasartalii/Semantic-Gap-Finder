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

        public async Task<ExtractionResult> ExtractPdfAsync(Stream pdfStream, string fileName)
        {
            using var content = new MultipartFormDataContent();
            using var streamContent = new StreamContent(pdfStream);
            streamContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/pdf");
            content.Add(streamContent, "file", fileName);

            try
            {
                var response = await _httpClient.PostAsync($"{_aiServiceUrl}/extract-pdf", content);
                response.EnsureSuccessStatusCode();

                var responseJson = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<ExtractionResult>(responseJson, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                throw new Exception($"PDF ayrıştırma hatası: {ex.Message}");
            }
        }
    }

    public class ExtractionResult
    {
        public string Title { get; set; }
        public string Abstract { get; set; }
    }

    public class AnalysisResult
    {
        public float Novelty_score { get; set; }
        public string Most_similar_article { get; set; }
        public float Semantic_similarity { get; set; }
        public string Comment { get; set; }
    }
}

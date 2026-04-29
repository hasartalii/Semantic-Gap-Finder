using AcademicNoveltyAnalysis.Services;
using Microsoft.AspNetCore.Mvc;

namespace AcademicNoveltyAnalysis.Controllers
{
    // AI Integration Edit - 29.04.2026
    // Frontend'den gelen analiz isteklerini karşılayıp AI servisine ileten API ucu
    // Sistem: Backend
    [ApiController]
    [Route("api/[controller]")]
    public class AnalysisController : ControllerBase
    {
        private readonly AIService _aiService;

        public AnalysisController(AIService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> Analyze([FromBody] AnalysisRequest request)
        {
            if (string.IsNullOrEmpty(request.Title) || string.IsNullOrEmpty(request.Summary))
            {
                return BadRequest("Başlık ve özet alanları boş bırakılamaz.");
            }

            try
            {
                var result = await _aiService.AnalyzeIdeaAsync(request.Title, request.Summary);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }

    public class AnalysisRequest
    {
        public string Title { get; set; }
        public string Summary { get; set; }
    }
}

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
        private readonly DataCollectorService _dataCollectorService;

        public AnalysisController(AIService aiService, DataCollectorService dataCollectorService)
        {
            _aiService = aiService;
            _dataCollectorService = dataCollectorService;
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

        [HttpGet("doi-metadata")]
        public async Task<IActionResult> GetDoiMetadata([FromQuery] string doi)
        {
            if (string.IsNullOrEmpty(doi)) return BadRequest("DOI boş olamaz.");

            try
            {
                var paper = await _dataCollectorService.GetPaperByDoiAsync(doi);
                return Ok(new { title = paper.Title, summary = paper.Abstract });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("extract-pdf")]
        public async Task<IActionResult> ExtractPdf([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("Dosya seçilmedi.");

            try
            {
                using var stream = file.OpenReadStream();
                var result = await _aiService.ExtractPdfAsync(stream, file.FileName);
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

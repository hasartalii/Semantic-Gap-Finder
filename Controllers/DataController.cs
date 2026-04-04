using AcademicNoveltyAnalysis.Services;
using Microsoft.AspNetCore.Mvc;

namespace AcademicNoveltyAnalysis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
        private readonly DataCollectorService _dataCollectorService;

        public DataController(DataCollectorService dataCollectorService)
        {
            _dataCollectorService = dataCollectorService;
        }

        // Tek seferde tüm kategorilerden 2020 sonrası güncel verileri toplar
        [HttpGet("collect-all")]
        public async Task<IActionResult> CollectAllPapers()
        {
            // İşlem biraz uzun sürebileceği için kullanıcıya bilgi veriyoruz
            int totalCount = await _dataCollectorService.CollectBulkDataAsync();

            if (totalCount == 0)
                return Ok(new { Message = "Yeni veri bulunamadı veya tüm veriler zaten mevcut." });

            return Ok(new
            {
                Status = "Başarılı",
                Message = $"Toplam {totalCount} adet 2020 sonrası, homojen ve gerçek makale veritabanına kaydedildi.",
                Kategoriler = "CS, AI, Medicine, CyberSecurity, Physics, Biotech, Economics, Psychology"
            });
        }
    }
}
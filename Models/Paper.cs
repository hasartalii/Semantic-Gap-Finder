namespace AcademicNoveltyAnalysis.Models
{
    public class Paper
    {
        public string PaperId { get; set; }
        public string Title { get; set; }
        public string Abstract { get; set; }
        public int? Year { get; set; }
        public string Category { get; set; } // Bunu biz ekliyoruz (Homojenlik için)
    }

    // API'nin gönderdiği listenin dış kabuğu
    public class SemanticResponse
    {
        public List<Paper> Data { get; set; }
    }
}
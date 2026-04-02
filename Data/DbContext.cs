using Microsoft.Data.SqlClient;
using System.Data;

namespace AcademicNoveltyAnalysis.Data
{
    public class DbContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public DbContext(IConfiguration configuration)
        {
            _configuration = configuration;
            // appsettings.json'daki DefaultConnection ismini okur
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
        }

        public IDbConnection CreateConnection() => new SqlConnection(_connectionString);
    }
}
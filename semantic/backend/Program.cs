using AcademicNoveltyAnalysis.Data; // Bunu eklemeyi unutma
using AcademicNoveltyAnalysis.Services; // Bunu eklemeyi unutma

var builder = WebApplication.CreateBuilder(args);

// --- BÝZÝM EKLEDÝÐÝMÝZ KISIM BAÞLANGIÇ ---

// 1. Veritabaný baðlantý aracýný sisteme tanýtýyoruz (Tek bir tane olmasý yeterli)
// AI Integration Edit - 29.04.2026
// DbContext IConfiguration gerektiriyor — DI factory pattern ile dogru sekilde kaydedildi
// Sistem: Backend
builder.Services.AddSingleton<AcademicNoveltyAnalysis.Data.DbContext>(sp =>
    new AcademicNoveltyAnalysis.Data.DbContext(sp.GetRequiredService<IConfiguration>()));

// 2. Veri çekme servisini tanýtýyoruz (Her ihtiyaç duyulduðunda oluþturulur)
builder.Services.AddScoped<DataCollectorService>();

// AI Integration Edit - 29.04.2026
// AI Analiz sonuçlarýný Python servisinden çekmek için AIService ve HttpClient sisteme kaydedildi
// Sistem: Backend
builder.Services.AddHttpClient<AIService>();

// --- BÝZÝM EKLEDÝÐÝMÝZ KISIM BÝTÝÞ ---

// Add services to the container.
builder.Services.AddControllers();

// AI Integration Edit - 29.04.2026
// Backend ile Frontend (React/Vite) arasýndaki iletiþimi saðlamak için CORS politikasý eklendi
// Sistem: Backend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// AI Integration Edit - 29.04.2026
// Tanýmlanan CORS politikasýnýn HTTP pipeline üzerinde aktif edilmesi saðlandý
// Sistem: Backend
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

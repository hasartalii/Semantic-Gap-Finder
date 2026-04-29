using AcademicNoveltyAnalysis.Data; // Bunu eklemeyi unutma
using AcademicNoveltyAnalysis.Services; // Bunu eklemeyi unutma

var builder = WebApplication.CreateBuilder(args);

// --- BÝZÝM EKLEDÝÐÝMÝZ KISIM BAÞLANGIÇ ---

// 1. Veritabaný baðlantý aracýný sisteme tanýtýyoruz (Tek bir tane olmasý yeterli)
builder.Services.AddSingleton<AcademicNoveltyAnalysis.Data.DbContext>();

// 2. Veri çekme servisini tanýtýyoruz (Her ihtiyaç duyulduðunda oluþturulur)
builder.Services.AddScoped<DataCollectorService>();

// --- BÝZÝM EKLEDÝÐÝMÝZ KISIM BÝTÝÞ ---

// Add services to the container.
builder.Services.AddControllers();

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

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
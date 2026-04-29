# AI Integration Edit - 29.04.2026
# ASP.NET Core Backend için Dockerfile oluşturuldu
# Sistem: Backend

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["AcademicNoveltyAnalysis.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
EXPOSE 5208
ENV ASPNETCORE_URLS=http://+:5208
ENTRYPOINT ["dotnet", "AcademicNoveltyAnalysis.dll"]

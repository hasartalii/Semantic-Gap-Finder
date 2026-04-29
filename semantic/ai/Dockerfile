# AI Integration Edit - 29.04.2026
# Python AI API için Dockerfile oluşturuldu
# Sistem: AI / Yapay Zeka

FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y libgomp1 && rm -rf /var/lib/apt/lists/*
COPY . .
RUN pip install --no-cache-dir fastapi uvicorn sentence-transformers faiss-cpu pydantic
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

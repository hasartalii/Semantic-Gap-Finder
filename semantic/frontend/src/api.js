// AI Integration Edit - 29.04.2026
// Backend API'si ile iletişim kuran ve analiz isteklerini yöneten servis katmanı eklendi
// Sistem: Frontend
const API_URL = 'http://localhost:5208';

export const testConnection = async () => {
    try {
        const response = await fetch(`${API_URL}/WeatherForecast`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend Bağlantısı Başarılı:', data);
            return true;
        }
        console.error('❌ Backend Yanıt Vermedi:', response.status);
        return false;
    } catch (error) {
        console.error('❌ Backend Bağlantı Hatası:', error);
        return false;
    }
};

export const analyzeIdea = async (title, summary) => {
    try {
        const response = await fetch(`${API_URL}/api/Analysis/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, summary }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Sunucu hatasý');
        }

        return await response.json();
    } catch (error) {
        console.error('❌ Analiz Hatasý:', error);
        throw error;
    }
};

export const getDoiMetadata = async (doi) => {
    try {
        const response = await fetch(`${API_URL}/api/Analysis/doi-metadata?doi=${encodeURIComponent(doi)}`);
        if (!response.ok) throw new Error('DOI bulunamadý');
        return await response.json();
    } catch (error) {
        console.error('❌ DOI Hatasý:', error);
        throw error;
    }
};

export const extractPdfMetadata = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/api/Analysis/extract-pdf`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('PDF ayryþtyrma hatasý');
        return await response.json();
    } catch (error) {
        console.error('❌ PDF Extraction Hatasý:', error);
        throw error;
    }
};

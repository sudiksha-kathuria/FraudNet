import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

export async function analyzeText(message) {
  const response = await api.post('/api/analyze-text', { message });
  return response.data;
}

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/api/analyze-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function getDashboardData() {
  const response = await api.get('/api/dashboard');
  return response.data;
}

export async function generateReport(analysisId) {
  const response = await api.post('/api/generate-report', { analysis_id: analysisId });
  return response.data;
}

export async function getAnalysis(id) {
  const response = await api.get(`/api/get-analysis/${id}`);
  return response.data;
}

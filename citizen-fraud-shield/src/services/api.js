import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 90000,  // increased for Claude multi-agent pipeline
});

export async function analyzeText(message, locationCity = '', locationState = '') {
  const response = await api.post('/api/analyze-text', {
    message,
    location_city:  locationCity || null,
    location_state: locationState || null,
  });
  return response.data;
}

export async function analyzeImage(file, locationCity = '', locationState = '') {
  const formData = new FormData();
  formData.append('image', file);
  if (locationCity)  formData.append('location_city',  locationCity);
  if (locationState) formData.append('location_state', locationState);
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

export async function getLiveFeed() {
  const response = await api.get('/api/live-feed');
  return response.data;
}

export async function getHeatmap() {
  const response = await api.get('/api/heatmap');
  return response.data;
}

export async function checkUrl(url) {
  const response = await api.get('/api/check-url', { params: { url } });
  return response.data;
}

export default api;

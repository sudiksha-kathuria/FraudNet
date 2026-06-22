import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

export async function analyzeText(message) {
  const response = await api.post('/analyze-text', { message });
  return response.data;
}

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/analyze-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function getDashboardData() {
  const response = await api.get('/dashboard');
  return response.data;
}

export async function generateReport(id) {
  const response = await api.post('/generate-report', { id });
  return response.data;
}

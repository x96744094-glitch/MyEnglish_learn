import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://myenglishlearn-production.up.railway.app/api',
  timeout: 10000,
});

export const checkHealth = () => api.get('/health').then(r => r.data);

export const vocabulary = {
  getAll: (params) => api.get('/vocabulary', { params }).then(r => r.data),
  getById: (id) => api.get(`/vocabulary/${id}`).then(r => r.data),
  search: (q) => api.get('/vocabulary/search/query', { params: { q } }).then(r => r.data),
  getStats: () => api.get('/vocabulary/stats/summary').then(r => r.data),
  create: (data) => api.post('/vocabulary', data).then(r => r.data),
  update: (id, data) => api.put(`/vocabulary/${id}`, data).then(r => r.data),
};

export const grammar = {
  getAll: (params) => api.get('/grammar', { params }).then(r => r.data),
  getById: (id) => api.get(`/grammar/${id}`).then(r => r.data),
  create: (data) => api.post('/grammar', data).then(r => r.data),
};

export const phrases = {
  getAll: (params) => api.get('/phrases', { params }).then(r => r.data),
  getById: (id) => api.get(`/phrases/${id}`).then(r => r.data),
  create: (data) => api.post('/phrases', data).then(r => r.data),
};

export const quiz = {
  generate: (data) => api.post('/quiz/generate', data).then(r => r.data),
  submit: (data) => api.post('/quiz/submit', data).then(r => r.data),
  getHistory: (userId) => api.get(`/quiz/history/${userId}`).then(r => r.data),
};

export const progress = {
  get: (userId) => api.get(`/progress/${userId}`).then(r => r.data),
  update: (userId, data) => api.post(`/progress/${userId}`, data).then(r => r.data),
  addToNotebook: (userId, wordId) => api.post(`/progress/${userId}/notebook/add`, { wordId }).then(r => r.data),
  getNotebook: (userId) => api.get(`/progress/${userId}/notebook`).then(r => r.data),
};

export default api;

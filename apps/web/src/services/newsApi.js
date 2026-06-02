import { apiClient } from './apiClient';

export const newsApi = {
  getAll: () => apiClient.get('/news'),
  getCategories: () => apiClient.get('/news/categories'),
  getById: (id) => apiClient.get(`/news/${id}`),
  create: (data) => apiClient.post('/news', data),
  update: (id, data) => apiClient.put(`/news/${id}`, data),
  delete: (id) => apiClient.delete(`/news/${id}`),
};

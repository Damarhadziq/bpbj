import { apiClient } from './apiClient';

export const galleryApi = {
  getAll: () => apiClient.get('/gallery'),
  getById: (id) => apiClient.get(`/gallery/${id}`),
  create: (data) => apiClient.post('/gallery', data),
  update: (id, data) => apiClient.put(`/gallery/${id}`, data),
  delete: (id) => apiClient.delete(`/gallery/${id}`),
};

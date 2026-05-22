import { apiClient } from './apiClient';

export const carouselApi = {
  getAll: () => apiClient.get('/carousel'),
  create: (data) => apiClient.post('/carousel', data),
  update: (id, data) => apiClient.put(`/carousel/${id}`, data),
  delete: (id) => apiClient.delete(`/carousel/${id}`),
};

import { apiClient } from './apiClient';

export const serviceLinksApi = {
  getAll: () => apiClient.get('/service-links'),
  create: (data) => apiClient.post('/service-links', data),
  update: (id, data) => apiClient.put(`/service-links/${id}`, data),
  delete: (id) => apiClient.delete(`/service-links/${id}`),
};

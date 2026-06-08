import { apiClient } from './apiClient';

export const regulationsApi = {
  getAll: () => apiClient.get('/regulations'),
  create: (data) => apiClient.post('/regulations', data),
  update: (id, data) => apiClient.put(`/regulations/${id}`, data),
  delete: (id) => apiClient.delete(`/regulations/${id}`),
};

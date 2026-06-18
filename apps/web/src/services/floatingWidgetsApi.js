import { apiClient } from './apiClient';

export const floatingWidgetsApi = {
  getAll: () => apiClient.get('/floating-widgets'),
  getAdminAll: () => apiClient.get('/floating-widgets/admin'),
  create: (data) => apiClient.post('/floating-widgets', data),
  update: (id, data) => apiClient.put(`/floating-widgets/${id}`, data),
  delete: (id) => apiClient.delete(`/floating-widgets/${id}`),
};

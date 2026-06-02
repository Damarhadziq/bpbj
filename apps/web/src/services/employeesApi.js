import { apiClient } from './apiClient';

export const employeesApi = {
  getAll: () => apiClient.get('/employees'),
  create: (data) => apiClient.post('/employees', data),
  update: (id, data) => apiClient.put(`/employees/${id}`, data),
  delete: (id) => apiClient.delete(`/employees/${id}`),
};

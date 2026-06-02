import { apiClient } from './apiClient';

export const usersApi = {
  getAll: () => apiClient.get('/users'),
  create: (data) => apiClient.post('/users', data),
  updateOwnProfile: (data) => apiClient.put('/users/me/profile', data),
  updateRole: (id, role) => apiClient.put(`/users/${id}/role`, { role }),
  changePassword: (id, data) => apiClient.put(`/users/${id}/password`, data),
  changeOwnPassword: (data) => apiClient.put('/users/me/password', data),
  delete: (id, data) => apiClient.delete(`/users/${id}`, { data }),
};

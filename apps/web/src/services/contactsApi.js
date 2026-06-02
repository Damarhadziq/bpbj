import { apiClient } from './apiClient';

export const contactsApi = {
  getAll: () => apiClient.get('/contacts'),
  create: (data) => apiClient.post('/contacts', data),
  updateStatus: (id, status) => apiClient.put(`/contacts/${id}/status`, { status }),
  reply: (id, data) => apiClient.post(`/contacts/${id}/reply`, data),
  delete: (id, data) => apiClient.delete(`/contacts/${id}`, { data }),
};

import { apiClient } from './apiClient';

export const contactsApi = {
  getAll: () => apiClient.get('/contacts'),
  create: (data) => apiClient.post('/contacts', data),
  updateStatus: (id, status) => apiClient.put(`/contacts/${id}/status`, { status }),
  delete: (id, data) => apiClient.delete(`/contacts/${id}`, { data }),
};

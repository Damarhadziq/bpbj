import { apiClient } from './apiClient';

export const welcomeApi = {
  get: () => apiClient.get('/welcome-message'),
  update: (data) => apiClient.put('/welcome-message', data),
};

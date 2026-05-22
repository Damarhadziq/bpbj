import { apiClient } from './apiClient';

export const analyticsApi = {
  trackVisit: (data) => apiClient.post('/analytics/visit', data),
  getStats: () => apiClient.get('/analytics/stats'),
};

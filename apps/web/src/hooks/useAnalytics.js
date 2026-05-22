import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../services/analyticsApi';

export const useVisitorStats = (options = {}) => {
  return useQuery({
    queryKey: ['visitor-stats'],
    queryFn: analyticsApi.getStats,
    refetchInterval: 30000,
    ...options,
  });
};

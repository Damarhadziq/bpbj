import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { welcomeApi } from '../services/welcomeApi';

export const useWelcomeMessage = (options = {}) => {
  return useQuery({
    queryKey: ['welcomeMessage'],
    queryFn: welcomeApi.get,
    retry: 1, // Don't keep retrying if it doesn't exist yet
    ...options,
  });
};

export const useUpdateWelcomeMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: welcomeApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['welcomeMessage'] });
    },
  });
};

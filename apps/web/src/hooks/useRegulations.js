import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { regulationsApi } from '../services/regulationsApi';

export const useRegulations = (options = {}) => {
  return useQuery({
    queryKey: ['regulations'],
    queryFn: regulationsApi.getAll,
    ...options,
  });
};

export const useCreateRegulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: regulationsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['regulations'] }),
  });
};

export const useUpdateRegulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => regulationsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['regulations'] }),
  });
};

export const useDeleteRegulation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: regulationsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['regulations'] }),
  });
};

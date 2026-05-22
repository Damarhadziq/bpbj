import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsApi } from '../services/newsApi';

export const useNews = (options = {}) => {
  return useQuery({
    queryKey: ['news'],
    queryFn: newsApi.getAll,
    ...options,
  });
};

export const useNewsDetail = (id, options = {}) => {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => newsApi.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: newsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => newsApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news', variables.id] });
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: newsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

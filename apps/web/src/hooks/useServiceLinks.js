import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { serviceLinksApi } from '../services/serviceLinksApi';

export const useServiceLinks = (options = {}) => {
  return useQuery({
    queryKey: ['service-links'],
    queryFn: serviceLinksApi.getAll,
    ...options,
  });
};

export const useCreateServiceLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: serviceLinksApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service-links'] }),
  });
};

export const useUpdateServiceLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => serviceLinksApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service-links'] }),
  });
};

export const useDeleteServiceLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: serviceLinksApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service-links'] }),
  });
};

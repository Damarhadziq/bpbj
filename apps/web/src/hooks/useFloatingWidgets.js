import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { floatingWidgetsApi } from '../services/floatingWidgetsApi';

export const useFloatingWidgets = (options = {}) => {
  return useQuery({
    queryKey: ['floating-widgets'],
    queryFn: floatingWidgetsApi.getAll,
    ...options,
  });
};

export const useAdminFloatingWidgets = (options = {}) => {
  return useQuery({
    queryKey: ['floating-widgets', 'admin'],
    queryFn: floatingWidgetsApi.getAdminAll,
    ...options,
  });
};

export const useCreateFloatingWidget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: floatingWidgetsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floating-widgets'] });
    },
  });
};

export const useUpdateFloatingWidget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => floatingWidgetsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floating-widgets'] });
    },
  });
};

export const useDeleteFloatingWidget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: floatingWidgetsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floating-widgets'] });
    },
  });
};

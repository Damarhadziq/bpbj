import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeesApi } from '../services/employeesApi';

export const useEmployees = (options = {}) => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: employeesApi.getAll,
    ...options,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeesApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => employeesApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeesApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../services/usersApi';

export const useUsers = (options = {}) => {
  return useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
    ...options,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => usersApi.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateOwnProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.updateOwnProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => usersApi.delete(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useChangeUserPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => usersApi.changePassword(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useChangeOwnPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.changeOwnPassword,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

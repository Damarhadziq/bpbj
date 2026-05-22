import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '../services/contactsApi';

export const useContacts = (options = {}) => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: contactsApi.getAll,
    ...options,
  });
};

export const useCreateContact = () => {
  return useMutation({
    mutationFn: contactsApi.create,
    // Typically no need to invalidate cache for public submission unless viewed in same session
  });
};

export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => contactsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => contactsApi.delete(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

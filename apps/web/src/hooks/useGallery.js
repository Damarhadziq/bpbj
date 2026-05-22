import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryApi } from '../services/galleryApi';

export const useGallery = (options = {}) => {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: galleryApi.getAll,
    ...options,
  });
};

export const useGalleryDetail = (id, options = {}) => {
  return useQuery({
    queryKey: ['gallery', id],
    queryFn: () => galleryApi.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: galleryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });
};

export const useUpdateGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => galleryApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery', variables.id] });
    },
  });
};

export const useDeleteGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: galleryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });
};

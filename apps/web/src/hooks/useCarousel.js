import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carouselApi } from '../services/carouselApi';

export const useCarousel = (options = {}) => {
  return useQuery({
    queryKey: ['carousel'],
    queryFn: carouselApi.getAll,
    ...options,
  });
};

export const useCreateCarousel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: carouselApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carousel'] });
    },
  });
};

export const useUpdateCarousel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => carouselApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carousel'] });
    },
  });
};

export const useDeleteCarousel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: carouselApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carousel'] });
    },
  });
};

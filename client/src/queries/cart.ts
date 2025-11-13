import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addCartItem,
  deleteCartItem,
  loadCartPage,
  updateCartItem,
} from '../api/cart';

const cartKeys = {
  all: ['cart'] as const,
};

export const useLoadCart = () => {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: loadCartPage,
  });
};

export const useAddCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};
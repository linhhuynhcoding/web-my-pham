import { useQuery } from '@tanstack/react-query';
import { loadProfileInfoPage, loadUserOrderPage } from '../api/user';
import { Pagination } from '../api/types';

const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  orders: (pagination?: Pagination) =>
    [...userKeys.all, 'orders', { pagination }] as const,
};

export const useProfileInfo = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: loadProfileInfoPage,
    ...options,
  });
};

export const useUserOrders = (
  pagination?: Pagination,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: userKeys.orders(pagination),
    queryFn: () => loadUserOrderPage(pagination),
    ...options,
  });
};
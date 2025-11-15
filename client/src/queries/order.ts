import { useQuery } from '@tanstack/react-query';
import { getOrder } from '../api/order';

export const useOrderDetails = (orderId: string | undefined) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
        const res = await getOrder(orderId!);
        return res.order;
    },
    enabled: !!orderId, // Only run query if orderId is present
  });
};
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminLoadOrders, updateOrderStatus } from "@/api/admin";
import {
  AdminLoadOrdersRequest,
  AdminLoadOrdersResponse,
  UpdateOrderStatusRequest,
} from "@/api/types";

export const ADMIN_ORDERS_QUERY_KEY = "adminOrders";

/**
 * Custom hook to fetch all orders for the admin view with filtering and pagination.
 * @param params - The request parameters, including filters and pagination.
 * @returns The result of the react-query useQuery hook.
 */
export const useAdminLoadOrders = (params: AdminLoadOrdersRequest) => {
  return useQuery<AdminLoadOrdersResponse, Error>({
    queryKey: [ADMIN_ORDERS_QUERY_KEY, params],
    queryFn: () => adminLoadOrders(params),
  });
};

/**
 * Custom hook to provide a mutation for updating an order's status.
 * @returns The result of the react-query useMutation hook.
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateOrderStatusRequest) => updateOrderStatus(data),
    onSuccess: () => {
      // Invalidate and refetch the orders query to show the updated status.
      queryClient.invalidateQueries({ queryKey: [ADMIN_ORDERS_QUERY_KEY] });
    },
  });
};
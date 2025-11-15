import { useMutation } from '@tanstack/react-query';
import { placeOrder as apiPlaceOrder } from '../api/order';
import { PlaceOrderRequest, PlaceOrderResponse } from '../api/types';

interface UsePlaceOrder {
  placeOrder: (request: PlaceOrderRequest) => void;
  data: PlaceOrderResponse | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const usePlaceOrder = (
  onSuccess: (data: PlaceOrderResponse) => void,
): UsePlaceOrder => {
  const {
    mutate: placeOrder,
    data,
    isPending: isLoading,
    error,
  } = useMutation<PlaceOrderResponse, Error, PlaceOrderRequest>({
    mutationFn: apiPlaceOrder,
    // You can add onSuccess, onError, onSettled callbacks here for side effects
    // For example:
    onSuccess: onSuccess,
    // onError: (error) => { console.error('Error placing order:', error); },
  });

  return { placeOrder, data, isLoading, error };
};
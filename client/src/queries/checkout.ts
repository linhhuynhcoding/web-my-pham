import { useQuery } from '@tanstack/react-query';
import { LoadCheckoutPageResponse } from '../api/types';
import { loadCheckoutPage } from '../api/order';


// Custom hook to use in the CheckoutPage component
export const useLoadCheckout = (encodedItemIds: string | undefined) => {
    return useQuery<LoadCheckoutPageResponse, Error>({
        queryKey: ['checkout', encodedItemIds],
        queryFn: () => {
            if (!encodedItemIds) {
                // This should ideally not happen if `enabled` is false.
                throw new Error('No item IDs provided for checkout');
            }
            // Decode the base64 string
            const decodedString = atob(encodedItemIds);
            // Split into an array of strings and convert to numbers
            const cartItemIds = decodedString.split(',').map(Number);

            return loadCheckoutPage({ cartItemIds });
        },
        enabled: !!encodedItemIds, // Only run the query if encodedItemIds is not undefined/empty
    });
};

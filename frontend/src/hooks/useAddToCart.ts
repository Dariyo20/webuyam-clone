import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { ApiResponse, Cart, Product } from '../types';

interface AddToCartVars {
  productId: string;
  quantity: number;
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: AddToCartVars) =>
      api.post<ApiResponse<Cart>>('/api/cart/items', vars),

    onMutate: async ({ productId, quantity }) => {
      // Cancel any outgoing cart refetches
      await queryClient.cancelQueries({ queryKey: ['cart'] });

      // Snapshot the previous cart
      const prevCart = queryClient.getQueryData<Cart | null>(['cart']);

      // Optimistically update the cart
      queryClient.setQueryData<Cart | null>(['cart'], (old) => {
        if (!old) return old;

        const existingIndex = old.items.findIndex(
          (item) => item.productId._id === productId
        );

        if (existingIndex !== -1) {
          // Increment existing item quantity
          const updatedItems = old.items.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          return { ...old, items: updatedItems };
        } else {
          // Add new item with a partial product stub (sufficient for badge count)
          return {
            ...old,
            items: [
              ...old.items,
              {
                _id: `optimistic-${productId}`,
                productId: { _id: productId } as Product,
                quantity,
              },
            ],
          };
        }
      });

      return { prevCart };
    },

    onError: (_err, _vars, context) => {
      // Roll back to snapshot
      if (context?.prevCart !== undefined) {
        queryClient.setQueryData(['cart'], context.prevCart);
      }
    },

    onSettled: () => {
      // Always refetch to get real server state
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

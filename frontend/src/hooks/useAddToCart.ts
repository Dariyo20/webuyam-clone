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
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const prevCart = queryClient.getQueryData<Cart | null>(['cart']);

      queryClient.setQueryData<Cart | null>(['cart'], (old) => {
        if (!old) return old;
        const existingIndex = old.items.findIndex(
          (item) => item.productId._id === productId
        );
        if (existingIndex !== -1) {
          const updatedItems = old.items.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          return { ...old, items: updatedItems };
        }
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
      });

      return { prevCart };
    },

    onError: (_err, _vars, context) => {
      // Roll back optimistic update — toast is fired by the caller
      if (context?.prevCart !== undefined) {
        queryClient.setQueryData(['cart'], context.prevCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { ApiResponse, Cart } from '../types';

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      api.patch<ApiResponse<Cart>>(`/api/cart/items/${productId}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

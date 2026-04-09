import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) =>
      api.delete(`/api/cart/items/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

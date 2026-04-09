import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import type { ApiResponse, Cart } from '../types';

export function useCart() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery<Cart | null>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Cart>>('/api/cart');
      return res.data.data ?? null;
    },
    enabled: isAuthenticated,
  });
}

import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { ApiResponse, Product } from '../types';

export function useProduct(slug: string) {
  return useQuery<Product>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Product>>(`/api/products/${slug}`);
      if (!res.data.data) throw new Error('Product not found');
      return res.data.data;
    },
    enabled: Boolean(slug),
    retry: false,
  });
}

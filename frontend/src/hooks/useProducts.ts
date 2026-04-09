import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Product } from '../types';

export interface ProductsPage {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ProductsApiResponse {
  success: boolean;
  data: ProductsPage;
}

export function useProducts(page: number) {
  return useQuery<ProductsPage>({
    queryKey: ['products', page],
    queryFn: async () => {
      const res = await api.get<ProductsApiResponse>(
        `/api/products?page=${page}&limit=20`
      );
      return res.data.data;
    },
    placeholderData: keepPreviousData,
  });
}

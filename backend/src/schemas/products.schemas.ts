import { z } from 'zod';

export const paginatedProductsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/, 'page must be a positive integer')
      .optional(),
    limit: z
      .string()
      .regex(/^\d+$/, 'limit must be a positive integer')
      .optional(),
  }),
});

export const productBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, 'Slug is required'),
  }),
});

import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    productId: z
      .string({ required_error: 'productId is required' })
      .min(1, 'productId is required'),
    quantity: z
      .number({ required_error: 'quantity is required' })
      .int('quantity must be an integer')
      .positive('quantity must be at least 1'),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z
      .number({ required_error: 'quantity is required' })
      .int('quantity must be an integer')
      .positive('quantity must be at least 1'),
  }),
  params: z.object({
    productId: z.string().min(1, 'productId param is required'),
  }),
});

export const cartItemParamSchema = z.object({
  params: z.object({
    productId: z.string().min(1, 'productId param is required'),
  }),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>['body'];
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>['body'];

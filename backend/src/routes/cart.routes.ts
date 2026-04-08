import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from '../controllers/cart.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  addToCartSchema,
  updateCartItemSchema,
  cartItemParamSchema,
} from '../schemas/cart.schemas';

const router = Router();

// All cart routes require authentication
router.use(requireAuth);

router.get('/', getCart);
router.post('/items', validate(addToCartSchema), addToCart);
router.patch('/items/:productId', validate(updateCartItemSchema), updateCartItem);
router.delete('/items/:productId', validate(cartItemParamSchema), removeCartItem);

export default router;

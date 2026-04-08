import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import type { AddToCartInput, UpdateCartItemInput } from '../schemas/cart.schemas';

// Helper: populate + return the cart document as a clean response
async function populateAndRespond(
  cartId: mongoose.Types.ObjectId,
  res: Response
): Promise<void> {
  const populated = await Cart.findById(cartId)
    .populate('items.productId')
    .lean();

  res.json({ success: true, data: populated });
}

// GET /api/cart
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError('Authentication required', 401, 'UNAUTHORIZED');

  let cart = await Cart.findOne({ userId }).populate('items.productId').lean();

  // Auto-create an empty cart if the user has none yet
  if (!cart) {
    const newCart = await Cart.create({ userId, items: [] });
    cart = await Cart.findById(newCart._id).populate('items.productId').lean();
  }

  res.json({ success: true, data: cart });
});

// POST /api/cart/items
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError('Authentication required', 401, 'UNAUTHORIZED');

  const { productId, quantity } = req.body as AddToCartInput;

  // Validate ObjectId format before hitting the database
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError('Invalid product ID', 400, 'INVALID_FIELD');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404, 'NOT_FOUND');
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId: new mongoose.Types.ObjectId(productId),
      quantity,
    });
  }

  await cart.save();
  await populateAndRespond(cart._id as mongoose.Types.ObjectId, res);
});

// PATCH /api/cart/items/:productId
export const updateCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Authentication required', 401, 'UNAUTHORIZED');

    const { productId } = req.params;
    const { quantity } = req.body as UpdateCartItemInput;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError('Invalid product ID', 400, 'INVALID_FIELD');
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new AppError('Cart not found', 404, 'NOT_FOUND');
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );
    if (!item) {
      throw new AppError('Item not found in cart', 404, 'NOT_FOUND');
    }

    item.quantity = quantity;
    await cart.save();
    await populateAndRespond(cart._id as mongoose.Types.ObjectId, res);
  }
);

// DELETE /api/cart/items/:productId
export const removeCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Authentication required', 401, 'UNAUTHORIZED');

    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError('Invalid product ID', 400, 'INVALID_FIELD');
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new AppError('Cart not found', 404, 'NOT_FOUND');
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );
    if (itemIndex === -1) {
      throw new AppError('Item not found in cart', 404, 'NOT_FOUND');
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    await populateAndRespond(cart._id as mongoose.Types.ObjectId, res);
  }
);

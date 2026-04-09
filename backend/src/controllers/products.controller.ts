import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import type { PaginatedData, Product as ProductType } from '../types';

// GET /api/products?page=1&limit=20
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const rawPage = parseInt(String(req.query['page'] ?? '1'), 10);
  const rawLimit = parseInt(String(req.query['limit'] ?? '20'), 10);

  // Guard against nonsensical values even after Zod validation
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const limit = isNaN(rawLimit) || rawLimit < 1 ? 20 : Math.min(rawLimit, 50);
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find().sort({ createdAt: 1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / limit);

  const payload: PaginatedData<ProductType> = {
    data: products as unknown as ProductType[],
    meta: { page, limit, total, totalPages },
  };

  res.json({ success: true, data: payload });
});

// GET /api/products/:slug
export const getProductBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;

    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      throw new AppError('Product not found', 404, 'NOT_FOUND');
    }

    res.json({ success: true, data: product as unknown as ProductType });
  }
);

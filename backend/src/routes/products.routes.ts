import { Router } from 'express';
import { getProducts, getProductBySlug } from '../controllers/products.controller';
import { validate } from '../middleware/validate.middleware';
import { paginatedProductsSchema, productBySlugSchema } from '../schemas/products.schemas';

const router = Router();

router.get('/', validate(paginatedProductsSchema), getProducts);
router.get('/:slug', validate(productBySlugSchema), getProductBySlug);

export default router;

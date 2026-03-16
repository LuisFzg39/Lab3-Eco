import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
    createProductHandler,
    updateProductHandler,
    deleteProductHandler,
} from '../features/products/product.controller';

const router = Router();

router.post('/', requireAuth, createProductHandler);

router.patch('/:id', requireAuth, updateProductHandler);

router.delete('/:id', requireAuth, deleteProductHandler);

export default router;

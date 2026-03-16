import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
    getOpenStores,
    getMyStore,
    getStoreById,
    openStoreHandler,
    closeStoreHandler,
} from '../features/stores/store.controller';
import { getProductsByStoreHandler } from '../features/products/product.controller';

const router = Router();

router.get('/', getOpenStores);

router.get('/my-store', requireAuth, getMyStore);

router.get('/:storeId/products', getProductsByStoreHandler);

router.get('/:id', getStoreById);

router.patch('/:id/open', requireAuth, openStoreHandler);

router.patch('/:id/close', requireAuth, closeStoreHandler);

export default router;

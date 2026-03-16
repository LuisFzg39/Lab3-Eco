import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
    createOrderHandler,
    getMyOrdersHandler,
    getOrderByIdHandler,
    getAvailableOrdersHandler,
    acceptOrderHandler,
    getMyDeliveriesHandler,
} from '../features/orders/order.controller';

const router = Router();

router.post('/', requireAuth, createOrderHandler);

router.get('/my-orders', requireAuth, getMyOrdersHandler);

router.get('/available', requireAuth, getAvailableOrdersHandler);

router.get('/my-deliveries', requireAuth, getMyDeliveriesHandler);

router.get('/:id', requireAuth, getOrderByIdHandler);

router.patch('/:id/accept', requireAuth, acceptOrderHandler);

export default router;

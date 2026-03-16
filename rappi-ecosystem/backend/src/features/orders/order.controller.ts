import { Request, Response } from 'express';
import {
    placeOrder, fetchOrderById, fetchMyOrders,
    fetchAvailableOrders, acceptOrder, fetchMyDeliveries
} from './order.service';
import { CreateOrderPayload } from './order.types';

// ─── Error mapper ─────────────────────────────────────────────────────────────
const handleError = (err: unknown, res: Response, context: string): void => {
    if (err instanceof Error) {
        if (err.message === 'ORDER_NOT_FOUND') {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        if (err.message === 'FORBIDDEN') {
            res.status(403).json({ error: 'You do not have access to this order' });
            return;
        }
        if (err.message === 'ORDER_ALREADY_ASSIGNED') {
            res.status(409).json({ error: 'This order has already been assigned' });
            return;
        }
        if (err.message === 'ORDER_NOT_PENDING') {
            res.status(400).json({ error: 'Order is no longer pending' });
            return;
        }
        if (err.message === 'EMPTY_ITEMS') {
            res.status(400).json({ error: 'Order must contain at least one item' });
            return;
        }
        if (err.message === 'INVALID_QUANTITY') {
            res.status(400).json({ error: 'Each item quantity must be a positive integer' });
            return;
        }
        if (err.message.startsWith('PRODUCT_NOT_FOUND:')) {
            const id = err.message.split(':')[1];
            res.status(404).json({ error: `Product not found: ${id}` });
            return;
        }
        if (err.message.startsWith('PRODUCT_STORE_MISMATCH:')) {
            const id = err.message.split(':')[1];
            res.status(400).json({
                error: `Product ${id} does not belong to the specified store`,
            });
            return;
        }
    }
    console.error(`[${context}]`, err);
    res.status(500).json({ error: 'Internal server error' });
};

// ─── POST /orders ─────────────────────────────────────────────────────────────
export const createOrderHandler = async (req: Request, res: Response): Promise<void> => {
    const { storeId, items } = req.body as CreateOrderPayload;

    if (!storeId) {
        res.status(400).json({ error: 'storeId is required' });
        return;
    }
    if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'items must be a non-empty array' });
        return;
    }

    try {
        const order = await placeOrder(req.userId!, { storeId, items });
        res.status(201).json({ order });
    } catch (err) {
        handleError(err, res, 'POST /orders');
    }
};

// ─── GET /orders/my-orders ────────────────────────────────────────────────────
export const getMyOrdersHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await fetchMyOrders(req.userId!);
        res.status(200).json({ orders });
    } catch (err) {
        handleError(err, res, 'GET /orders/my-orders');
    }
};

// ─── GET /orders/:id ──────────────────────────────────────────────────────────
export const getOrderByIdHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await fetchOrderById(req.params.id, req.userId!);
        res.status(200).json({ order });
    } catch (err) {
        handleError(err, res, 'GET /orders/:id');
    }
};

// ─── GET /orders/available ────────────────────────────────────────────────────
export const getAvailableOrdersHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const orders = await fetchAvailableOrders();
        res.status(200).json({ orders });
    } catch (err) {
        handleError(err, res, 'GET /orders/available');
    }
};

// ─── PATCH /orders/:id/accept ─────────────────────────────────────────────────
export const acceptOrderHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await acceptOrder(req.params.id, req.userId!);
        res.status(200).json({ message: 'Order accepted successfully', order });
    } catch (err) {
        handleError(err, res, 'PATCH /orders/:id/accept');
    }
};

// ─── GET /orders/my-deliveries ────────────────────────────────────────────────
export const getMyDeliveriesHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await fetchMyDeliveries(req.userId!);
        res.status(200).json({ orders });
    } catch (err) {
        handleError(err, res, 'GET /orders/my-deliveries');
    }
};

import { getProductById } from '../products/product.repository';
import {
    createOrderTransaction,
    getOrderWithItems,
    getOrdersByConsumer,
    getAvailableOrders,
    assignDelivery,
    getOrdersByDelivery,
    getOrderById,
} from './order.repository';
import { CreateOrderPayload, Order, OrderWithItems } from './order.types';

// ─── placeOrder ───────────────────────────────────────────────────────────────

export const placeOrder = async (
    consumerId: string,
    payload: CreateOrderPayload
): Promise<OrderWithItems> => {
    const { storeId, items } = payload;

    if (!items || items.length === 0) {
        throw new Error('EMPTY_ITEMS');
    }

    for (const item of items) {
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            throw new Error('INVALID_QUANTITY');
        }

        const product = await getProductById(item.productId);
        if (!product) {
            throw new Error(`PRODUCT_NOT_FOUND:${item.productId}`);
        }
        if (product.store_id !== storeId) {
            throw new Error(`PRODUCT_STORE_MISMATCH:${item.productId}`);
        }
    }

    const order = await createOrderTransaction(consumerId, storeId, items);

    const full = await getOrderWithItems(order.id);
    return full!;
};

// ─── fetchOrderById ───────────────────────────────────────────────────────────

export const fetchOrderById = async (
    orderId: string,
    requesterId: string
): Promise<OrderWithItems> => {
    const order = await getOrderWithItems(orderId);
    if (!order) throw new Error('ORDER_NOT_FOUND');
    if (order.consumer_id !== requesterId) throw new Error('FORBIDDEN');
    return order;
};

// ─── fetchMyOrders ────────────────────────────────────────────────────────────
export const fetchMyOrders = async (consumerId: string): Promise<Order[]> => {
    return getOrdersByConsumer(consumerId);
};

// ─── fetchAvailableOrders ─────────────────────────────────────────────────────
export const fetchAvailableOrders = async (): Promise<Order[]> => {
    return getAvailableOrders();
};

// ─── acceptOrder ──────────────────────────────────────────────────────────────
export const acceptOrder = async (orderId: string, deliveryId: string): Promise<Order> => {
    const order = await getOrderById(orderId);
    if (!order) throw new Error('ORDER_NOT_FOUND');
    if (order.delivery_id) throw new Error('ORDER_ALREADY_ASSIGNED');
    if (order.status !== 'pending') throw new Error('ORDER_NOT_PENDING');

    const updated = await assignDelivery(orderId, deliveryId);
    if (!updated) {

        throw new Error('ORDER_ALREADY_ASSIGNED');
    }
    return updated;
};

// ─── fetchMyDeliveries ────────────────────────────────────────────────────────
export const fetchMyDeliveries = async (deliveryId: string): Promise<Order[]> => {
    return getOrdersByDelivery(deliveryId);
};

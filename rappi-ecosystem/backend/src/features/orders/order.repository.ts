import { PoolClient } from 'pg';
import { pool } from '../../config/database';
import { Order, OrderItem, OrderWithItems, OrderItemInput } from './order.types';

// ─── createOrderTransaction ───────────────────────────────────────────────────

export const createOrderTransaction = async (
    consumerId: string,
    storeId: string,
    items: OrderItemInput[]
): Promise<Order> => {
    const client: PoolClient = await pool.connect();

    try {
        await client.query('BEGIN');

        const { rows: orderRows } = await client.query<Order>(
            `INSERT INTO orders (consumer_id, store_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
            [consumerId, storeId]
        );
        const order = orderRows[0];

        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
                [order.id, item.productId, item.quantity]
            );
        }

        await client.query('COMMIT');
        return order;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// ─── getOrderById ─────────────────────────────────────────────────────────────
export const getOrderById = async (id: string): Promise<Order | null> => {
    const { rows } = await pool.query<Order>(
        `SELECT * FROM orders WHERE id = $1 LIMIT 1`,
        [id]
    );
    return rows[0] ?? null;
};

// ─── getItemsByOrderId ────────────────────────────────────────────────────────
export const getItemsByOrderId = async (orderId: string): Promise<OrderItem[]> => {
    const { rows } = await pool.query<OrderItem>(
        `SELECT * FROM order_items WHERE order_id = $1`,
        [orderId]
    );
    return rows;
};

// ─── getOrderWithItems ────────────────────────────────────────────────────────

export const getOrderWithItems = async (id: string): Promise<OrderWithItems | null> => {
    const order = await getOrderById(id);
    if (!order) return null;

    const items = await getItemsByOrderId(id);
    return { ...order, items };
};

// ─── getOrdersByConsumer ──────────────────────────────────────────────────────
export const getOrdersByConsumer = async (consumerId: string): Promise<Order[]> => {
    const { rows } = await pool.query<Order>(
        `SELECT * FROM orders WHERE consumer_id = $1 ORDER BY created_at DESC`,
        [consumerId]
    );
    return rows;
};

// ─── getAvailableOrders (Delivery) ────────────────────────────────────────────
export const getAvailableOrders = async (): Promise<Order[]> => {
    const { rows } = await pool.query<Order>(
        `SELECT * FROM orders WHERE status = 'pending' AND delivery_id IS NULL ORDER BY created_at ASC`
    );
    return rows;
};

// ─── assignDelivery ───────────────────────────────────────────────────────────
export const assignDelivery = async (
    orderId: string,
    deliveryId: string
): Promise<Order | null> => {
    const { rows } = await pool.query<Order>(
        `UPDATE orders
         SET delivery_id = $1, status = 'in_delivery'
         WHERE id = $2 AND status = 'pending' AND delivery_id IS NULL
         RETURNING *`,
        [deliveryId, orderId]
    );
    return rows[0] ?? null;
};

// ─── getOrdersByDelivery ──────────────────────────────────────────────────────
export const getOrdersByDelivery = async (deliveryId: string): Promise<Order[]> => {
    const { rows } = await pool.query<Order>(
        `SELECT * FROM orders WHERE delivery_id = $1 ORDER BY created_at DESC`,
        [deliveryId]
    );
    return rows;
};

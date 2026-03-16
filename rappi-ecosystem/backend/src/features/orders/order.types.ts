// ─── Domain Interfaces ────────────────────────────────────────────────────────

export interface Order {
    id: string;
    consumer_id: string;
    store_id: string;
    delivery_id: string | null;
    status: string;
    created_at: Date;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
}

export interface OrderWithItems extends Order {
    items: OrderItem[];
}

// ─── Request Payloads ─────────────────────────────────────────────────────────

export interface OrderItemInput {
    productId: string;
    quantity: number;
}

export interface CreateOrderPayload {
    storeId: string;
    items: OrderItemInput[];
}

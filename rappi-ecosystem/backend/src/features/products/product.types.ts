// ─── Domain Interfaces ────────────────────────────────────────────────────────

export interface Product {
    id: string;
    name: string;
    price: number;
    store_id: string;
    created_at: Date;
}

// ─── Request Payloads ─────────────────────────────────────────────────────────

export interface CreateProductPayload {
    name: string;
    price: number;
    store_id: string;
}

export interface UpdateProductPayload {
    name?: string;
    price?: number;
}

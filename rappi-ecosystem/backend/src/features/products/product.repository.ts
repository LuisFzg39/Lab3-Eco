import { pool } from '../../config/database';
import { Product, CreateProductPayload, UpdateProductPayload } from './product.types';

// ─── createProduct ────────────────────────────────────────────────────────────
export const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
    const { rows } = await pool.query<Product>(
        `INSERT INTO products (name, price, store_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
        [payload.name, payload.price, payload.store_id]
    );
    return rows[0];
};

// ─── getProductsByStore ───────────────────────────────────────────────────────
export const getProductsByStore = async (storeId: string): Promise<Product[]> => {
    const { rows } = await pool.query<Product>(
        `SELECT * FROM products WHERE store_id = $1 ORDER BY created_at DESC`,
        [storeId]
    );
    return rows;
};

// ─── getProductById ───────────────────────────────────────────────────────────
export const getProductById = async (id: string): Promise<Product | null> => {
    const { rows } = await pool.query<Product>(
        `SELECT * FROM products WHERE id = $1 LIMIT 1`,
        [id]
    );
    return rows[0] ?? null;
};

// ─── updateProduct ────────────────────────────────────────────────────────────

export const updateProduct = async (
    id: string,
    payload: UpdateProductPayload
): Promise<Product | null> => {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (payload.name !== undefined) {
        fields.push(`name = $${paramIndex++}`);
        values.push(payload.name);
    }
    if (payload.price !== undefined) {
        fields.push(`price = $${paramIndex++}`);
        values.push(payload.price);
    }

    if (fields.length === 0) return getProductById(id);

    values.push(id);
    const { rows } = await pool.query<Product>(
        `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
    );
    return rows[0] ?? null;
};

// ─── deleteProduct ────────────────────────────────────────────────────────────
export const deleteProduct = async (id: string): Promise<boolean> => {
    const { rowCount } = await pool.query(
        `DELETE FROM products WHERE id = $1`,
        [id]
    );
    return (rowCount ?? 0) > 0;
};

import { pool } from '../../config/database';
import { Store } from '../users/user.types';

// ─── getAllOpenStores ─────────────────────────────────────────────────────────
export const getAllOpenStores = async (): Promise<Store[]> => {
    const { rows } = await pool.query<Store>(
        `SELECT * FROM stores WHERE is_open = true ORDER BY created_at DESC`
    );
    return rows;
};

// ─── getStoreById ─────────────────────────────────────────────────────────────
export const getStoreById = async (id: string): Promise<Store | null> => {
    const { rows } = await pool.query<Store>(
        `SELECT * FROM stores WHERE id = $1 LIMIT 1`,
        [id]
    );
    return rows[0] ?? null;
};

// ─── getStoreByUserId ─────────────────────────────────────────────────────────
export const getStoreByUserId = async (userId: string): Promise<Store | null> => {
    const { rows } = await pool.query<Store>(
        `SELECT * FROM stores WHERE user_id = $1 LIMIT 1`,
        [userId]
    );
    return rows[0] ?? null;
};

// ─── setStoreOpenStatus ───────────────────────────────────────────────────────
export const setStoreOpenStatus = async (
    id: string,
    isOpen: boolean
): Promise<Store | null> => {
    const { rows } = await pool.query<Store>(
        `UPDATE stores SET is_open = $1 WHERE id = $2 RETURNING *`,
        [isOpen, id]
    );
    return rows[0] ?? null;
};

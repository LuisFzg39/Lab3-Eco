import { pool } from '../../config/database';
import { User, Store, RegisterPayload } from './user.types';

// ─── createUser ───────────────────────────────────────────────────────────────

export const createUser = async (payload: RegisterPayload): Promise<User> => {
    const { rows } = await pool.query<User>(
        `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
        [payload.name, payload.email, payload.password, payload.role]
    );
    return rows[0];
};

// ─── getUserByEmail ───────────────────────────────────────────────────────────

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const { rows } = await pool.query<User>(
        `SELECT * FROM users WHERE email = $1 LIMIT 1`,
        [email]
    );
    return rows[0] ?? null;
};

// ─── getUserById ──────────────────────────────────────────────────────────────

export const getUserById = async (id: string): Promise<User | null> => {
    const { rows } = await pool.query<User>(
        `SELECT * FROM users WHERE id = $1 LIMIT 1`,
        [id]
    );
    return rows[0] ?? null;
};

// ─── createStore ──────────────────────────────────────────────────────────────

export const createStore = async (name: string, userId: string): Promise<Store> => {
    const { rows } = await pool.query<Store>(
        `INSERT INTO stores (name, user_id)
     VALUES ($1, $2)
     RETURNING *`,
        [name, userId]
    );
    return rows[0];
};

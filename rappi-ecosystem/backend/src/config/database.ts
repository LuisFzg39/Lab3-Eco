import { Pool, PoolClient } from 'pg';
import { config } from './index';

// ─── Connection Pool ──────────────────────────────────────────────────────────
export const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    database: config.db.name,
    user: config.db.user,
    password: config.db.password,

    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// ─── Connect & Verify ─────────────────────────────────────────────────────────
export const connectDatabase = async (): Promise<void> => {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        await client.query('SELECT NOW()');
        console.log('[Database] Connected to PostgreSQL successfully');
    } catch (error) {
        console.error('[Database] Connection failed:', error);
        throw error;
    } finally {
        client?.release();
    }
};

// ─── Query Helper ─────────────────────────────────────────────────────────────
export const query = <T = unknown>(
    text: string,
    params?: unknown[]
): Promise<import('pg').QueryResult<T extends Record<string, unknown> ? T : never>> => {
    return pool.query(text, params) as Promise<import('pg').QueryResult<T extends Record<string, unknown> ? T : never>>;
};

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ─── Helper ───────────────────────────────────────────────────────────────────
const requireEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

// ─── Exported Config ─────────────────────────────────────────────────────────
export const config = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),

    db: {
        host: requireEnv('DB_HOST'),
        port: parseInt(requireEnv('DB_PORT'), 10),
        name: requireEnv('DB_NAME'),
        user: requireEnv('DB_USER'),
        password: requireEnv('DB_PASSWORD'),
    },

    supabase: {
        url: requireEnv('SUPABASE_URL'),
        key: requireEnv('SUPABASE_KEY'),
    },
} as const;

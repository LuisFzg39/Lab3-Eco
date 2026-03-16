// ─── Domain Interfaces ────────────────────────────────────────────────────────

export type UserRole = 'consumer' | 'store' | 'delivery';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    created_at: Date;
}

export type SafeUser = Omit<User, 'password'>;

export interface Store {
    id: string;
    name: string;
    is_open: boolean;
    user_id: string;
    created_at: Date;
}

// ─── Request Payloads ─────────────────────────────────────────────────────────

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface LoginPayload {
    email: string;
    password: string;
}

// ─── Service Return Types ─────────────────────────────────────────────────────

export interface AuthResult {
    user: SafeUser;
    store?: Store;
}

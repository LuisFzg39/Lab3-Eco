import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
    createUser,
    getUserByEmail,
    createStore,
} from './user.repository';
import {
    RegisterPayload,
    LoginPayload,
    AuthResult,
    SafeUser,
} from './user.types';

const SALT_ROUNDS = 10;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sanitize = (user: { id: string; name: string; email: string; password: string; role: string; created_at: Date }): SafeUser => {
    const { password: _pw, ...safe } = user;
    return safe as SafeUser;
};

// ─── registerUser ─────────────────────────────────────────────────────────────

export const registerUser = async (payload: RegisterPayload): Promise<AuthResult> => {

    const existing = await getUserByEmail(payload.email);
    if (existing) {
        throw new Error('EMAIL_TAKEN');
    }

    const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

    const user = await createUser({ ...payload, password: hashedPassword });

    const result: AuthResult = { user: sanitize(user) };

    if (payload.role === 'store') {
        const store = await createStore(
            `${user.name}'s Store`,
            user.id
        );
        result.store = store;
    }

    return result;
};

// ─── loginUser ────────────────────────────────────────────────────────────────

export const loginUser = async (payload: LoginPayload): Promise<AuthResult> => {

    const user = await getUserByEmail(payload.email);
    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(payload.password, user.password);
    if (!isMatch) {
        throw new Error('INVALID_CREDENTIALS');
    }

    return { user: sanitize(user) };
};

import { Request, Response } from 'express';
import { registerUser, loginUser } from './user.service';
import { RegisterPayload, LoginPayload } from './user.types';

// ─── POST /auth/register ──────────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body as RegisterPayload;

    if (!name || !email || !password || !role) {
        res.status(400).json({ error: 'name, email, password and role are required' });
        return;
    }

    const validRoles = ['consumer', 'store', 'delivery'];
    if (!validRoles.includes(role)) {
        res.status(400).json({ error: `role must be one of: ${validRoles.join(', ')}` });
        return;
    }

    try {
        const result = await registerUser({ name, email, password, role });
        res.status(201).json({
            message: 'User registered successfully',
            ...result,
        });
    } catch (err) {
        if (err instanceof Error && err.message === 'EMAIL_TAKEN') {
            res.status(409).json({ error: 'Email is already in use' });
            return;
        }
        console.error('[auth/register]', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ─── POST /auth/login ─────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as LoginPayload;

    if (!email || !password) {
        res.status(400).json({ error: 'email and password are required' });
        return;
    }

    try {
        const result = await loginUser({ email, password });
        res.status(200).json({
            message: 'Login successful',
            ...result,
        });
    } catch (err) {
        if (err instanceof Error && err.message === 'INVALID_CREDENTIALS') {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        console.error('[auth/login]', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

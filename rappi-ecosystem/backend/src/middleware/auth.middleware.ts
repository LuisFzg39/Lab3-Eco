import { Request, Response, NextFunction } from 'express';

export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const userId = req.headers['x-user-id'];

    if (!userId || typeof userId !== 'string') {
        res.status(401).json({ error: 'Unauthorized: missing x-user-id header' });
        return;
    }

    req.userId = userId;
    next();
};

// ─── Augment Express Request ──────────────────────────────────────────────────

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

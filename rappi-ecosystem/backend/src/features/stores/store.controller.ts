import { Request, Response } from 'express';
import {
    listOpenStores,
    findStoreById,
    findMyStore,
    openStore,
    closeStore,
} from './store.service';

// ─── Error mapper ─────────────────────────────────────────────────────────────
const handleError = (err: unknown, res: Response, context: string): void => {
    if (err instanceof Error) {
        if (err.message === 'STORE_NOT_FOUND') {
            res.status(404).json({ error: 'Store not found' });
            return;
        }
        if (err.message === 'FORBIDDEN') {
            res.status(403).json({ error: 'You do not own this store' });
            return;
        }
    }
    console.error(`[${context}]`, err);
    res.status(500).json({ error: 'Internal server error' });
};

// ─── GET /stores ──────────────────────────────────────────────────────────────
export const getOpenStores = async (_req: Request, res: Response): Promise<void> => {
    try {
        const stores = await listOpenStores();
        res.status(200).json({ stores });
    } catch (err) {
        handleError(err, res, 'GET /stores');
    }
};

// ─── GET /stores/my-store ─────────────────────────────────────────────────────
export const getMyStore = async (req: Request, res: Response): Promise<void> => {
    try {
        const store = await findMyStore(req.userId!);
        res.status(200).json({ store });
    } catch (err) {
        handleError(err, res, 'GET /stores/my-store');
    }
};

// ─── GET /stores/:id ─────────────────────────────────────────────────────────
export const getStoreById = async (req: Request, res: Response): Promise<void> => {
    try {
        const store = await findStoreById(req.params.id);
        res.status(200).json({ store });
    } catch (err) {
        handleError(err, res, 'GET /stores/:id');
    }
};

// ─── PATCH /stores/:id/open ───────────────────────────────────────────────────
export const openStoreHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const store = await openStore(req.params.id, req.userId!);
        res.status(200).json({ message: 'Store is now open', store });
    } catch (err) {
        handleError(err, res, 'PATCH /stores/:id/open');
    }
};

// ─── PATCH /stores/:id/close ──────────────────────────────────────────────────
export const closeStoreHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const store = await closeStore(req.params.id, req.userId!);
        res.status(200).json({ message: 'Store is now closed', store });
    } catch (err) {
        handleError(err, res, 'PATCH /stores/:id/close');
    }
};

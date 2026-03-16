import { Store } from '../users/user.types';
import {
    getAllOpenStores,
    getStoreById,
    getStoreByUserId,
    setStoreOpenStatus,
} from './store.repository';

// ─── listOpenStores ───────────────────────────────────────────────────────────
export const listOpenStores = async (): Promise<Store[]> => {
    return getAllOpenStores();
};

// ─── findStoreById ────────────────────────────────────────────────────────────
export const findStoreById = async (id: string): Promise<Store> => {
    const store = await getStoreById(id);
    if (!store) throw new Error('STORE_NOT_FOUND');
    return store;
};

// ─── findMyStore ──────────────────────────────────────────────────────────────
export const findMyStore = async (userId: string): Promise<Store> => {
    const store = await getStoreByUserId(userId);
    if (!store) throw new Error('STORE_NOT_FOUND');
    return store;
};

// ─── openStore ────────────────────────────────────────────────────────────────
export const openStore = async (id: string, requesterId: string): Promise<Store> => {
    const store = await getStoreById(id);
    if (!store) throw new Error('STORE_NOT_FOUND');
    if (store.user_id !== requesterId) throw new Error('FORBIDDEN');

    const updated = await setStoreOpenStatus(id, true);
    return updated!;
};

// ─── closeStore ───────────────────────────────────────────────────────────────
export const closeStore = async (id: string, requesterId: string): Promise<Store> => {
    const store = await getStoreById(id);
    if (!store) throw new Error('STORE_NOT_FOUND');
    if (store.user_id !== requesterId) throw new Error('FORBIDDEN');

    const updated = await setStoreOpenStatus(id, false);
    return updated!;
};

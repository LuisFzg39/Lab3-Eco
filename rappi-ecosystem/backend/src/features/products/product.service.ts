import { Product, CreateProductPayload, UpdateProductPayload } from './product.types';
import {
    createProduct,
    getProductsByStore,
    getProductById,
    updateProduct,
    deleteProduct,
} from './product.repository';
import { getStoreByUserId } from '../stores/store.repository';

// ─── addProduct ───────────────────────────────────────────────────────────────

export const addProduct = async (
    payload: CreateProductPayload,
    requesterId: string
): Promise<Product> => {
    const store = await getStoreByUserId(requesterId);
    if (!store) throw new Error('STORE_NOT_FOUND');
    if (store.id !== payload.store_id) throw new Error('FORBIDDEN');

    return createProduct(payload);
};

// ─── listProductsByStore ──────────────────────────────────────────────────────
export const listProductsByStore = async (storeId: string): Promise<Product[]> => {
    return getProductsByStore(storeId);
};

// ─── editProduct ──────────────────────────────────────────────────────────────

export const editProduct = async (
    productId: string,
    payload: UpdateProductPayload,
    requesterId: string
): Promise<Product> => {
    const product = await getProductById(productId);
    if (!product) throw new Error('PRODUCT_NOT_FOUND');

    const store = await getStoreByUserId(requesterId);
    if (!store || store.id !== product.store_id) throw new Error('FORBIDDEN');

    if (payload.price !== undefined && payload.price <= 0) {
        throw new Error('INVALID_PRICE');
    }

    const updated = await updateProduct(productId, payload);
    return updated!;
};

// ─── removeProduct ────────────────────────────────────────────────────────────

export const removeProduct = async (
    productId: string,
    requesterId: string
): Promise<void> => {
    const product = await getProductById(productId);
    if (!product) throw new Error('PRODUCT_NOT_FOUND');

    const store = await getStoreByUserId(requesterId);
    if (!store || store.id !== product.store_id) throw new Error('FORBIDDEN');

    await deleteProduct(productId);
};

import { Request, Response } from 'express';
import { addProduct, listProductsByStore, editProduct, removeProduct } from './product.service';
import { CreateProductPayload, UpdateProductPayload } from './product.types';

// ─── Error mapper ─────────────────────────────────────────────────────────────
const handleError = (err: unknown, res: Response, context: string): void => {
    if (err instanceof Error) {
        switch (err.message) {
            case 'PRODUCT_NOT_FOUND':
                res.status(404).json({ error: 'Product not found' });
                return;
            case 'STORE_NOT_FOUND':
                res.status(404).json({ error: 'Store not found for this user' });
                return;
            case 'FORBIDDEN':
                res.status(403).json({ error: 'You do not own this store' });
                return;
            case 'INVALID_PRICE':
                res.status(400).json({ error: 'Price must be a positive integer' });
                return;
        }
    }
    console.error(`[${context}]`, err);
    res.status(500).json({ error: 'Internal server error' });
};

// ─── POST /products ───────────────────────────────────────────────────────────
export const createProductHandler = async (req: Request, res: Response): Promise<void> => {
    const { name, price, store_id } = req.body as CreateProductPayload;

    if (!name || price === undefined || !store_id) {
        res.status(400).json({ error: 'name, price and store_id are required' });
        return;
    }
    if (typeof price !== 'number' || price <= 0) {
        res.status(400).json({ error: 'price must be a positive number' });
        return;
    }

    try {
        const product = await addProduct({ name, price, store_id }, req.userId!);
        res.status(201).json({ product });
    } catch (err) {
        handleError(err, res, 'POST /products');
    }
};

// ─── GET /stores/:storeId/products ────────────────────────────────────────────
export const getProductsByStoreHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await listProductsByStore(req.params.storeId);
        res.status(200).json({ products });
    } catch (err) {
        handleError(err, res, 'GET /stores/:storeId/products');
    }
};

// ─── PATCH /products/:id ──────────────────────────────────────────────────────
export const updateProductHandler = async (req: Request, res: Response): Promise<void> => {
    const payload = req.body as UpdateProductPayload;

    if (Object.keys(payload).length === 0) {
        res.status(400).json({ error: 'Provide at least one field to update: name or price' });
        return;
    }

    try {
        const product = await editProduct(req.params.id, payload, req.userId!);
        res.status(200).json({ product });
    } catch (err) {
        handleError(err, res, 'PATCH /products/:id');
    }
};

// ─── DELETE /products/:id ─────────────────────────────────────────────────────
export const deleteProductHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        await removeProduct(req.params.id, req.userId!);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        handleError(err, res, 'DELETE /products/:id');
    }
};

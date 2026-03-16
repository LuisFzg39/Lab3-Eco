import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/index';
import authRouter from './routes/auth.routes';
import storesRouter from './routes/stores.routes';
import productsRouter from './routes/products.routes';
import ordersRouter from './routes/orders.routes';

const app: Application = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        environment: config.nodeEnv,
        timestamp: new Date().toISOString(),
    });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/auth', authRouter);
app.use('/stores', storesRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to the Rappi Ecosystem API!' });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Error]', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

export default app;

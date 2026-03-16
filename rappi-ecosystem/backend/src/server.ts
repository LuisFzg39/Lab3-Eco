import app from './app';
import { config } from './config/index';
import { connectDatabase } from './config/database';

const startServer = async (): Promise<void> => {
    try {

        await connectDatabase();

        const port = config.port;

        app.listen(port, () => {
            console.log(`[Server] Running on http://localhost:${port}`);
            console.log(`[Server] Environment: ${config.nodeEnv}`);
            console.log(`[Server] Health check: http://localhost:${port}/health`);
        });
    } catch (error) {
        console.error('[Server] Failed to start:', error);
        process.exit(1);
    }
};

startServer();

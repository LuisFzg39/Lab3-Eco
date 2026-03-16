import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        target: 'esnext', // Fixes 'Unexpected token export' by using modern target
        rollupOptions: {
            input: {
                // Multi-page app configuration so Vite builds all three clients
                consumer: resolve(__dirname, 'consumer-app/index.html'),
                store: resolve(__dirname, 'store-app/index.html'),
                delivery: resolve(__dirname, 'delivery-app/index.html')
            }
        }
    }
});

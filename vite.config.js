import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // In development, /api is forwarded to the Express backend so no CORS setup is needed.
    proxy: {
      '/api': { target: process.env.VITE_DEV_API_PROXY || 'http://localhost:5000', changeOrigin: true },
    },
  },
});

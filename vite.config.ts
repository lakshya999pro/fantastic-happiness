import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // build straight into the backend's public folder so `node server.js`
  // serves the app at http://localhost:3000
  build: {
    outDir: process.env.VITE_OUT_DIR || '../Netflix-Backend/public',
    emptyOutDir: false,
    assetsDir: 'assets'
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true }
    }
  }
});

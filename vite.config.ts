import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-to-backend',
      closeBundle() {
        const backendPublic = path.resolve(__dirname, '../Netflix-Backend/public');
        const distDir = path.resolve(__dirname, 'dist');
        if (fs.existsSync(path.dirname(backendPublic)) && fs.existsSync(distDir)) {
          fs.cpSync(distDir, backendPublic, { recursive: true });
        }
      }
    }
  ],
  build: {
    outDir: process.env.VITE_OUT_DIR || 'dist',
    emptyOutDir: true,
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

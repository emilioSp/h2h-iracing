import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/fuel-dashboard',
  base: '/fuel-dashboard/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../../dist/fuel-dashboard',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/sse/fuel': 'http://localhost:3000',
    },
  },
});

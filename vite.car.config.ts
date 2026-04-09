import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/car-dashboard',
  base: '/car-dashboard/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../../dist/car-dashboard',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/sse/car': 'http://localhost:3000',
    },
  },
});

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/h2h-dashboard',
  base: '/h2h-dashboard/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../../dist/h2h-dashboard',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/sse/h2h': 'http://localhost:3000',
    },
  },
});

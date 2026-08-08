import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/spotter-dashboard',
  base: '/spotter-dashboard/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../../dist/spotter-dashboard',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/sse/spotter': 'http://localhost:3000',
    },
  },
});

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/traffic-dashboard',
  base: '/traffic-dashboard/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../../dist/traffic-dashboard',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/sse/traffic': 'http://localhost:3000',
    },
  },
});

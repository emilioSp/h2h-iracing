// Configures the weather overlay when Vite serves or builds browser assets.
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/weather-dashboard',
  base: '/weather-dashboard/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../../dist/weather-dashboard',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/sse/weather': 'http://localhost:3000',
    },
  },
});

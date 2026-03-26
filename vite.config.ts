import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/ui',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/sse': 'http://localhost:3000',
    },
  },
});

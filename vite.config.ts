import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      ...loadEnv('', process.cwd(), ''),
      DATA_MODE: 'mock',
    },
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
    },
  },
  root: 'src',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/sse': 'http://localhost:3000',
    },
  },
});

import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      ...loadEnv('', process.cwd(), ''),
      DATA_MODE: 'mock',
    },
    coverage: {
      include: [
        'src/server/**/*.ts',
        'examples/**/*.ts',
        'src/h2h-dashboard/src/**/*.ts',
      ],
      exclude: [
        'src/server/**/*.test.ts',
        'src/h2h-dashboard/src/**/*.test.ts',
      ],
    },
  },
});

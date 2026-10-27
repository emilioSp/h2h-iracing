// Configures fixture-backed regression tests and coverage when Vitest runs.
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: loadEnv('', process.cwd(), ''),
    setupFiles: ['./vitest-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary'],
      include: ['src/**/*.ts'],
      thresholds: {
        statements: 80,
        lines: 80,
        branches: 75,
        functions: 75,
      },
    },
  },
});

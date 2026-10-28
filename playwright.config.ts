// Runs browser tests against the real Hono server using a fixed development telemetry dump.
import { defineConfig } from '@playwright/test';

import { dataMode } from '#common/constants/data-mode.ts';
import { logLevel } from '#common/constants/log-level.ts';

const baseURL = 'http://127.0.0.1:4173';

export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  use: {
    browserName: 'chromium',
    baseURL,
    viewport: { width: 800, height: 480 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: [
      'npm run h2h:build',
      'npm run weather:build',
      'npm run car:build',
      'npm run fuel:build',
      'npm run spotter:build',
      'npm run traffic:build',
      'node src/server/server.ts',
    ].join(' && '),
    // Only checks server readiness. Test navigation uses use.baseURL.
    url: `${baseURL}/h2h`,
    reuseExistingServer: false,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 },
    env: {
      NODE_ENV: 'development',
      DATA_MODE: dataMode.MOCK,
      DUMP_FILE_PATH: 'fixture/shared-memory_multiclass.bin',
      POLL_INTERVAL_MS: '100',
      PORT: '4173',
      LOG_LEVEL: logLevel.INFO,
    },
  },
});

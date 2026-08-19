import { describe, expect, it } from 'vitest';
import { z } from 'zod/v4';

const configSchema = z.object({
  POLL_INTERVAL_MS: z.coerce.number().int().positive().default(1000),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

describe('config', () => {
  it('uses defaults when no env vars set', () => {
    const config = configSchema.parse({});
    expect(config.POLL_INTERVAL_MS).toBe(1000);
    expect(config.PORT).toBe(3000);
    expect(config.LOG_LEVEL).toBe('info');
  });

  it('accepts valid overrides', () => {
    const config = configSchema.parse({
      POLL_INTERVAL_MS: '500',
      PORT: '8080',
      LOG_LEVEL: 'debug',
    });
    expect(config.POLL_INTERVAL_MS).toBe(500);
    expect(config.PORT).toBe(8080);
    expect(config.LOG_LEVEL).toBe('debug');
  });

  it('rejects invalid PORT', () => {
    expect(() => configSchema.parse({ PORT: 'abc' })).toThrow();
  });

  it('rejects negative POLL_INTERVAL_MS', () => {
    expect(() => configSchema.parse({ POLL_INTERVAL_MS: '-1' })).toThrow();
  });
});

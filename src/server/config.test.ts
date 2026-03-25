import { describe, expect, it } from 'vitest';
import { z } from 'zod/v4';

const configSchema = z.object({
  DATA_MODE: z.enum(['live', 'mock']).default('live'),
  DUMP_FILE_PATH: z.string().default('./example/shared-memory_ai_race.bin'),
  POLL_INTERVAL_MS: z.coerce.number().int().positive().default(1000),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

describe('config', () => {
  it('uses defaults when no env vars set', () => {
    const config = configSchema.parse({});
    expect(config.DATA_MODE).toBe('live');
    expect(config.DUMP_FILE_PATH).toBe('./example/shared-memory_ai_race.bin');
    expect(config.POLL_INTERVAL_MS).toBe(1000);
    expect(config.PORT).toBe(3000);
    expect(config.LOG_LEVEL).toBe('info');
  });

  it('accepts valid overrides', () => {
    const config = configSchema.parse({
      DATA_MODE: 'mock',
      DUMP_FILE_PATH: '/tmp/test.bin',
      POLL_INTERVAL_MS: '500',
      PORT: '8080',
      LOG_LEVEL: 'debug',
    });
    expect(config.DATA_MODE).toBe('mock');
    expect(config.DUMP_FILE_PATH).toBe('/tmp/test.bin');
    expect(config.POLL_INTERVAL_MS).toBe(500);
    expect(config.PORT).toBe(8080);
    expect(config.LOG_LEVEL).toBe('debug');
  });

  it('rejects invalid DATA_MODE', () => {
    expect(() => configSchema.parse({ DATA_MODE: 'invalid' })).toThrow();
  });

  it('rejects invalid PORT', () => {
    expect(() => configSchema.parse({ PORT: 'abc' })).toThrow();
  });

  it('rejects negative POLL_INTERVAL_MS', () => {
    expect(() => configSchema.parse({ POLL_INTERVAL_MS: '-1' })).toThrow();
  });
});

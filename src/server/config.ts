import { z } from 'zod/v4';

const configSchema = z.object({
  DATA_MODE: z.enum(['live', 'mock']),
  DUMP_FILE_PATH: z.string(),
  POLL_INTERVAL_MS: z.coerce.number().int().positive(),
  PORT: z.coerce.number().int().positive(),
  LOG_LEVEL: z.enum(['debug', 'info']),
});

export type Config = z.infer<typeof configSchema>;

export default configSchema.parse({
  DATA_MODE: process.env.DATA_MODE,
  DUMP_FILE_PATH: process.env.DUMP_FILE_PATH,
  POLL_INTERVAL_MS: process.env.POLL_INTERVAL_MS,
  PORT: process.env.PORT,
  LOG_LEVEL: process.env.LOG_LEVEL,
});

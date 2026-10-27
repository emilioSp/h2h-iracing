// Validates environment settings when the backend or a monitoring CLI starts.
import { z } from 'zod/v4';

import { dataMode } from '#common/constants/data-mode.ts';
import { logLevel } from '#common/constants/log-level.ts';

const configSchema = z.object({
  DATA_MODE: z.enum(dataMode),
  DUMP_FILE_PATH: z.string(),
  POLL_INTERVAL_MS: z.coerce.number().int().positive(),
  PORT: z.coerce.number().int().positive(),
  LOG_LEVEL: z.enum(logLevel),
});

export type Config = z.infer<typeof configSchema>;

export const config = configSchema.parse({
  DATA_MODE: process.env.DATA_MODE,
  DUMP_FILE_PATH: process.env.DUMP_FILE_PATH,
  POLL_INTERVAL_MS: process.env.POLL_INTERVAL_MS,
  PORT: process.env.PORT,
  LOG_LEVEL: process.env.LOG_LEVEL,
});

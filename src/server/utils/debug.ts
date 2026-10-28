// Emits debug messages when verbose backend logging is enabled.
import { logLevel } from '#common/constants/log-level.ts';

export const debug = (...params: unknown[]) => {
  if (process.env.LOG_LEVEL === logLevel.DEBUG) {
    console.log(...params);
  }
};

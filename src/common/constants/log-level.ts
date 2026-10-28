// Defines logging levels when validating configuration and emitting debug messages.
export const logLevel = {
  DEBUG: 'debug',
  INFO: 'info',
} as const;

export type LogLevel = (typeof logLevel)[keyof typeof logLevel];

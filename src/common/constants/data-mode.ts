// Defines telemetry sources when configuring the backend and development CLIs.
export const dataMode = {
  LIVE: 'live',
  MOCK: 'mock',
} as const;

export type DataMode = (typeof dataMode)[keyof typeof dataMode];

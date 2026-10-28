// Defines gap units shared by payload validation, race calculations, and overlay formatting.
export const gapUnit = {
  SECONDS: 'seconds',
  LAPS: 'laps',
} as const;

export type GapUnit = (typeof gapUnit)[keyof typeof gapUnit];

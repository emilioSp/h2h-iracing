// Defines iRacing wetness labels when converting telemetry to weather payloads.
export const trackWetness = {
  UNKNOWN: 'Unknown',
  DRY: 'Dry',
  MOSTLY_DRY: 'Mostly Dry',
  VERY_LIGHTLY_WET: 'Very Lightly Wet',
  LIGHTLY_WET: 'Lightly Wet',
  MODERATELY_WET: 'Moderately Wet',
  VERY_WET: 'Very Wet',
  EXTREMELY_WET: 'Extremely Wet',
} as const;

export type TrackWetness = (typeof trackWetness)[keyof typeof trackWetness];

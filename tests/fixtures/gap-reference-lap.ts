// Supplies a 90-second reference lap when gap tests compare positions and finish-line wrapping.
import type { ReferenceLap } from '#repository/reference-lap.repository.ts';

export const gapReferenceLap: ReferenceLap = {
  startTime: 0,
  finishTime: 90,
  lastTrackedPct: 0.99,
  isOnPitRoad: false,
  refPoints: new Map([
    [0.02, { trackPct: 0.02, timeElapsedSinceStart: 1.8 }],
    [0.02, { trackPct: 0.022, timeElapsedSinceStart: 1.98 }],
    [0.1, { trackPct: 0.1, timeElapsedSinceStart: 9 }],
    [0.102, { trackPct: 0.10200000000000001, timeElapsedSinceStart: 9.180000000000001 }],
    [0.298, { trackPct: 0.3, timeElapsedSinceStart: 27 }],
    [0.3, { trackPct: 0.302, timeElapsedSinceStart: 27.18 }],
    [0.498, { trackPct: 0.5, timeElapsedSinceStart: 45 }],
    [0.5, { trackPct: 0.502, timeElapsedSinceStart: 45.18 }],
    [0.978, { trackPct: 0.98, timeElapsedSinceStart: 88.2 }],
    [0.98, { trackPct: 0.982, timeElapsedSinceStart: 88.38 }],
  ]),
};

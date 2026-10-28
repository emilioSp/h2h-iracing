// Supplies a 100-second reference segment when traffic tests compare estimated and recorded gaps.
import type { ReferenceLap } from '#repository/reference-lap.repository.ts';

export const trafficReferenceLap: ReferenceLap = {
  startTime: 0,
  finishTime: 100,
  lastTrackedPct: 1,
  isOnPitRoad: false,
  refPoints: new Map([
    [0.1875, { trackPct: 0.1875, timeElapsedSinceStart: 18.75 }],
    [0.1953125, { trackPct: 0.1953125, timeElapsedSinceStart: 19.53125 }],
    [0.203125, { trackPct: 0.203125, timeElapsedSinceStart: 20.3125 }],
  ]),
};

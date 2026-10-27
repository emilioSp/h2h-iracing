// Supplies six laps when tests check fastest-lap selection and expiry from a five-lap window.
import type { ReferenceLap } from '#repository/reference-lap.repository.ts';

export const referenceLapWindow: ReferenceLap[] = [
  { startTime: 0, finishTime: 45, refPoints: new Map(), lastTrackedPct: 0.99, isOnPitRoad: false },
  { startTime: 50, finishTime: 99, refPoints: new Map(), lastTrackedPct: 0.99, isOnPitRoad: false },
  {
    startTime: 99,
    finishTime: 150,
    refPoints: new Map(),
    lastTrackedPct: 0.99,
    isOnPitRoad: false,
  },
  {
    startTime: 150,
    finishTime: 200,
    refPoints: new Map(),
    lastTrackedPct: 0.99,
    isOnPitRoad: false,
  },
  {
    startTime: 200,
    finishTime: 248,
    refPoints: new Map(),
    lastTrackedPct: 0.99,
    isOnPitRoad: false,
  },
  {
    startTime: 248,
    finishTime: 300,
    refPoints: new Map(),
    lastTrackedPct: 0.99,
    isOnPitRoad: false,
  },
];

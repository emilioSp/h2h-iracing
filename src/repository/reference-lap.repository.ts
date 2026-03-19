import { VARS } from '@emiliosp/node-iracing-sdk';
import type { ReferenceLap } from '../utils/pchip.ts';
import { normalizeKey, precomputePCHIPTangents } from '../utils/pchip.ts';
import { ir } from './irsdk.repository.ts';

export type { ReferenceLap, ReferencePoint } from '../utils/pchip.ts';

const TRACK_SURFACE_ON_TRACK = 3;
const MIN_POINTS_FOR_VALID_LAP = 400;

const activeLaps = new Map<number, ReferenceLap>();
const bestLaps = new Map<number, ReferenceLap>();

const isLapClean = (trackSurface: number, isOnPitRoad: boolean): boolean =>
  trackSurface === TRACK_SURFACE_ON_TRACK && !isOnPitRoad;

const collectLapData = (
  carIdx: number,
  trackPct: number,
  sessionTime: number,
  trackSurface: number,
  isOnPitRoad: boolean,
): void => {
  const key = normalizeKey(trackPct);
  const refLap = activeLaps.get(carIdx);

  if (!refLap) {
    activeLaps.set(carIdx, {
      startTime: sessionTime,
      finishTime: -1,
      refPoints: new Map([
        [key, { trackPct, timeElapsedSinceStart: 0, tangent: undefined }],
      ]),
      lastTrackedPct: trackPct,
      isCleanLap: isLapClean(trackSurface, isOnPitRoad),
    });
    return;
  }

  const isLapComplete = refLap.lastTrackedPct > 0.95 && trackPct < 0.05;

  if (isLapComplete) {
    refLap.finishTime = sessionTime;
    const lapTime = refLap.finishTime - refLap.startTime;

    if (refLap.refPoints.size >= MIN_POINTS_FOR_VALID_LAP && lapTime > 0) {
      const best = bestLaps.get(carIdx);
      const isNewBest = best
        ? lapTime < best.finishTime - best.startTime
        : true;

      if (isNewBest && refLap.isCleanLap) {
        precomputePCHIPTangents(refLap);
        bestLaps.set(carIdx, refLap);
      }
    }

    activeLaps.set(carIdx, {
      startTime: sessionTime,
      finishTime: -1,
      refPoints: new Map([
        [key, { trackPct, timeElapsedSinceStart: 0, tangent: undefined }],
      ]),
      lastTrackedPct: trackPct,
      isCleanLap: isLapClean(trackSurface, isOnPitRoad),
    });
    return;
  }

  if (refLap.isCleanLap && isOnPitRoad) {
    refLap.isCleanLap = false;
  }

  if (!refLap.refPoints.has(key) && refLap.isCleanLap) {
    refLap.refPoints.set(key, {
      timeElapsedSinceStart: sessionTime - refLap.startTime,
      trackPct,
      tangent: undefined,
    });
    refLap.lastTrackedPct = trackPct;
  }
};

export const updateReferenceLaps = (): void => {
  const lapDistPct: number[] = ir.get(VARS.CAR_IDX_LAP_DIST_PCT) ?? [];
  const sessionTime: number = ir.get(VARS.SESSION_TIME)[0] ?? 0;
  const trackSurfaces: number[] = ir.get(VARS.CAR_IDX_TRACK_SURFACE) ?? [];
  const onPitRoad: number[] = ir.get(VARS.CAR_IDX_ON_PIT_ROAD) ?? [];

  for (let i = 0; i < lapDistPct.length; i++) {
    if ((lapDistPct[i] ?? -1) < 0) continue;
    collectLapData(
      i,
      lapDistPct[i],
      sessionTime,
      trackSurfaces[i] ?? -1,
      onPitRoad[i] === 1,
    );
  }
};

export const getBestLap = (carIdx: number): ReferenceLap | null =>
  bestLaps.get(carIdx) ?? null;

export const resetReferenceLaps = (): void => {
  activeLaps.clear();
  bestLaps.clear();
};

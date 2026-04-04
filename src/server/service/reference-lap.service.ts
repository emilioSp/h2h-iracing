import {
  getLapDistPct,
  getOnPitRoad,
  getSessionTime,
  getTrackSurfaces,
} from '#repository/irsdk.repository.ts';
import type { ReferenceLap } from '#repository/reference-lap.repository.ts';
import * as referenceLapRepository from '#repository/reference-lap.repository.ts';
import { getCarIdxs } from '#service/driver.service.ts';

const REF_POINTS_DISTANCE_METERS = 10;
const DECIMAL_PLACES = 8;

const TRACK_SURFACE_ON_TRACK = 3;
const COVERAGE_THRESHOLD = 0.6;

export const getMinPointsForValidLap = (): number =>
  Math.floor((1 / getReferenceInterval()) * COVERAGE_THRESHOLD);

let referenceInterval = 0;

export const getReferenceInterval = (): number => referenceInterval;

export const initReferenceInterval = (trackLengthMeters: number): void => {
  referenceInterval =
    trackLengthMeters > 0 ? REF_POINTS_DISTANCE_METERS / trackLengthMeters : 0;
};

// Truncates the raw percentage to the nearest referenceInterval boundary.
// Example with referenceInterval = 0.002 (5000m track, 10m buckets):
//   normalizeTrackPct(0.50734)
//   → 0.50734 % 0.002 = 0.00134  (offset past the last bucket boundary)
//   → 0.50734 - 0.00134 = 0.506  (snap to bucket boundary)
//   → toFixed(8) + parseFloat to avoid floating-point drift
export const normalizeTrackPct = (trackPct: number): number => {
  const normalizedTrackPct = Number.parseFloat(
    (trackPct - (trackPct % referenceInterval)).toFixed(DECIMAL_PLACES),
  );
  return normalizedTrackPct < 0 || normalizedTrackPct >= 1
    ? 0
    : normalizedTrackPct;
};

/**
 Example:
 Let's say we're at Daytona International Speedway (5.73 km track), lap time is 90 seconds.
 The reference lap has recorded these two adjacent reference points:

 refPoint0
 trackPct: 0.5000
 timeElapsedSinceStart: 45.0s

 refPoint1:
 trackPct: 0.5005
 timeElapsedSinceStart: 45.05s

 Now the car is currently at currentTrackPositionPct = 0.5003 (60% of the way between the two points).

 refPointKey0 = normalizeTrackPct(0.5003) = 0.5000  → looks up refPoint0
 refPointKey1 = normalizeTrackPct(0.5008) = 0.5005  → looks up refPoint1

 distanceBetweenRefPoints = 0.5005 - 0.5000 = 0.0005
 crossedFinishLine = false

 distanceBetweenRefPoints = 0.0005
 refPoint0StartTime = 45.0s
 refPoint1StartTime = 45.05s

 currentPositionBetweenRefPoints = (0.5003 - 0.5000) / 0.0005 = 0.6   (60% through the segment)

 result = 45.0 + 0.6 × (45.05 - 45.0)
 = 45.0 + 0.6 × 0.05
 = 45.0 + 0.03
 = 45.03s

 At position 50.03% of the track, the car would be 45.03 seconds into the lap.
 */

export const interpolateTimeAtTrackPosition = (
  lap: ReferenceLap,
  currentTrackPositionPct: number,
): number | null => {
  const refPointKey0 = normalizeTrackPct(currentTrackPositionPct);
  const refPointKey1 = normalizeTrackPct(
    currentTrackPositionPct + referenceInterval,
  );

  const refPoint0 = lap.refPoints.get(refPointKey0);
  const refPoint1 = lap.refPoints.get(refPointKey1);

  if (!refPoint0) return null;
  if (!refPoint1) return refPoint0.timeElapsedSinceStart;

  const crossedFinishLine = refPoint1.trackPct - refPoint0.trackPct <= 0;
  const distanceBetweenRefPoints = crossedFinishLine
    ? 1 - refPoint0.trackPct + refPoint1.trackPct
    : refPoint1.trackPct - refPoint0.trackPct;

  const refPoint0StartTime = refPoint0.timeElapsedSinceStart;
  const refPoint1StartTime = crossedFinishLine
    ? refPoint1.timeElapsedSinceStart + (lap.finishTime - lap.startTime)
    : refPoint1.timeElapsedSinceStart;

  const currentPositionBetweenRefPoints =
    (currentTrackPositionPct - refPoint0.trackPct) / distanceBetweenRefPoints;
  return (
    refPoint0StartTime +
    currentPositionBetweenRefPoints * (refPoint1StartTime - refPoint0StartTime)
  );
};

const isLapClean = (trackSurface: number, isOnPitRoad: boolean): boolean =>
  trackSurface === TRACK_SURFACE_ON_TRACK && !isOnPitRoad;

const collectLapData = (
  carIdx: number,
  trackPct: number,
  sessionTime: number,
  trackSurface: number,
  isOnPitRoad: boolean,
): void => {
  const refPointKey = normalizeTrackPct(trackPct);
  const refLap = referenceLapRepository.getActiveRefLap(carIdx);

  if (!refLap) {
    referenceLapRepository.setActiveRefLap(carIdx, {
      startTime: sessionTime,
      finishTime: -1,
      refPoints: new Map([
        [refPointKey, { trackPct, timeElapsedSinceStart: 0 }],
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

    if (
      refLap.refPoints.size >= getMinPointsForValidLap() &&
      lapTime > 0 &&
      refLap.isCleanLap
    ) {
      referenceLapRepository.addRecentLap(carIdx, refLap);
    }

    referenceLapRepository.setActiveRefLap(carIdx, {
      startTime: sessionTime,
      finishTime: -1,
      refPoints: new Map([
        [refPointKey, { trackPct, timeElapsedSinceStart: 0 }],
      ]),
      lastTrackedPct: trackPct,
      isCleanLap: isLapClean(trackSurface, isOnPitRoad),
    });
    return;
  }

  if (refLap.isCleanLap && isOnPitRoad) {
    refLap.isCleanLap = false;
  }

  if (!refLap.refPoints.has(refPointKey) && refLap.isCleanLap) {
    refLap.refPoints.set(refPointKey, {
      timeElapsedSinceStart: sessionTime - refLap.startTime,
      trackPct,
    });
    refLap.lastTrackedPct = trackPct;
  }
};

export const updateReferenceLaps = async (): Promise<void> => {
  const lapDistPct = await getLapDistPct();
  const sessionTime = await getSessionTime();
  const trackSurfaces = await getTrackSurfaces();
  const onPitRoad = await getOnPitRoad();
  const carIdxs = await getCarIdxs();

  for (const carIdx of carIdxs) {
    if ((lapDistPct[carIdx] ?? -1) < 0) continue;
    collectLapData(
      carIdx,
      lapDistPct[carIdx],
      sessionTime,
      trackSurfaces[carIdx] ?? -1,
      onPitRoad[carIdx] === 1,
    );
  }
};

export const getActiveRefLap = (carIdx: number): ReferenceLap | null =>
  referenceLapRepository.getActiveRefLap(carIdx);

export const setActiveRefLap = (carIdx: number, lap: ReferenceLap): void => {
  referenceLapRepository.setActiveRefLap(carIdx, lap);
};

export const getRefLap = (carIdx: number): ReferenceLap | null =>
  referenceLapRepository.getRefLap(carIdx);

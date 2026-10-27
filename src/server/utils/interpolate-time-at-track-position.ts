// Interpolates elapsed lap time when a gap calculation queries a reference position.
import type { ReferenceLap } from '#repository/reference-lap.repository.ts';
import { normalizeTrackPct } from '#server/utils/normalize-track-pct.ts';

export type InterpolateTimeAtTrackPositionInput = {
  lap: ReferenceLap;
  currentTrackPositionPct: number;
  referenceInterval: number;
};

export const interpolateTimeAtTrackPosition = ({
  lap,
  currentTrackPositionPct,
  referenceInterval,
}: InterpolateTimeAtTrackPositionInput): number | null => {
  const refPointKey0 = normalizeTrackPct({ trackPct: currentTrackPositionPct, referenceInterval });

  const refPointKey1 = normalizeTrackPct({
    trackPct: currentTrackPositionPct + referenceInterval,
    referenceInterval,
  });

  const refPoint0 = lap.refPoints.get(refPointKey0);
  const refPoint1 = lap.refPoints.get(refPointKey1);

  if (!refPoint0) return null;

  // We only know the time at this marker, so use it when the next marker is missing.
  if (!refPoint1) return refPoint0.timeElapsedSinceStart;

  // This is to manage the boundary case when refPoint0 is near the end of the track and refPoint1 is near the start, e.g. 98% and 0.5% respectively
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
    refPoint0StartTime + currentPositionBetweenRefPoints * (refPoint1StartTime - refPoint0StartTime)
  );
};

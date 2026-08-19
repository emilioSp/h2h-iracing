import type { ReferenceLap } from '#repository/reference-lap.repository.ts';
import { interpolateTimeAtTrackPosition } from '#service/reference-lap.service.ts';

export type EstimatedDeltaInput = {
  classLapTime: number;
  aheadPct: number;
  behindPct: number;
};

export const estimatedDelta = ({
  classLapTime,
  aheadPct,
  behindPct,
}: EstimatedDeltaInput): number => {
  let delta = aheadPct * classLapTime - behindPct * classLapTime;
  if (aheadPct < behindPct) delta += classLapTime;
  return Math.abs(delta);
};

export type ReferenceDeltaInput = {
  refLap: ReferenceLap;
  aheadPct: number;
  behindPct: number;
};

export const referenceDelta = ({
  refLap,
  aheadPct,
  behindPct,
}: ReferenceDeltaInput): number => {
  const timeAhead =
    interpolateTimeAtTrackPosition({
      lap: refLap,
      currentTrackPositionPct: aheadPct,
    }) ?? 0;
  const timeBehind =
    interpolateTimeAtTrackPosition({
      lap: refLap,
      currentTrackPositionPct: behindPct,
    }) ?? 0;
  let delta = timeAhead - timeBehind;
  const lapTime = refLap.finishTime - refLap.startTime;
  if (aheadPct < behindPct) delta += lapTime;
  return Math.abs(delta);
};

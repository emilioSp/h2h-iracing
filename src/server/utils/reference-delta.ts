// Computes a gap from sampled lap data when a reference lap is available.
import type { ReferenceLap } from '#repository/reference-lap.repository.ts';
import { interpolateTimeAtTrackPosition } from '#server/utils/interpolate-time-at-track-position.ts';

export type ReferenceDeltaInput = {
  refLap: ReferenceLap;
  aheadPct: number;
  behindPct: number;
  referenceInterval: number;
};

export const referenceDelta = ({
  refLap,
  aheadPct,
  behindPct,
  referenceInterval,
}: ReferenceDeltaInput): number => {
  const timeAhead =
    interpolateTimeAtTrackPosition({
      lap: refLap,
      currentTrackPositionPct: aheadPct,
      referenceInterval,
    }) ?? 0;

  const timeBehind =
    interpolateTimeAtTrackPosition({
      lap: refLap,
      currentTrackPositionPct: behindPct,
      referenceInterval,
    }) ?? 0;

  const delta = timeAhead - timeBehind;
  const lapTime = refLap.finishTime - refLap.startTime;

  return Math.abs(aheadPct < behindPct ? delta + lapTime : delta);
};

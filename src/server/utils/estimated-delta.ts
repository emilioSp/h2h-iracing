// Estimates a forward time gap when reference lap data is unavailable.
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
  const delta = aheadPct * classLapTime - behindPct * classLapTime;

  return Math.abs(aheadPct < behindPct ? delta + classLapTime : delta);
};

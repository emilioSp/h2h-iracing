// Lap position is a loop: 0% and 100% are the same point on track.
// Two cars side by side across the line read 0.9999 and 0.0001 -> a raw diff of
// -0.9998, nearly a full lap, instead of the real ~1 m. Any diff over half a lap
// wrapped, so take the short way round.
export const wrapLapDelta = (delta: number): number => {
  if (delta > 0.5) return delta - 1;
  if (delta < -0.5) return delta + 1;
  return delta;
};
